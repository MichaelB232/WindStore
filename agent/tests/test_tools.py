"""Tes tools terhadap mock server. Jalankan dari folder windstore_agent:  python -m pytest tests -q
(atau: python tests/test_tools.py)"""
import os
import sys
import threading
from http.server import HTTPServer

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import mock_server  # noqa: E402

_srv = HTTPServer(("127.0.0.1", 0), mock_server.H)
threading.Thread(target=_srv.serve_forever, daemon=True).start()
os.environ["WINDSTORE_API_URL"] = f"http://127.0.0.1:{_srv.server_port}/api"

from tools import (  # noqa: E402
    TOOL_MAP,
    list_products,
    get_product,
    compare_products,
    calculate_price,
    price_summary,
    get_store_info,
)
from agent import run_tool  # noqa: E402


def test_list_all():
    r = list_products(limit=20)
    assert r["success"] and r["total_found"] == 5
    assert isinstance(r["products"][0]["price_idr"], int)       # string -> int
    assert "description" not in r["products"][0]                # dikompres


def test_list_filters():
    assert [p["name"] for p in list_products(brand="samsung")["products"]] == ["Samsung Galaxy Book4"]
    assert list_products(brand="asus,lenovo")["total_found"] == 3
    r = list_products(category="Gaming", max_price=22000000, sort_by="price-asc")
    assert [p["slug"] for p in r["products"]] == ["lenovo-legion-5"]


def test_list_limit_and_empty():
    r = list_products(limit=2)
    assert r["returned"] == 2 and r["total_found"] == 5 and "note" in r
    e = list_products(brand="Acer")
    assert e["total_found"] == 0 and "Samsung" in e["available_brands"]
    assert list_products(sort_by="murah")["success"] is False


def test_get_product_by_slug_and_name():
    a = get_product("asus-rog-strix-g16")
    assert a["success"] and a["reviews"]["count"] == 3 and a["reviews"]["average_rating"] == 4.67
    assert a["configs"][1]["final_price_idr"] == 29000000
    b = get_product("ROG Strix G16")                       # fallback search
    assert b["slug"] == "asus-rog-strix-g16" and "note" in b
    assert get_product("laptop gaib xyz")["success"] is False


def test_compare_products():
    r = compare_products("asus-rog-strix-g16", "lenovo-legion-5")
    assert r["success"] is True
    assert r["product_a"]["name"] == "ASUS ROG Strix G16"
    assert r["product_b"]["name"] == "Lenovo Legion 5"
    assert r["price_comparison"]["price_difference_idr"] == 4000000
    assert r["price_comparison"]["cheaper_product"] == "Lenovo Legion 5"
    bad = compare_products("laptop gaib 1", "asus-rog-strix-g16")
    assert bad["success"] is False


def test_get_store_info():
    r = get_store_info(topic="payment")
    assert r["success"] is True
    assert "Midtrans" in r["information"]
    all_info = get_store_info()
    assert all_info["success"] is True
    assert "warranty" in all_info["information"]


def test_calculate_price():
    r = calculate_price("asus-rog-strix-g16", quantity=3, config_name="32GB / 2TB", discount_percent=10)
    assert r["unit_price_idr"] == 29000000 and r["subtotal_idr"] == 87000000
    assert r["total_idr"] == 78300000 and r["total_formatted"] == "Rp 78.300.000"
    assert r["stock_sufficient"] is True
    assert calculate_price("asus-vivobook-14", quantity=1)["stock_sufficient"] is False  # stok 0
    bad = calculate_price("asus-rog-strix-g16", config_name="64GB")
    assert bad["success"] is False and "32GB / 2TB" in bad["available_configs"]
    assert calculate_price("asus-rog-strix-g16", quantity=0)["success"] is False
    assert calculate_price("asus-rog-strix-g16", discount_percent=150)["success"] is False


def test_price_summary():
    r = price_summary()
    assert r["count"] == 5 and r["cheapest"]["name"] == "ASUS Vivobook 14"
    assert r["most_expensive"]["price_idr"] == 25000000
    assert r["average_price_idr"] == round((25 + 8 + 21 + 14.5 + 19) * 1_000_000 / 5)
    assert r["out_of_stock"] == ["ASUS Vivobook 14"]
    assert price_summary(brand="Acer")["count"] == 0


def test_run_tool_never_raises():
    assert run_tool("tool_gaib", {})["success"] is False
    assert run_tool("list_products", {"warna": "merah"})["success"] is False   # argumen salah
    assert set(TOOL_MAP) == {
        "list_products",
        "get_product",
        "compare_products",
        "calculate_price",
        "price_summary",
        "get_store_info",
    }


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("OK ", name)
