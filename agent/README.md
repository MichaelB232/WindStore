# WindStore Agent

Asisten AI berbasis Gemini dengan Autonomous Tool Calling ke API WindStore (`/api/shop`, `/api/products/...`).

## Fitur Tools
1. `list_products`: Filter katalog laptop (brand, category, budget min/max, sort, limit).
2. `get_product`: Detail spesifikasi, konfigurasi harga, dan ringkasan ulasan 1 laptop.
3. `compare_products`: Bandingkan 2 laptop *head-to-head* (harga, selisih harga, processor, RAM, storage, rating).
4. `calculate_price`: Kalkulasi total harga unit, opsi konfigurasi storage/RAM, dan diskon.
5. `price_summary`: Statistik harga laptop (rata-rata, termurah, termahal, total stok).
6. `get_store_info`: Informasi resmi toko seputar pembayaran Midtrans (QRIS, VA, CC), garansi resmi, dan pengiriman.

## Cara Menjalankan

### 1. Setup Environment
```bash
pip install -r requirements.txt
cp .env.example .env        # isi GEMINI_API_KEY
```

### 2. Jalankan Server API untuk Website (FastAPI Port 8001)
```bash
python api_server.py
# atau:
uvicorn api_server:app --port 8001 --reload
```
Akses docs interaktif di: `http://localhost:8001/docs`

### 3. Testing & Mode Lain
```bash
# Terminal testing CLI interaktif:
python main.py

# Streamlit UI untuk demo standalone:
streamlit run app.py

# Menjalankan mock server Express (tanpa Postgres):
python tests/mock_server.py
```
