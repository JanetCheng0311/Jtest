"""
Clean and validate all data/*.json card files.

Removes any malformed/placeholder card and reports the result.
A card is kept only if:
  - it has 'front', 'reading', 'meaning' string fields
  - reading != 'x' and meaning != 'ignore' (placeholder markers)
  - the 'front' contains at least one Japanese character
    (hiragana, katakana, or kanji) -- this drops stray latin/other junk.
Run:  python clean_data.py
"""
import json
import os
import glob


def has_japanese(s):
    for ch in s:
        o = ord(ch)
        if (0x3040 <= o <= 0x30FF) or (0x4E00 <= o <= 0x9FFF):
            return True
    return False


def is_valid(card):
    if not isinstance(card, dict):
        return False
    for k in ("front", "reading", "meaning"):
        if not isinstance(card.get(k), str) or not card[k].strip():
            return False
    if card["reading"].strip() == "x" or card["meaning"].strip() == "ignore":
        return False
    if not has_japanese(card["front"]):
        return False
    return True


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    files = sorted(glob.glob(os.path.join(here, "data", "*.json")))
    total_removed = 0
    for path in files:
        with open(path, encoding="utf-8") as f:
            cards = json.load(f)
        clean = [c for c in cards if is_valid(c)]
        removed = len(cards) - len(clean)
        total_removed += removed
        if removed:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(clean, f, ensure_ascii=False, indent=2)
        zh = sum(1 for c in clean if c.get("zht") and c.get("zhs"))
        name = os.path.basename(path)
        is_kana = name in ("hiragana.json", "katakana.json")
        zh_note = "kana (no zh)" if is_kana else f"{zh}/{len(clean)} have 中文"
        print(f"{name:20s} {len(clean):4d} cards  (removed {removed})  {zh_note}")
    print("---")
    print("total removed:", total_removed)


if __name__ == "__main__":
    main()
