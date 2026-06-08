# Jtest — Learn Japanese (JLPT N5–N1)

A simple study app that runs **in your web browser** and works the same on
**Windows and Mac**. It uses only Python's built-in modules, so there is
**nothing extra to install** beyond Python itself.

It has flashcards and multiple-choice quizzes for:

- **Hiragana & Katakana** (start here if you're a beginner)
- **Vocabulary** — N5, N4, N3, N2, N1
- **Kanji** — N5, N4, N3, N2
- **Grammar** — N5, N4, N3, N2, N1

Your best quiz score for each deck is saved automatically.

---

## How to run

### 1. Install Python (one time)
- Download from <https://www.python.org/downloads/> and install.
- On Windows, tick **"Add Python to PATH"** during install.

### 2. Start the app
Open a terminal / command prompt **in this folder**, then run:

**Windows**
```
python app.py
```

**Mac**
```
python3 app.py
```

Your browser opens automatically at <http://localhost:8000>.
To stop the app, return to the terminal and press **Ctrl + C**.

---

## How to use it

1. Pick a deck (beginners: start with **Hiragana**).
2. **Study** = flip flashcards. Click the card, or press **Space** to flip,
   and use the **← / →** arrow keys to move between cards.
3. **Quiz** = answer multiple-choice questions. Your best score is saved.

---

## Adding your own words

All content lives in the `data/` folder as simple `.json` files. Each file is
a list of cards like this:

```json
[
  { "front": "水", "reading": "みず", "meaning": "water" }
]
```

- `front` = what you see first (the Japanese)
- `reading` = how it's read (kana/romaji)
- `meaning` = the English meaning

To **add words**, open the matching file (e.g. `data/vocab_n5.json`) and add
more cards. To **add a whole new deck**, create a new file in `data/` and add
it to the `DECKS` list near the top of `app.py`.

After editing, you can run `python clean_data.py` to check every file is valid.

---

## Project layout

```
Jtest/
├─ app.py            # the small web server (run this)
├─ generate_data.py  # regenerates the kana tables (rarely needed)
├─ clean_data.py     # checks/validates the data files
├─ data/             # all the study content (.json)
├─ web/              # the browser app (HTML / CSS / JavaScript)
└─ progress.json     # your saved scores (created when you first quiz)
```

Happy studying! 頑張って！
