"""Registry tool. Mau nambah tool baru? Buat fungsinya, lalu daftarkan di TOOL_FUNCTIONS. Selesai."""
from tools.calculations import calculate_price, price_summary
from tools.products import compare_products, get_product, list_products
from tools.store_info import get_store_info

TOOL_FUNCTIONS = [
    list_products,
    get_product,
    compare_products,
    calculate_price,
    price_summary,
    get_store_info,
]
TOOL_MAP = {fn.__name__: fn for fn in TOOL_FUNCTIONS}  # dispatch: nama -> fungsi
