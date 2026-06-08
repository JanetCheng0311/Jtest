"""
Generate the Hiragana and Katakana JSON data files.

Run this once with:  python generate_data.py
It writes data/hiragana.json and data/katakana.json.

You normally don't need to run this again unless you want to
regenerate the kana tables.
"""
import json
import os

# romaji -> (hiragana, katakana). Grouped the way kana is usually taught.
# Each row is the gojuon ("fifty sounds") order plus dakuten / combos.
KANA = [
    # --- basic vowels ---
    ("a", "あ", "ア"), ("i", "い", "イ"), ("u", "う", "ウ"),
    ("e", "え", "エ"), ("o", "お", "オ"),
    # --- k ---
    ("ka", "か", "カ"), ("ki", "き", "キ"), ("ku", "く", "ク"),
    ("ke", "け", "ケ"), ("ko", "こ", "コ"),
    # --- s ---
    ("sa", "さ", "サ"), ("shi", "し", "シ"), ("su", "す", "ス"),
    ("se", "せ", "セ"), ("so", "そ", "ソ"),
    # --- t ---
    ("ta", "た", "タ"), ("chi", "ち", "チ"), ("tsu", "つ", "ツ"),
    ("te", "て", "テ"), ("to", "と", "ト"),
    # --- n ---
    ("na", "な", "ナ"), ("ni", "に", "ニ"), ("nu", "ぬ", "ヌ"),
    ("ne", "ね", "ネ"), ("no", "の", "ノ"),
    # --- h ---
    ("ha", "は", "ハ"), ("hi", "ひ", "ヒ"), ("fu", "ふ", "フ"),
    ("he", "へ", "ヘ"), ("ho", "ほ", "ホ"),
    # --- m ---
    ("ma", "ま", "マ"), ("mi", "み", "ミ"), ("mu", "む", "ム"),
    ("me", "め", "メ"), ("mo", "も", "モ"),
    # --- y ---
    ("ya", "や", "ヤ"), ("yu", "ゆ", "ユ"), ("yo", "よ", "ヨ"),
    # --- r ---
    ("ra", "ら", "ラ"), ("ri", "り", "リ"), ("ru", "る", "ル"),
    ("re", "れ", "レ"), ("ro", "ろ", "ロ"),
    # --- w + n ---
    ("wa", "わ", "ワ"), ("wo", "を", "ヲ"), ("n", "ん", "ン"),
    # --- dakuten: g ---
    ("ga", "が", "ガ"), ("gi", "ぎ", "ギ"), ("gu", "ぐ", "グ"),
    ("ge", "げ", "ゲ"), ("go", "ご", "ゴ"),
    # --- dakuten: z ---
    ("za", "ざ", "ザ"), ("ji", "じ", "ジ"), ("zu", "ず", "ズ"),
    ("ze", "ぜ", "ゼ"), ("zo", "ぞ", "ゾ"),
    # --- dakuten: d ---
    ("da", "だ", "ダ"), ("de", "で", "デ"), ("do", "ど", "ド"),
    # --- dakuten: b ---
    ("ba", "ば", "バ"), ("bi", "び", "ビ"), ("bu", "ぶ", "ブ"),
    ("be", "べ", "ベ"), ("bo", "ぼ", "ボ"),
    # --- handakuten: p ---
    ("pa", "ぱ", "パ"), ("pi", "ぴ", "ピ"), ("pu", "ぷ", "プ"),
    ("pe", "ぺ", "ペ"), ("po", "ぽ", "ポ"),
    # --- combos (yoon) ---
    ("kya", "きゃ", "キャ"), ("kyu", "きゅ", "キュ"), ("kyo", "きょ", "キョ"),
    ("sha", "しゃ", "シャ"), ("shu", "しゅ", "シュ"), ("sho", "しょ", "ショ"),
    ("cha", "ちゃ", "チャ"), ("chu", "ちゅ", "チュ"), ("cho", "ちょ", "チョ"),
    ("nya", "にゃ", "ニャ"), ("nyu", "にゅ", "ニュ"), ("nyo", "にょ", "ニョ"),
    ("hya", "ひゃ", "ヒャ"), ("hyu", "ひゅ", "ヒュ"), ("hyo", "ひょ", "ヒョ"),
    ("mya", "みゃ", "ミャ"), ("myu", "みゅ", "ミュ"), ("myo", "みょ", "ミョ"),
    ("rya", "りゃ", "リャ"), ("ryu", "りゅ", "リュ"), ("ryo", "りょ", "リョ"),
    ("gya", "ぎゃ", "ギャ"), ("gyu", "ぎゅ", "ギュ"), ("gyo", "ぎょ", "ギョ"),
    ("ja", "じゃ", "ジャ"), ("ju", "じゅ", "ジュ"), ("jo", "じょ", "ジョ"),
    ("bya", "びゃ", "ビャ"), ("byu", "びゅ", "ビュ"), ("byo", "びょ", "ビョ"),
    ("pya", "ぴゃ", "ピャ"), ("pyu", "ぴゅ", "ピュ"), ("pyo", "ぴょ", "ピョ"),
]


def build(which):
    idx = 1 if which == "hiragana" else 2
    cards = []
    for row in KANA:
        cards.append({"front": row[idx], "reading": row[0], "meaning": row[0]})
    return cards


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(here, "data")
    os.makedirs(data_dir, exist_ok=True)
    for which in ("hiragana", "katakana"):
        path = os.path.join(data_dir, which + ".json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(build(which), f, ensure_ascii=False, indent=2)
        print("wrote", path, "(" + str(len(KANA)) + " cards)")


if __name__ == "__main__":
    main()
