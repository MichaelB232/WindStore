"""Semua konfigurasi di satu tempat. Ubah di sini / lewat .env, jangan di kode lain."""
import os
from dotenv import load_dotenv

load_dotenv()

# --- WindStore API ---
API_BASE_URL = os.getenv("WINDSTORE_API_URL", "http://localhost:8000/api").rstrip("/")
REQUEST_TIMEOUT = 10  # detik

# --- Gemini ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
TEMPERATURE = 0.2  # rendah: tool calling butuh konsisten

# --- Agent ---
MAX_AGENT_STEPS = 5      # batas putaran tool call per pertanyaan (anti infinite loop)
MAX_LIST_RESULTS = 20    # batas produk yang dikirim balik ke model (hemat context window)
