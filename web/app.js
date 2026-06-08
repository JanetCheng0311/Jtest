// Jtest front-end. Plain JavaScript, no frameworks.
// It talks to the small Python server (app.py) for deck data and progress.

const views = ["homeView", "deckView", "studyView", "quizView", "resultView"];
function show(view) {
  views.forEach(v => document.getElementById(v).hidden = (v !== view));
  document.getElementById("homeBtn").hidden = (view === "homeView");
}

// ---- simple helpers ----
async function getJSON(url) {
  const r = await fetch(url);
  return r.json();
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- app state ----
let allDecks = [];      // grouped deck metadata from the server
let progress = {};      // { deckId: { bestPercent: number, attempts: number } }
let current = null;     // { id, label, cards }
let study = { order: [], pos: 0, flipped: false };
let quiz = { order: [], pos: 0, score: 0, answered: false };

// ---- load home page ----
async function init() {
  allDecks = await getJSON("/api/decks");
  progress = await getJSON("/api/progress");
  renderHome();
  show("homeView");
}

function renderHome() {
  const root = document.getElementById("deckList");
  root.innerHTML = "";
  allDecks.forEach(group => {
    const g = document.createElement("div");
    g.className = "deck-group";
    const h = document.createElement("h3");
    h.textContent = group.category;
    g.appendChild(h);

    const grid = document.createElement("div");
    grid.className = "deck-grid";
    group.items.forEach(item => {
      const best = (progress[item.id] && progress[item.id].bestPercent) || 0;
      const card = document.createElement("button");
      card.className = "deck-card";
      card.innerHTML =
        `<b>${item.label}</b>` +
        `<span class="count">${best ? "best " + best + "%" : "not tried yet"}</span>` +
        `<span class="bestbar"><i style="width:${best}%"></i></span>`;
      card.onclick = () => openDeck(item);
      grid.appendChild(card);
    });
    g.appendChild(grid);
    root.appendChild(g);
  });
}

// ---- deck menu ----
async function openDeck(item) {
  const cards = await getJSON("/api/deck/" + item.id);
  current = { id: item.id, label: item.label, cards };
  document.getElementById("deckTitle").textContent = item.label;
  const best = (progress[item.id] && progress[item.id].bestPercent) || 0;
  document.getElementById("deckStats").textContent =
    `${cards.length} cards · ${best ? "best score " + best + "%" : "no quiz yet"}`;
  show("deckView");
}

// ---- flashcard study ----
function startStudy() {
  study = { order: shuffle(current.cards), pos: 0, flipped: false };
  renderCard();
  show("studyView");
}
function renderCard() {
  const c = study.order[study.pos];
  document.getElementById("cardFront").textContent = c.front;
  const back = document.getElementById("cardBack");
  back.innerHTML =
    `<div class="reading">${c.reading}</div><div class="meaning">${c.meaning}</div>`;
  back.hidden = !study.flipped;
  document.getElementById("cardFront").hidden = study.flipped;
  document.getElementById("studyProgress").textContent =
    `Card ${study.pos + 1} / ${study.order.length}`;
  document.getElementById("prevBtn").disabled = (study.pos === 0);
  document.getElementById("nextBtn").disabled = (study.pos === study.order.length - 1);
}
function flipCard() { study.flipped = !study.flipped; renderCard(); }
function nextCard() {
  if (study.pos < study.order.length - 1) { study.pos++; study.flipped = false; renderCard(); }
}
function prevCard() {
  if (study.pos > 0) { study.pos--; study.flipped = false; renderCard(); }
}

// ---- quiz ----
function startQuiz() {
  quiz = { order: shuffle(current.cards).slice(0, 10), pos: 0, score: 0, answered: false };
  renderQuiz();
  show("quizView");
}
function renderQuiz() {
  const c = quiz.order[quiz.pos];
  quiz.answered = false;
  document.getElementById("quizProgress").textContent =
    `Question ${quiz.pos + 1} / ${quiz.order.length} · Score ${quiz.score}`;
  document.getElementById("quizQuestion").innerHTML =
    `${c.front}<div class="small">What does this mean?</div>`;
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("quizFeedback").className = "feedback";
  document.getElementById("quizNextBtn").hidden = true;

  // build 4 options: the correct meaning + 3 random distractors
  const others = shuffle(current.cards.filter(x => x.meaning !== c.meaning))
    .slice(0, 3)
    .map(x => x.meaning);
  const options = shuffle([c.meaning, ...others]);

  const box = document.getElementById("quizOptions");
  box.innerHTML = "";
  options.forEach(opt => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = opt;
    b.onclick = () => answer(b, opt, c);
    box.appendChild(b);
  });
}
function answer(btn, chosen, card) {
  if (quiz.answered) return;
  quiz.answered = true;
  const buttons = document.querySelectorAll(".option");
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === card.meaning) b.classList.add("correct");
  });
  const fb = document.getElementById("quizFeedback");
  if (chosen === card.meaning) {
    quiz.score++;
    fb.textContent = "✓ Correct!";
    fb.className = "feedback good";
  } else {
    btn.classList.add("wrong");
    fb.textContent = `✗ ${card.front} (${card.reading}) = ${card.meaning}`;
    fb.className = "feedback bad";
  }
  document.getElementById("quizNextBtn").hidden = false;
}
function nextQuiz() {
  if (quiz.pos < quiz.order.length - 1) { quiz.pos++; renderQuiz(); }
  else finishQuiz();
}
async function finishQuiz() {
  const pct = Math.round((quiz.score / quiz.order.length) * 100);
  document.getElementById("resultScore").textContent =
    `${quiz.score} / ${quiz.order.length}  (${pct}%)`;
  // save best score
  const prev = progress[current.id] || { bestPercent: 0, attempts: 0 };
  progress[current.id] = {
    bestPercent: Math.max(prev.bestPercent || 0, pct),
    attempts: (prev.attempts || 0) + 1,
  };
  await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(progress),
  });
  show("resultView");
}

// ---- wire up buttons ----
document.getElementById("homeBtn").onclick = () => { renderHome(); show("homeView"); };
document.getElementById("studyBtn").onclick = startStudy;
document.getElementById("quizBtn").onclick = startQuiz;
document.getElementById("flashcard").onclick = flipCard;
document.getElementById("flipBtn").onclick = (e) => { e.stopPropagation(); flipCard(); };
document.getElementById("nextBtn").onclick = nextCard;
document.getElementById("prevBtn").onclick = prevCard;
document.getElementById("quizNextBtn").onclick = nextQuiz;
document.getElementById("retryBtn").onclick = startQuiz;
document.getElementById("backToDeckBtn").onclick = () => openDeck(current);

// keyboard shortcuts for the flashcards
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("studyView").hidden) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCard(); }
    if (e.key === "ArrowRight") nextCard();
    if (e.key === "ArrowLeft") prevCard();
  }
});

init();
