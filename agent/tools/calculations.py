"""Tool hitung-hitungan. Model buruk di aritmetika, jadi hitungnya di Python."""
from typing import Optional

from api_client import ApiError
from tools.products import fetch_product_detail, fetch_products, _to_int


def _idr(n: int) -> str:
    """25000000 -> 'Rp 25.000.000'"""
    return "Rp " + f"{n:,}".replace(",", ".")


def calculate_price(
    product: str,
    quantity: int = 1,
    config_name: Optional[str] = None,
    discount_percent: float = 0,
) -> dict:
    """Hitung total harga pembelian satu jenis laptop: harga dasar + konfigurasi, dikali jumlah, dikurangi diskon.

    Pakai untuk "kalau beli 3 unit berapa?", "harga ROG Strix G16 versi 32GB/2TB diskon 10%".

    Args:
        product: Slug atau nama produk.
        quantity: Jumlah unit (minimal 1).
        config_name: Nama konfigurasi persis seperti di get_product, contoh "32GB / 2TB". Kosongkan untuk konfigurasi dasar.
        discount_percent: Diskon dalam persen, 0 sampai 100.
    """
    try:
        if quantity < 1:
            return {"success": False, "error": "quantity minimal 1."}
        if not 0 <= discount_percent <= 100:
            return {"success": False, "error": "discount_percent harus antara 0 dan 100."}

        d = fetch_product_detail(product)
        base = _to_int(d["basePrice"])
        configs = d.get("productConfigs", [])

        modifier, chosen = 0, None
        if config_name:
            wanted = config_name.strip().lower()
            chosen = next((c for c in configs if c["configName"].lower() == wanted), None)
            if chosen is None:
                return {
                    "success": False,
                    "error": f"Konfigurasi '{config_name}' tidak ada untuk {d['name']}.",
                    "available_configs": [c["configName"] for c in configs],
                }
            modifier = _to_int(chosen["priceModifier"])

        unit = base + modifier
        subtotal = unit * quantity
        discount = round(subtotal * discount_percent / 100)
        total = subtotal - discount

        out = {
            "success": True,
            "product": d["name"],
            "config": chosen["configName"] if chosen else "dasar",
            "unit_price_idr": unit,
            "quantity": quantity,
            "subtotal_idr": subtotal,
            "discount_percent": discount_percent,
            "discount_idr": discount,
            "total_idr": total,
            "total_formatted": _idr(total),
            "stock": d["stock"],
            "stock_sufficient": quantity <= d["stock"],
        }
        if not out["stock_sufficient"]:
            out["warning"] = f"Stok hanya {d['stock']}, kurang dari {quantity} unit."
        return out
    except ApiError as e:
        return {"success": False, "error": str(e)}

 
def price_summary(brand: Optional[str] = None, category: Optional[str] = None) -> dict:
    """Statistik harga dan stok: jumlah produk, termurah, termahal, rata-rata harga, total stok.

    Pakai untuk "berapa rata-rata harga laptop Asus?", "laptop gaming termurah dan termahal",
    "ada berapa produk Lenovo?". Tanpa argumen = seluruh katalog.

    Args:
        brand: Filter brand (opsional), contoh: "Asus".
        category: Filter kategori (opsional): Gaming, Business, Ultrabook, Creator, Budget.
    """
    try:
        result = fetch_products(brand=brand, category=category, sort_by="price-asc")
        products = result["products"]
        if not products:
            return {
                "success": True, "count": 0,
                "available_brands": result["brands"],
                "available_categories": result["categories"],
            }
        prices = [p["price_idr"] for p in products]
        avg = round(sum(prices) / len(prices))
        cheapest, priciest = products[0], products[-1]
        return {
            "success": True,
            "count": len(products),
            "cheapest": {"name": cheapest["name"], "price_idr": cheapest["price_idr"]},
            "most_expensive": {"name": priciest["name"], "price_idr": priciest["price_idr"]},
            "average_price_idr": avg,
            "average_price_formatted": _idr(avg),
            "total_stock": sum(p["stock"] for p in products),
            "out_of_stock": [p["name"] for p in products if p["stock"] == 0],
        }
    except ApiError as e:
        return {"success": False, "error": str(e)}
