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
    resourcesBtn: "📚 Learning path & free resources",
    resourcesTitle: "Learning path for beginners",
    resourcesIntro: "A step-by-step path. Just start at Stage 0 and click the ▶ link — do the rest after. Everything here is free.",
    resourcesNote: "These open free outside websites in a new tab. Learn from them; the reading sites are copyrighted, so don't copy their text.",
    goalLabel: "Goal",
    inAppLabel: "In this app",
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
    resourcesBtn: "📚 學習路線與免費資源",
    resourcesTitle: "新手學習路線",
    resourcesIntro: "給新手的步驟式路線。先從「階段 0」開始，點 ▶ 的連結就好，其他做完再看。這裡全部免費。",
    resourcesNote: "這些會在新分頁打開外部免費網站。可以從中學習；閱讀類網站有版權，請勿複製其文字。",
    goalLabel: "目標",
    inAppLabel: "配合本 app",
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

// ---- the learning path shown on the Resources page (bilingual) ----
const RESOURCES = [
  {
    stage: { en: "Stage 0", zh: "階段 0" },
    title: { en: "Learn the kana (hiragana + katakana)",
             zh: "先學會假名（平假名＋片假名）" },
    note: { en: "The Japanese alphabet — learn this first. Spend your first week only on this.",
            zh: "日文的字母，一定要先會。第一週只專心做這件事。" },
    links: [
      { url: "https://www.sigure.tw/learn-japanese/basic/50/seion",
        label: { en: "Full 50-sounds (kana) guide", zh: "五十音教學完整版" }, primary: true },
      { url: "https://www.sigure.tw/learn-japanese/basic/50/dakuon-youon-chouon-sokuon",
        label: { en: "Dakuten / combined / long / small-tsu sounds", zh: "濁音、半濁音、拗音、長音、促音" } },
      { url: "https://www.sigure.tw/quiz/practice/50/",
        label: { en: "50-sounds practice trainer", zh: "50 音練習機" } },
    ],
    inApp: { en: "Practise the Hiragana & Katakana decks.", zh: "練 Hiragana 和 Katakana 牌組。" },
    goal: { en: "See あ / カ and read it instantly (about 1–2 weeks).",
            zh: "看到 あ／カ 能馬上唸出來（約 1–2 週）。" },
  },
  {
    stage: { en: "Stage 1", zh: "階段 1" },
    title: { en: "Understand how Japanese sentences work", zh: "先懂日文怎麼組句（基礎觀念）" },
    note: { en: "Don't memorise tons yet. First understand particles は・が・を and です／だ.",
            zh: "先別急著背一堆。先理解助詞 は・が・を 和 です／だ。" },
    links: [
      { url: "https://ayajiro.github.io/jpgramma_zhtw/",
        label: { en: "Tae Kim grammar guide (Chinese) — start from the beginning",
                 zh: "Tae Kim 文法指南（繁體）— 從頭開始讀" }, primary: true },
    ],
    goal: { en: "Understand the structure of a basic sentence like 'I am a student'.",
            zh: "看懂「我是學生」這種基本句子的結構。" },
  },
  {
    stage: { en: "Stage 2", zh: "階段 2" },
    title: { en: "Prepare for N5 (the first exam level)", zh: "正式準備 N5（最入門的檢定）" },
    links: [
      { url: "https://www.sigure.tw/learn-japanese/grammar/n5/",
        label: { en: "N5 grammar", zh: "N5 文法" }, primary: true },
      { url: "https://www.sigure.tw/learn-japanese/vocabulary/n5/",
        label: { en: "N5 vocabulary", zh: "N5 單字" } },
      { url: "https://www.sigure.tw/quiz/grammar/n5/",
        label: { en: "N5 grammar quiz", zh: "N5 文法測驗" } },
      { url: "https://www.jlpt.jp/tw/samples/forlearners.html",
        label: { en: "Official JLPT sample questions", zh: "JLPT 官方樣題（繁體）" } },
    ],
    inApp: { en: "Use the Vocab N5 / Kanji N5 / Grammar N5 decks.", zh: "用 Vocab N5 / Kanji N5 / Grammar N5 牌組。" },
    goal: { en: "Be able to pass N5.", zh: "能通過 N5。" },
  },
  {
    stage: { en: "Stage 3", zh: "階段 3" },
    title: { en: "N4 → N3 (intermediate)", zh: "N4 → N3（中級）" },
    note: { en: "Same website, just a different level.", zh: "同一個網站，只是換等級。" },
    links: [
      { url: "https://www.sigure.tw/learn-japanese/grammar/n4/",
        label: { en: "N4 grammar", zh: "N4 文法" }, primary: true },
      { url: "https://www.sigure.tw/learn-japanese/grammar/n3/",
        label: { en: "N3 grammar", zh: "N3 文法" } },
    ],
    inApp: { en: "Review with the N4 / N3 decks.", zh: "用 N4 / N3 牌組複習。" },
    goal: { en: "Understand everyday conversation and simple texts.", zh: "看懂日常對話和簡單文章。" },
  },
  {
    stage: { en: "Stage 4", zh: "階段 4" },
    title: { en: "N2 → N1 (upper level)", zh: "N2 → N1（中高級）" },
    note: { en: "Now the key is lots of reading and listening.", zh: "這階段重點是大量閱讀和聽力。" },
    links: [
      { url: "https://www.sigure.tw/learn-japanese/grammar/n2/",
        label: { en: "N2 grammar", zh: "N2 文法" }, primary: true },
      { url: "https://www.sigure.tw/learn-japanese/grammar/n1/",
        label: { en: "N1 grammar", zh: "N1 文法" } },
    ],
    inApp: { en: "Review with the N2 / N1 decks.", zh: "用 N2 / N1 牌組複習。" },
    goal: { en: "Understand news and reports.", zh: "看懂新聞和報告。" },
  },
  {
    stage: { en: "📄 PDF", zh: "📄 PDF" },
    title: { en: "Free PDF textbooks (download & print)", zh: "免費 PDF 教材（可下載、列印）" },
    note: { en: "Official, 100% legal free textbooks from the Japan Foundation. Great to print or read offline. (The books are in Japanese, with free Chinese vocabulary translations on the site.)",
            zh: "日本國際交流基金會官方、完全合法的免費教材。可印出來或離線閱讀。（課本為日文，網站另附免費中文單字翻譯。）" },
    links: [
      { url: "https://www.irodori.jpf.go.jp/en/starter/pdf.html",
        label: { en: "Irodori — Starter (A1) PDF", zh: "Irodori 入門 (A1) PDF" }, primary: true },
      { url: "https://www.irodori.jpf.go.jp/en/elementary01/pdf.html",
        label: { en: "Irodori — Elementary 1 (A2) PDF", zh: "Irodori 初級 1 (A2) PDF" } },
      { url: "https://www.irodori.jpf.go.jp/en/elementary02/pdf.html",
        label: { en: "Irodori — Elementary 2 (A2) PDF", zh: "Irodori 初級 2 (A2) PDF" } },
      { url: "https://www.irodori.jpf.go.jp/en/pre-intermediate/pdf.html",
        label: { en: "Irodori — Pre-Intermediate (A2/B1) PDF", zh: "Irodori 中級前 (A2/B1) PDF" } },
      { url: "https://marugoto.jpf.go.jp/en/download/",
        label: { en: "Marugoto — free materials", zh: "Marugoto 免費教材下載" } },
      { url: "https://www.jlpt.jp/tw/samples/sampleindex.html",
        label: { en: "Official JLPT sample-question PDFs", zh: "JLPT 官方樣題 PDF（繁體）" } },
      { url: "https://www.guidetojapanese.org/jp_grammar_guide.pdf",
        label: { en: "Tae Kim grammar guide (PDF)", zh: "Tae Kim 文法指南 PDF（英文）" } },
    ],
    goal: { en: "Start with Irodori Starter if you want a proper textbook to follow.",
            zh: "想要一本正式課本跟著走，就從 Irodori 入門開始。" },
  },
];

const PROGRESS_KEY = "jtest_progress_v1";
const PREFS_KEY = "jtest_prefs_v1";

const views = ["homeView", "deckView", "studyView", "quizView", "resultView", "resourcesView"];
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
  document.getElementById("resourcesTitle").textContent = t("resourcesTitle");
  document.getElementById("resourcesIntro").textContent = t("resourcesIntro");
  document.getElementById("resourcesNote").textContent = t("resourcesNote");
  document.documentElement.lang = uiLang === "en" ? "en" : "zh-Hant";
  renderHome();
  renderResources();
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

// ---- resources / learning path ----
function tx(obj) { return (obj && (obj[uiLang] || obj.en)) || ""; }

function renderResources() {
  const root = document.getElementById("resourcesList");
  root.innerHTML = "";
  RESOURCES.forEach(item => {
    const box = document.createElement("div");
    box.className = "stage";
    let html = `<div class="stage-head"><span class="stage-tag">${tx(item.stage)}</span>` +
               `<span class="stage-title">${tx(item.title)}</span></div>`;
    if (item.note) html += `<p class="stage-note">${tx(item.note)}</p>`;
    html += `<div class="stage-links">`;
    item.links.forEach(lnk => {
      const mark = lnk.primary ? "▶ " : "";
      html += `<a class="res-link${lnk.primary ? " primary" : ""}" href="${lnk.url}" ` +
              `target="_blank" rel="noopener">${mark}${tx(lnk.label)}</a>`;
    });
    html += `</div>`;
    if (item.inApp) html += `<p class="stage-meta"><b>${t("inAppLabel")}:</b> ${tx(item.inApp)}</p>`;
    if (item.goal) html += `<p class="stage-meta">🎯 <b>${t("goalLabel")}:</b> ${tx(item.goal)}</p>`;
    box.innerHTML = html;
    root.appendChild(box);
  });
}
function openResources() { renderResources(); show("resourcesView"); }

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
document.getElementById("resourcesBtn").onclick = openResources;
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
