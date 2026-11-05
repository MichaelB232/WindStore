"""Tool untuk informasi toko: pembayaran, garansi, pengiriman, dan kebijakan toko."""
from typing import Optional

STORE_POLICIES = {
    "payment": (
        "WindStore mendukung pembayaran digital dan transfer via Midtrans Payment Gateway:\n"
        "- QRIS (GoPay, OVO, Dana, ShopeePay, LinkAja)\n"
        "- Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata)\n"
        "- Kartu Kredit / Debit (Visa, MasterCard, JCB dengan 3D Secure)"
    ),
    "warranty": (
        "Semua produk di WindStore 100% original dan bergaransi:\n"
        "- Garansi Resmi Distributor Indonesia (1 hingga 3 tahun tergantung brand laptop).\n"
        "- Garansi Toko ganti baru dalam 7 hari pertama jika ada cacat pabrik atau kendala hardware."
    ),
    "shipping": (
        "Kebijakan pengiriman WindStore:\n"
        "- Pengiriman ke seluruh Indonesia via JNE, SiCepat, dan Paxel.\n"
        "- Seluruh pengiriman laptop wajib diasuransikan penuh + packing kayu aman berlapis bubble wrap tebal tanpa biaya tambahan."
    ),
    "about": (
        "WindStore adalah e-commerce laptop terpercaya di Indonesia yang menyediakan lini laptop Windows "
        "terbaik untuk kebutuhan Gaming, Business, Ultrabook, Creator, dan Budget."
    ),
}


def get_store_info(topic: Optional[str] = None) -> dict:
    """Ambil informasi resmi toko WindStore seputar metode pembayaran, garansi, pengiriman, dan profil toko.

    Pakai saat user bertanya hal operasional toko, contoh: "bisa bayar pakai apa aja?", "apakah ada garansi?",
    "pengiriman pakai apa?", "apakah barang original?", "kebijakan retur gimana?".

    Args:
        topic: Topik informasi (opsional): 'payment' (metode pembayaran Midtrans/QRIS/VA), 'warranty' (garansi), 'shipping' (pengiriman), atau 'about' (tentang toko). Kosongkan untuk semua info.
    """
    if topic:
        t = topic.lower().strip()
        if t in STORE_POLICIES:
            return {"success": True, "topic": t, "information": STORE_POLICIES[t]}
        for k, v in STORE_POLICIES.items():
            if t in k or k in t:
                return {"success": True, "topic": k, "information": v}
        return {
            "success": True,
            "topic": topic,
            "note": f"Topik '{topic}' tidak spesifik, menampilkan seluruh informasi toko.",
            "information": STORE_POLICIES,
        }

    return {"success": True, "information": STORE_POLICIES}
