from flask import Flask, render_template, jsonify
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/health")
def health():
    return jsonify({"status": "ok", "app": "DECORA Room Preview"})

if __name__ == "__main__":
    # Local development server. Uploaded images are handled in the browser;
    # this app does not save them to the server.
    app.run(host="127.0.0.1", port=5000, debug=True)
