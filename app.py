"""
Jtest - a Japanese (JLPT N5-N1) study app.

You have TWO ways to use this app:

  A) ONLINE (easiest): just open the GitHub Pages link in any browser.
     No Python needed. See README.md for the link.

  B) LOCALLY on your own computer with this script:
     1. Install Python 3 from https://www.python.org/downloads/
        (on Windows, tick "Add Python to PATH").
     2. Open a terminal / command prompt in this folder.
     3. Run:   python app.py        (on Mac you may need: python3 app.py)
     4. Your browser opens automatically at http://localhost:8000
     5. Press Ctrl+C in the terminal to stop.

This local server only serves the files in this folder - it uses just
Python's built-in modules, so there is nothing extra to install. It works
the same on Windows and Mac. (Opening index.html directly with a file://
path will NOT work, because browsers block loading the data files that way -
so use this script, or the online link.)
"""
import os
import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
PORT = 8000


def main():
    handler = partial(SimpleHTTPRequestHandler, directory=HERE)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    url = f"http://localhost:{PORT}"
    print("=" * 50)
    print(" Jtest - Japanese study app")
    print(" Open your browser at:", url)
    print(" Press Ctrl+C here to stop.")
    print("=" * 50)
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping. Bye!")
        server.shutdown()


if __name__ == "__main__":
    main()
