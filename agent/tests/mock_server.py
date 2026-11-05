"""Server palsu yang meniru bentuk JSON Express WindStore (basePrice = STRING karena BigInt.toJSON).
Jalankan: python tests/mock_server.py   -> http://localhost:8000
Berguna untuk develop tools tanpa Postgres / Express."""
import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

BRANDS = ["ASUS", "Lenovo", "Samsung", "Apple"]
CATS = ["Gaming", "Business", "Ultrabook", "Creator", "Budget"]


def P(id, name, slug, brand, cat, price, stock, badge, specs, configs=(), reviews=()):
    return {
        "id": id, "name": name, "slug": slug, "brandId": 1, "categoryId": 1, "motto": f"Motto {name}",
        "description": f"Deskripsi {name}", "basePrice": str(price), "badge": badge, "specs": specs,
        "imageUrl": "x.png", "stock": stock, "isActive": True, "createdAt": "2026-06-01T00:00:00Z",
        "brand": {"name": brand}, "category": {"name": cat}, "productImages": [{"imageUrl": "x.png"}],
        "_configs": [{"id": i, "configName": n, "configType": "storage", "priceModifier": str(m)}
                     for i, (n, m) in enumerate(configs, 1)],
        "_reviews": [{"rating": r, "comment": c, "createdAt": "2026-06-02T00:00:00Z", "user": {"username": "u"}}
                     for r, c in reviews],
    }


PRODUCTS = [
    P(1, "ASUS ROG Strix G16", "asus-rog-strix-g16", "ASUS", "Gaming", 25000000, 15, "Best Seller",
      {"processor": "Intel Core i9-13980HX", "ram": "16GB DDR5"},
      [("16GB / 1TB", 0), ("32GB / 2TB", 4000000)], [(5, "Mantap"), (4, "Agak berat"), (5, "Kencang")]),
    P(2, "ASUS Vivobook 14", "asus-vivobook-14", "ASUS", "Budget", 8000000, 0, "Value Pick",
      {"processor": "AMD Ryzen 5 7530U", "ram": "8GB"}, [("8GB / 512GB", 0)], [(4, "Oke buat kuliah")]),
    P(3, "Lenovo Legion 5", "lenovo-legion-5", "Lenovo", "Gaming", 21000000, 7, "Popular",
      {"processor": "AMD Ryzen 7 7745HX", "ram": "16GB"}),
    P(4, "Samsung Galaxy Book4", "samsung-galaxy-book4", "Samsung", "Ultrabook", 14500000, 4, "New",
      {"processor": "Intel Core i7-1355U", "ram": "16GB"}),
    P(5, "MacBook Air M3", "macbook-air-m3", "Apple", "Ultrabook", 19000000, 9, "Slim Pick",
      {"processor": "Apple M3", "ram": "8GB"}),
]


def shop(q):
    items = PRODUCTS
    g = lambda k: q.get(k, [None])[0]
    if g("brand"):
        want = [b.lower() for b in g("brand").split(",")]
        items = [p for p in items if p["brand"]["name"].lower() in want]
    if g("category"):
        items = [p for p in items if p["category"]["name"].lower() == g("category").lower()]
    if g("search"):
        items = [p for p in items if g("search").lower() in p["name"].lower()]
    if g("processor"):
        want = [x.lower() for x in g("processor").split(",")]
        items = [p for p in items if any(w in p["specs"]["processor"].lower() for w in want)]
    if g("priceMin"):
        items = [p for p in items if int(p["basePrice"]) >= int(g("priceMin"))]
    if g("priceMax"):
        items = [p for p in items if int(p["basePrice"]) <= int(g("priceMax"))]
    if g("sortBy") == "price-asc":
        items = sorted(items, key=lambda p: int(p["basePrice"]))
    elif g("sortBy") == "price-desc":
        items = sorted(items, key=lambda p: -int(p["basePrice"]))
    strip = lambda p: {k: v for k, v in p.items() if not k.startswith("_")}
    return {"success": True, "data": {
        "brands": [{"id": i, "name": b} for i, b in enumerate(BRANDS, 1)],
        "categories": [{"id": i, "name": c} for i, c in enumerate(CATS, 1)],
        "processors": [p["specs"]["processor"] for p in PRODUCTS],
        "products": [strip(p) for p in items]}}


class H(BaseHTTPRequestHandler):
    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        u = urlparse(self.path)
        q = parse_qs(u.query)
        path = u.path
        if path == "/api/shop":
            return self._send(200, shop(q))
        if path == "/api/products/search":
            term = q.get("q", [""])[0].lower()
            hits = [p for p in PRODUCTS if term and (term in p["name"].lower() or term in p["brand"]["name"].lower())]
            return self._send(200, {"success": True, "data": [
                {"id": p["id"], "name": p["name"], "slug": p["slug"], "basePrice": p["basePrice"]} for p in hits[:5]]})
        if path.startswith("/api/products/"):
            slug = path.split("/")[3]
            p = next((p for p in PRODUCTS if p["slug"] == slug), None)
            if not p:
                return self._send(404, {"success": False, "message": "Product not found"})
            d = {k: v for k, v in p.items() if not k.startswith("_") and k != "category"}
            d.update(reviews=p["_reviews"], productConfigs=p["_configs"],
                     productFeatures=[{"title": "Fitur A", "description": "..."}], productImages=[])
            return self._send(200, {"success": True, "data": d})
        self._send(404, {"success": False, "message": "Not found"})

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Mock WindStore API di http://localhost:{port}")
    HTTPServer(("", port), H).serve_forever()
