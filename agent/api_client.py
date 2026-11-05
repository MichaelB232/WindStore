"""Lapisan tipis ke Express API WindStore. Semua HTTP lewat sini, tools tidak memanggil requests langsung."""
from typing import Any, Optional

import requests

from config import API_BASE_URL, REQUEST_TIMEOUT


class ApiError(Exception):
    def __init__(self, message: str, status: Optional[int] = None):
        super().__init__(message)
        self.status = status


def get(path: str, params: Optional[dict] = None) -> Any:
    """GET ke {API_BASE_URL}{path}. Mengembalikan isi `data`, atau raise ApiError."""
    url = f"{API_BASE_URL}{path}"
    try:
        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    except requests.RequestException as e:
        raise ApiError(f"Server toko tidak bisa dihubungi ({url}): {e}")

    try:
        payload = resp.json()
    except ValueError:
        payload = {}

    if resp.status_code == 429:
        raise ApiError("Terlalu banyak request ke server toko, coba lagi sebentar.", 429)
    if not resp.ok or not payload.get("success", False):
        raise ApiError(payload.get("message") or f"HTTP {resp.status_code}", resp.status_code)
    return payload.get("data")
