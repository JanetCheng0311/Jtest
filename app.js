// Jtest front-end. Plain JavaScript, no frameworks, no server required.
// Works locally and on GitHub Pages: deck data is fetched from data/*.json
// and your scores are saved in the browser (localStorage).

// ---- the decks (edit here to add your own; create a matching data/<id>.json) ----
const DECKS = [
  { category: "kana", items: [
    { id: "hiragana", label: "Hiragana", kana: true },
    { id: "katakana", label: "Katakana", kana: true },
  ]},
  { category: "vocab", items: [
    { id: "vocab_n5", label: "Vocab N5" },
    { id: "vocab_n4", label: "Vocab N4" },
    { id: "vocab_n3", label: "Vocab N3" },
    { id: "vocab_n2", label: "Vocab N2" },
    { id: "vocab_n1", label: "Vocab N1" },
  ]},
  { category: "kanji", items: [
    { id: "kanji_n5", label: "Kanji N5" },
    { id: "kanji_n4", label: "Kanji N4" },
    { id: "kanji_n3", label: "Kanji N3" },
    { id: "kanji_n2", label: "Kanji N2" },
  ]},
  { category: "grammar", items: [
    { id: "grammar_n5", label: "Grammar N5" },
    { id: "grammar_n4", label: "Grammar N4" },
    { id: "grammar_n3", label: "Grammar N3" },
    { id: "grammar_n2", label: "Grammar N2" },
    { id: "grammar_n1", label: "Grammar N1" },
  ]},
];

// ---- interface text in two languages (English + Traditional Chinese) ----
const UI = {
  en: {
    introHTML: "Pick a deck to study. New here? Start with <b>Hiragana</b>.",
    cat_kana: "Kana (start here)", cat_vocab: "Vocabulary",
    cat_kanji: "Kanji", cat_grammar: "Grammar",
    backToDecks: "← Decks",
    studyHeading: "📖 Study", flashcards: "Flashcards",
    quizHeading: "📝 Quiz",
    directionLabel: "Direction", answerInLabel: "Answer in",
    questionsLabel: "Questions", count_all: "All",
    dir_jp2mean: "Japanese → Meaning",
    dir_read2mean: "Reading (kana) → Meaning",
    dir_mean2jp: "Meaning → Japanese",
    lang_en: "English",
    startQuiz: "Start quiz",
    tipHint: "Tip: try every direction to really learn each word.",
    kanaHint: "Kana decks quiz the romaji reading.",
    clickToFlip: "click the card to flip",
    prev: "‹ Prev", flip: "Flip", next: "Next ›",
    quizFinished: "Quiz finished! 🎉",
    tryAgain: "Try again", backToDeck: "Back to deck",
    footer: "Made for learning Japanese · runs on Windows, Mac & online",
    askMeaning: "What does this mean?",
    askJapanese: "Which Japanese is this?",
    correct: "✓ Correct!",
    notTried: "not tried yet",
    bestPct: (p) => "best " + p + "%",
    cardOf: (a, b) => "Card " + a + " / " + b,
    questionOf: (a, b, s) => "Question " + a + " / " + b + " · Score " + s,
    deckStats: (n, best) => n + " cards · " + (best ? "best score " + best + "%" : "no quiz yet"),
  },
  zh: {
    introHTML: "選擇一個牌組開始學習。初學者請從 <b>平假名 (Hiragana)</b> 開始。",
    cat_kana: "假名（從這裡開始）", cat_vocab: "單字",
    cat_kanji: "漢字", cat_grammar: "文法",
    backToDecks: "← 牌組",
    studyHeading: "📖 學習", flashcards: "字卡",
    quizHeading: "📝 測驗",
    directionLabel: "方向", answerInLabel: "作答語言",
    questionsLabel: "題數", count_all: "全部",
    dir_jp2mean: "日文 → 意思",
    dir_read2mean: "讀音（假名） → 意思",
    dir_mean2jp: "意思 → 日文",
    lang_en: "英文",
    startQuiz: "開始測驗",
    tipHint: "小提示：每個方向都練習，記得更牢。",
    kanaHint: "假名牌組測驗羅馬拼音讀音。",
    clickToFlip: "點一下卡片翻面",
    prev: "‹ 上一個", flip: "翻面", next: "下一個 ›",
    quizFinished: "測驗完成！🎉",
    tryAgain: "再試一次", backToDeck: "回到牌組",
    footer: "為學習日語而做 · 可在 Windows、Mac 及線上使用",
    askMeaning: "這是什麼意思？",
    askJapanese: "這是哪個日文？",
    correct: "✓ 答對了！",
    notTried: "尚未測驗",
    bestPct: (p) => "最佳 " + p + "%",
    cardOf: (a, b) => "字卡 " + a + " / " + b,
    questionOf: (a, b, s) => "第 " + a + " / " + b + " 題 · 得分 " + s,
    deckStats: (n, best) => n + " 張卡片 · " + (best ? "最佳成績 " + best + "%" : "尚未測驗"),
  },
};

const PROGRESS_KEY = "jtest_progress_v1";
const PREFS_KEY = "jtest_prefs_v1";

const views = ["homeView", "deckView", "studyView", "quizView", "resultView"];
function show(view) {
  views.forEach(v => document.getElementById(v).hidden = (v !== view));
  document.getElementById("homeBtn").hidden = (view === "homeView");
}

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("could not load " + url);
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

// ---- storage ----
function loadJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) || {}; }
  catch (e) { return {}; }
}
function loadProgress() { return loadJSON(PROGRESS_KEY); }
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }
function loadPrefs() { return loadJSON(PREFS_KEY); }
function savePrefs(p) { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); }

// ---- app state ----
let progress = loadProgress();
let prefs = loadPrefs();
let uiLang = prefs.uiLang === "zh" ? "zh" : "en";
let current = null;  // { id, label, kana, cards }
let study = { order: [], pos: 0, flipped: false };
let quiz = { order: [], pos: 0, score: 0, answered: false, dir: "jp2mean", lang: "en" };

// translate helper: returns a string, or calls the function form with args
function t(key, ...args) {
  let v = (UI[uiLang] && UI[uiLang][key]);
  if (v === undefined) v = UI.en[key];
  return typeof v === "function" ? v(...args) : v;
}

// the meaning text for a card in the chosen answer language
function meaningOf(card, lang) {
  if (lang === "zht" && card.zht) return card.zht;
  if (lang === "zhs" && card.zhs) return card.zhs;
  return card.meaning || card.reading;
}

// ---- apply interface language to the static text ----
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.getElementById("intro").innerHTML = t("introHTML");
  document.getElementById("footerText").textContent = t("footer");
  document.getElementById("uiLangBtn").textContent = uiLang === "en" ? "中文" : "EN";
  document.documentElement.lang = uiLang === "en" ? "en" : "zh-Hant";
  renderHome();
  if (!document.getElementById("deckView").hidden && current) refreshDeckMenuText();
}

// ---- home ----
function renderHome() {
  const root = document.getElementById("deckList");
  root.innerHTML = "";
  DECKS.forEach(group => {
    const g = document.createElement("div");
    g.className = "deck-group";
    const h = document.createElement("h3");
    h.textContent = t("cat_" + group.category);
    g.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "deck-grid";
    group.items.forEach(item => {
      const best = (progress[item.id] && progress[item.id].bestPercent) || 0;
      const card = document.createElement("button");
      card.className = "deck-card";
      card.innerHTML =
        `<b>${item.label}</b>` +
        `<span class="count">${best ? t("bestPct", best) : t("notTried")}</span>` +
        `<span class="bestbar"><i style="width:${best}%"></i></span>`;
      card.onclick = () => openDeck(item);
      grid.appendChild(card);
    });
    g.appendChild(grid);
    root.appendChild(g);
  });
}

// ---- deck menu ----
function refreshDeckMenuText() {
  const best = (progress[current.id] && progress[current.id].bestPercent) || 0;
  document.getElementById("deckStats").textContent = t("deckStats", current.cards.length, best);
  // the reading and language options don't apply to kana decks
  document.getElementById("quizDir").querySelector('option[value="read2mean"]').hidden = current.kana;
  document.getElementById("quizLang").parentElement.style.display = current.kana ? "none" : "";
  document.getElementById("langHint").textContent = current.kana ? t("kanaHint") : t("tipHint");
}

async function openDeck(item) {
  let cards;
  try { cards = await getJSON("data/" + item.id + ".json"); }
  catch (e) { alert("Sorry, could not load this deck."); return; }
  current = { id: item.id, label: item.label, kana: !!item.kana, cards };
  document.getElementById("deckTitle").textContent = item.label;
  if (prefs.dir && !(item.kana && prefs.dir === "read2mean"))
    document.getElementById("quizDir").value = prefs.dir;
  else document.getElementById("quizDir").value = "jp2mean";
  if (prefs.lang) document.getElementById("quizLang").value = prefs.lang;
  if (prefs.count) document.getElementById("quizCount").value = prefs.count;
  refreshDeckMenuText();
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
  const lines = [`<div class="reading">${c.reading}</div>`,
                 `<div class="meaning">${c.meaning}</div>`];
  if (c.zht) lines.push(`<div class="meaning">繁 ${c.zht}</div>`);
  if (c.zhs) lines.push(`<div class="meaning">简 ${c.zhs}</div>`);
  const back = document.getElementById("cardBack");
  back.innerHTML = lines.join("");
  back.hidden = !study.flipped;
  document.getElementById("cardFront").hidden = study.flipped;
  document.getElementById("studyProgress").textContent =
    t("cardOf", study.pos + 1, study.order.length);
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
  const dir = document.getElementById("quizDir").value;
  const lang = current.kana ? "en" : document.getElementById("quizLang").value;
  const countVal = document.getElementById("quizCount").value;
  prefs.dir = dir; prefs.lang = document.getElementById("quizLang").value;
  prefs.count = countVal;
  savePrefs(prefs);
  const n = countVal === "all"
    ? current.cards.length
    : Math.min(parseInt(countVal, 10), current.cards.length);
  quiz = {
    order: shuffle(current.cards).slice(0, n),
    pos: 0, score: 0, answered: false, dir, lang,
  };
  renderQuiz();
  show("quizView");
}

function renderQuiz() {
  const c = quiz.order[quiz.pos];
  quiz.answered = false;
  document.getElementById("quizProgress").textContent =
    t("questionOf", quiz.pos + 1, quiz.order.length, quiz.score);
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("quizFeedback").className = "feedback";
  document.getElementById("quizNextBtn").hidden = true;

  // decide what the question shows and what an option's text is
  let promptMain, promptSub, optionOf, correct;
  if (quiz.dir === "mean2jp") {
    promptMain = meaningOf(c, quiz.lang);
    promptSub = t("askJapanese");
    optionOf = (x) => x.front;
    correct = c.front;
  } else {
    promptMain = quiz.dir === "read2mean" ? c.reading : c.front;
    promptSub = t("askMeaning");
    optionOf = (x) => meaningOf(x, quiz.lang);
    correct = meaningOf(c, quiz.lang);
  }
  document.getElementById("quizQuestion").innerHTML =
    `${promptMain}<div class="small">${promptSub}</div>`;

  const distractors = shuffle(current.cards.filter(x => optionOf(x) !== correct))
    .slice(0, 3).map(optionOf);
  const options = shuffle([correct, ...distractors]);

  const box = document.getElementById("quizOptions");
  box.innerHTML = "";
  options.forEach(opt => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = opt;
    b.onclick = () => answer(b, opt, c, correct);
    box.appendChild(b);
  });
}

function answer(btn, chosen, card, correct) {
  if (quiz.answered) return;
  quiz.answered = true;
  document.querySelectorAll(".option").forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add("correct");
  });
  const fb = document.getElementById("quizFeedback");
  if (chosen === correct) {
    quiz.score++;
    fb.textContent = t("correct");
    fb.className = "feedback good";
  } else {
    btn.classList.add("wrong");
    fb.textContent = `✗ ${card.front}（${card.reading}） = ${meaningOf(card, quiz.lang)}`;
    fb.className = "feedback bad";
  }
  document.getElementById("quizNextBtn").hidden = false;
}

function nextQuiz() {
  if (quiz.pos < quiz.order.length - 1) { quiz.pos++; renderQuiz(); }
  else finishQuiz();
}
function finishQuiz() {
  const pct = Math.round((quiz.score / quiz.order.length) * 100);
  document.getElementById("resultScore").textContent =
    `${quiz.score} / ${quiz.order.length}  (${pct}%)`;
  const prev = progress[current.id] || { bestPercent: 0, attempts: 0 };
  progress[current.id] = {
    bestPercent: Math.max(prev.bestPercent || 0, pct),
    attempts: (prev.attempts || 0) + 1,
  };
  saveProgress(progress);
  show("resultView");
}

// ---- toggle interface language ----
function toggleUiLang() {
  uiLang = uiLang === "en" ? "zh" : "en";
  prefs.uiLang = uiLang;
  savePrefs(prefs);
  applyI18n();
}

function goHome() { renderHome(); show("homeView"); }

// ---- wire up ----
document.getElementById("logo").onclick = goHome;
document.getElementById("homeBtn").onclick = goHome;
document.getElementById("uiLangBtn").onclick = toggleUiLang;
document.getElementById("studyBtn").onclick = startStudy;
document.getElementById("quizBtn").onclick = startQuiz;
document.getElementById("flashcard").onclick = flipCard;
document.getElementById("flipBtn").onclick = (e) => { e.stopPropagation(); flipCard(); };
document.getElementById("nextBtn").onclick = nextCard;
document.getElementById("prevBtn").onclick = prevCard;
document.getElementById("quizNextBtn").onclick = nextQuiz;
document.getElementById("retryBtn").onclick = startQuiz;
document.getElementById("backToDeckBtn").onclick = () => openDeck(current);

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("studyView").hidden) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCard(); }
    if (e.key === "ArrowRight") nextCard();
    if (e.key === "ArrowLeft") prevCard();
  }
});

applyI18n();
show("homeView");
