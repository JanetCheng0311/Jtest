"""
Jtest - a Japanese (JLPT N5-N1) study app that runs in your browser.

HOW TO RUN
----------
1. Install Python 3 (from https://www.python.org/downloads/ if you don't
   have it). This works the same on Windows and Mac.
2. Open a terminal / command prompt in this folder.
3. Run:   python app.py        (on Mac you may need: python3 app.py)
4. Your web browser opens automatically at http://localhost:8000

That's it. No extra libraries to install - this uses only Python's
built-in modules, so it works the same on Windows and Mac.

To stop the app, go back to the terminal and press Ctrl+C.
"""
import json
import os
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

HERE = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(HERE, "web")
DATA_DIR = os.path.join(HERE, "data")
PROGRESS_FILE = os.path.join(HERE, "progress.json")
PORT = 8000

# Decks shown in the app, grouped by category. Each entry maps a friendly
# label to the data file name (without .json). Add your own decks here after
# creating a matching file in the data/ folder.
DECKS = [
    {"category": "Kana (start here)", "items": [
        {"id": "hiragana", "label": "Hiragana"},
        {"id": "katakana", "label": "Katakana"},
    ]},
    {"category": "Vocabulary", "items": [
        {"id": "vocab_n5", "label": "Vocab N5"},
        {"id": "vocab_n4", "label": "Vocab N4"},
        {"id": "vocab_n3", "label": "Vocab N3"},
        {"id": "vocab_n2", "label": "Vocab N2"},
        {"id": "vocab_n1", "label": "Vocab N1"},
    ]},
    {"category": "Kanji", "items": [
        {"id": "kanji_n5", "label": "Kanji N5"},
        {"id": "kanji_n4", "label": "Kanji N4"},
        {"id": "kanji_n3", "label": "Kanji N3"},
        {"id": "kanji_n2", "label": "Kanji N2"},
    ]},
    {"category": "Grammar", "items": [
        {"id": "grammar_n5", "label": "Grammar N5"},
        {"id": "grammar_n4", "label": "Grammar N4"},
        {"id": "grammar_n3", "label": "Grammar N3"},
        {"id": "grammar_n2", "label": "Grammar N2"},
        {"id": "grammar_n1", "label": "Grammar N1"},
    ]},
]

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
}


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, encoding="utf-8") as f:
                return json.load(f)
        except (ValueError, OSError):
            pass
    return {}


def save_progress(data):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # keep the terminal quiet

    def _send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path):
        ext = os.path.splitext(path)[1]
        ctype = CONTENT_TYPES.get(ext, "application/octet-stream")
        with open(path, "rb") as f:
            body = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/" or path == "":
            return self._send_file(os.path.join(WEB_DIR, "index.html"))

        if path == "/api/decks":
            return self._send_json(DECKS)

        if path == "/api/progress":
            return self._send_json(load_progress())

        if path.startswith("/api/deck/"):
            deck_id = unquote(path[len("/api/deck/"):])
            # only allow simple names -> prevents reading other files
            if not deck_id.replace("_", "").isalnum():
                return self._send_json({"error": "bad deck name"}, 400)
            fpath = os.path.join(DATA_DIR, deck_id + ".json")
            if not os.path.exists(fpath):
                return self._send_json({"error": "deck not found"}, 404)
            return self._send_file(fpath)

        # otherwise serve a static file from web/
        safe = os.path.normpath(path).lstrip("/\\")
        fpath = os.path.join(WEB_DIR, safe)
        if os.path.isfile(fpath) and fpath.startswith(WEB_DIR):
            return self._send_file(fpath)

        self._send_json({"error": "not found"}, 404)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/progress":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            try:
                data = json.loads(raw.decode("utf-8"))
            except ValueError:
                return self._send_json({"error": "bad json"}, 400)
            save_progress(data)
            return self._send_json({"ok": True})
        self._send_json({"error": "not found"}, 404)


def main():
    os.chdir(HERE)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print("=" * 50)
    print(" Jtest - Japanese study app")
    print(" Open your browser at:", url)
    print(" Press Ctrl+C here to stop.")
    print("=" * 50)
    # open the browser shortly after the server starts
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping. Bye!")
        server.shutdown()


if __name__ == "__main__":
    main()
