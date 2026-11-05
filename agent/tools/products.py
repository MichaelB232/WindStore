"""Tool untuk membaca produk: daftar (dengan filter) dan detail satu produk."""
from typing import Optional
from urllib.parse import quote

import api_client
from api_client import ApiError
from config import MAX_LIST_RESULTS

VALID_SORT = ("newest", "price-asc", "price-desc")


# ---------- helper (bukan tool, tidak dikirim ke model) ----------

def _to_int(value) -> Optional[int]:
    """basePrice / priceModifier dikirim server sebagai STRING (BigInt -> toJSON)."""
    return int(value) if value is not None else None


def _compact(p: dict) -> dict:
    """Ringkas 1 produk dari /api/shop. Buang description, gambar, dll supaya context hemat."""
    return {
        "name": p["name"],
        "slug": p["slug"],
        "brand": (p.get("brand") or {}).get("name"),
        "category": (p.get("category") or {}).get("name"),
        "price_idr": _to_int(p["basePrice"]),
        "stock": p["stock"],
        "badge": p.get("badge"),
        "specs": p.get("specs") or {},
    }


def fetch_products(
    brand=None, category=None, search=None, processor=None,
    min_price=None, max_price=None, sort_by=None,
) -> dict:
    """Ambil produk terfilter dari /api/shop (filter dikerjakan server, bukan model).

    Return: {"products": [compact...], "brands": [...], "categories": [...]}
    Dipakai juga oleh calculations.price_summary.
    """
    params = {
        "brand": brand,          # server memecah dengan koma: "ASUS,Lenovo"
        "category": category,
        "search": search,
        "processor": processor,
        "priceMin": min_price,
        "priceMax": max_price,
        "sortBy": sort_by,
    }
    params = {k: v for k, v in params.items() if v not in (None, "")}
    data = api_client.get("/shop", params)
    return {
        "products": [_compact(p) for p in data["products"]],
        "brands": [b["name"] for b in data.get("brands", [])],
        "categories": [c["name"] for c in data.get("categories", [])],
    }


def fetch_product_detail(name_or_slug: str) -> dict:
    """Cari 1 produk lengkap. Coba sebagai slug dulu, kalau 404 fallback ke search by nama.

    Return dict detail mentah dari server + key `_resolved_from_search` / `_other_matches`.
    Raise ApiError kalau tidak ketemu.
    """
    text = name_or_slug.strip()
    if not text:
        raise ApiError("Nama atau slug produk kosong.")

    guess_slug = "-".join(text.lower().split())
    try:
        detail = api_client.get(f"/products/{quote(guess_slug)}")
        detail["_resolved_from_search"] = False
        detail["_other_matches"] = []
        return detail
    except ApiError as e:
        if e.status != 404:
            raise

    if len(text) < 2:
        raise ApiError(f"Produk '{text}' tidak ditemukan.", 404)
    matches = api_client.get("/products/search", {"q": text}) or []
    if not matches:
        raise ApiError(f"Produk '{text}' tidak ditemukan.", 404)

    detail = api_client.get(f"/products/{quote(matches[0]['slug'])}")
    detail["_resolved_from_search"] = True
    detail["_other_matches"] = [m["name"] for m in matches[1:]]
    return detail


# ---------- TOOLS (dikirim ke Gemini; docstring = prompt untuk model) ----------

def list_products(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    processor: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    sort_by: Optional[str] = None,
    limit: int = 10,
) -> dict:
    """Ambil daftar laptop di toko WindStore, bisa difilter. Tanpa argumen = semua produk aktif.

    Pakai untuk pertanyaan seperti "laptop apa saja yang ada", "produk Samsung",
    "laptop gaming di bawah 20 juta", "yang paling murah".

    Args:
        brand: Nama brand. Beberapa brand dipisah koma, contoh: "Asus" atau "Asus,Lenovo".
        category: Kategori: Gaming, Business, Ultrabook, Creator, atau Budget.
        search: Kata kunci di nama produk, contoh: "ROG".
        processor: Kata kunci processor, contoh: "Intel", "Ryzen", "M3".
        min_price: Harga minimum dalam Rupiah (angka bulat, tanpa titik).
        max_price: Harga maksimum dalam Rupiah (angka bulat, tanpa titik).
        sort_by: Urutan hasil: "price-asc" (termurah), "price-desc" (termahal), atau "newest".
        limit: Jumlah maksimum produk yang dikembalikan (default 10, maksimal 20).
    """
    try:
        if sort_by and sort_by not in VALID_SORT:
            return {"success": False,
                    "error": f"sort_by tidak valid. Pilihan: {', '.join(VALID_SORT)}"}

        result = fetch_products(brand, category, search, processor, min_price, max_price, sort_by)
        products = result["products"]
        total = len(products)
        limit = max(1, min(int(limit), MAX_LIST_RESULTS))

        out = {
            "success": True,
            "total_found": total,
            "returned": min(total, limit),
            "products": products[:limit],
        }
        if total > limit:
            out["note"] = f"Hanya {limit} dari {total} produk yang ditampilkan. Persempit filter atau naikkan limit."
        if total == 0:  # bantu model memperbaiki filter-nya
            out["available_brands"] = result["brands"]
            out["available_categories"] = result["categories"]
        return out
    except ApiError as e:
        return {"success": False, "error": str(e)}


def get_product(name_or_slug: str) -> dict:
    """Ambil detail lengkap SATU laptop: spesifikasi, fitur, opsi konfigurasi + harga akhirnya, dan ringkasan review.

    Pakai saat user menanyakan produk tertentu, contoh "detail ASUS ROG Strix G16",
    "review Zephyrus G14 bagus gak?". Boleh isi slug (dari list_products) atau nama produk.

    Args:
        name_or_slug: Slug produk (contoh: "asus-rog-strix-g16") atau nama produk (contoh: "ROG Strix G16").
    """
    try:
        d = fetch_product_detail(name_or_slug)
        base = _to_int(d["basePrice"])
        reviews = d.get("reviews") or []
        ratings = [r["rating"] for r in reviews]

        out = {
            "success": True,
            "name": d["name"],
            "slug": d["slug"],
            "brand": (d.get("brand") or {}).get("name"),
            "motto": d.get("motto"),
            "description": d.get("description"),
            "badge": d.get("badge"),
            "base_price_idr": base,
            "stock": d["stock"],
            "specs": d.get("specs") or {},
            "features": [f["title"] for f in d.get("productFeatures", [])],
            "configs": [
                {
                    "name": c["configName"],
                    "type": c["configType"],
                    "price_modifier_idr": _to_int(c["priceModifier"]),
                    "final_price_idr": base + _to_int(c["priceModifier"]),
                }
                for c in d.get("productConfigs", [])
            ],
            "reviews": {
                "count": len(reviews),
                "average_rating": round(sum(ratings) / len(ratings), 2) if ratings else None,
                "latest_comments": [r["comment"] for r in reviews[-3:] if r.get("comment")],
            },
        }
        if d["_resolved_from_search"]:
            out["note"] = f"Dicocokkan dari pencarian nama. Kandidat lain: {d['_other_matches']}"
        return out
    except ApiError as e:
        return {"success": False, "error": str(e)}


def compare_products(product_a: str, product_b: str) -> dict:
    """Bandingkan dua laptop secara langsung: perbandingan harga dasar, selisih harga, spesifikasi (processor, ram, storage, dll.), stok, dan rating review.

    Pakai saat user meminta perbandingan, contoh: "mending ROG Strix G16 atau Legion 5?",
    "bandingkan Vivobook 14 dengan Galaxy Book4", "perbedaan laptop A dan B".

    Args:
        product_a: Slug atau nama produk pertama (contoh: "asus-rog-strix-g16").
        product_b: Slug atau nama produk kedua (contoh: "lenovo-legion-5").
    """
    try:
        da = fetch_product_detail(product_a)
    except ApiError as e:
        return {"success": False, "error": f"Produk pertama ({product_a}) tidak ditemukan: {e}"}

    try:
        db = fetch_product_detail(product_b)
    except ApiError as e:
        return {"success": False, "error": f"Produk kedua ({product_b}) tidak ditemukan: {e}"}

    price_a = _to_int(da["basePrice"])
    price_b = _to_int(db["basePrice"])
    diff = abs(price_a - price_b)

    reviews_a = da.get("reviews") or []
    ratings_a = [r["rating"] for r in reviews_a]
    avg_rating_a = round(sum(ratings_a) / len(ratings_a), 2) if ratings_a else None

    reviews_b = db.get("reviews") or []
    ratings_b = [r["rating"] for r in reviews_b]
    avg_rating_b = round(sum(ratings_b) / len(ratings_b), 2) if ratings_b else None

    return {
        "success": True,
        "product_a": {
            "name": da["name"],
            "slug": da["slug"],
            "brand": (da.get("brand") or {}).get("name"),
            "category": (da.get("category") or {}).get("name"),
            "base_price_idr": price_a,
            "stock": da["stock"],
            "specs": da.get("specs") or {},
            "average_rating": avg_rating_a,
            "review_count": len(reviews_a),
        },
        "product_b": {
            "name": db["name"],
            "slug": db["slug"],
            "brand": (db.get("brand") or {}).get("name"),
            "category": (db.get("category") or {}).get("name"),
            "base_price_idr": price_b,
            "stock": db["stock"],
            "specs": db.get("specs") or {},
            "average_rating": avg_rating_b,
            "review_count": len(reviews_b),
        },
        "price_comparison": {
            "price_difference_idr": diff,
            "cheaper_product": da["name"] if price_a < price_b else (db["name"] if price_b < price_a else "Sama"),
            "more_expensive_product": da["name"] if price_a > price_b else (db["name"] if price_b > price_a else "Sama"),
        },
    }
