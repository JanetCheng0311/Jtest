# Jtest — Learn Japanese (JLPT N5–N1)

A simple study app for the Japanese JLPT levels **N5 → N1**. It runs in any
web browser and works the same on **Windows, Mac, and online**.

The interface is available in **English** and **繁體中文 (Traditional Chinese)** —
tap the language button (top-right) to switch.

It has flashcards and multiple-choice quizzes for:

- **Hiragana & Katakana** (start here if you're a beginner)
- **Vocabulary** — N5, N4, N3, N2, N1
- **Kanji** — N5, N4, N3, N2
- **Grammar** — N5, N4, N3, N2, N1

Every word also shows **English + 中文（繁體 / 简体）**. Your best quiz score for
each deck is saved automatically in your browser.

---

## Open it online (easiest)

👉 **https://janetcheng0311.github.io/Jtest/**

Nothing to install — just open the link in any browser, on any computer or phone.

---

## Run it on your own computer (optional)

1. **Install Python 3** from <https://www.python.org/downloads/>
   (on Windows, tick **"Add Python to PATH"** during install).
2. Open a terminal / command prompt **in this folder**, then run:

   - **Windows:** `python app.py`
   - **Mac:** `python3 app.py`

3. Your browser opens automatically at <http://localhost:8000>.
   Press **Ctrl + C** in the terminal to stop.

> Tip: opening `index.html` directly (file://) will *not* work, because
> browsers block loading the data files that way. Use the online link or
> `python app.py`.

---

## How to use it

1. Pick a deck (beginners: start with **Hiragana**).
2. **Study (字卡)** — flip flashcards. Click the card or press **Space** to flip;
   use the **← / →** arrow keys to move between cards.
3. **Quiz (測驗)** — choose:
   - **Direction:** Japanese → Meaning · Reading (kana) → Meaning · Meaning → Japanese
   - **Answer in:** English / 中文（繁體）/ 中文（简体）
   - **Questions:** 5, 10, 20, or All
   Then answer the multiple-choice questions. Your best score is saved.
4. Click the **Jtest** logo (top-left) any time to go back to the menu.

---

## Adding your own words

All content lives in the `data/` folder as simple `.json` files. Each card:

```json
{ "front": "水", "reading": "みず", "meaning": "water", "zht": "水", "zhs": "水" }
```

- `front` = the Japanese you see first
- `reading` = how it's read (kana)
- `meaning` = English meaning
- `zht` / `zhs` = Traditional / Simplified Chinese (optional)

To **add words**, open a file (e.g. `data/vocab_n5.json`) and add more cards.
To **add a new deck**, create a new file in `data/` and add it to the `DECKS`
list near the top of `app.js`.

After editing, run `python clean_data.py` to check every file is valid.

---

## Project layout

```
Jtest/
├─ index.html        # the app page
├─ app.js            # all the app logic (decks, study, quiz, languages)
├─ style.css         # styling
├─ data/             # all the study content (.json)
├─ app.py            # optional local web server (run this to use it offline)
├─ generate_data.py  # regenerates the kana tables (rarely needed)
└─ clean_data.py     # checks/validates the data files
```

Your saved scores live in the browser, not in a file.

Happy studying! 頑張って！加油！
