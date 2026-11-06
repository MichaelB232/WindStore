# WindStore 💻🚀

**WindStore** adalah platform e-commerce full-stack modern untuk penjualan laptop berbasis Windows premium. Pengguna dapat menelusuri katalog laptop, melakukan kustomisasi varian komponen (RAM, Storage), membeli langsung (*Direct Checkout*) atau melalui keranjang, melakukan pembayaran nyata via payment gateway **Midtrans Snap**, serta berkonsultasi langsung dengan **AI Shopping Assistant** cerdas yang terintegrasi.

Proyek ini dibangun secara kolaboratif oleh **Michael & Nicolaus** menggunakan arsitektur monorepo yang bersih dan modular:

```text
WindStore/
├── client/           # Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui
├── server/           # Node.js, Express 5, TypeScript, Prisma ORM (@prisma/adapter-pg)
├── agent/            # Python FastAPI, Google Gemini 2.5 Flash, Tool-Calling Autonomous Agent
├── docs/             # Dokumentasi teknis terpusat (Setup, API, PRD)
│   ├── setup.md      # Panduan instalasi, konfigurasi env, & pengujian lokal
│   ├── api.md        # Dokumentasi lengkap seluruh endpoint REST API
│   └── prd.md        # Product Requirements Document & arsitektur flow
└── docker-compose.yml# Container database PostgreSQL (Port 5433)
```

---

## 🚀 Panduan Menjalankan Aplikasi (Run Order)

Ikuti urutan di bawah ini untuk menjalankan seluruh ekosistem WindStore secara lokal:

### 1. Nyalakan Database PostgreSQL
Jika menggunakan Docker lokal:
```powershell
docker compose up -d postgres
```
*(Database berjalan di `localhost:5433` sesuai konfigurasi `docker-compose.yml` & `server/.env`).*

### 2. Jalankan Database Seeder (Cukup 1x Awal)
Untuk mengisi 41 laptop resmi (ASUS, Lenovo, Dell, HP, MSI, Acer, Samsung) beserta varian dan foto Cloudinary:
```powershell
npm --prefix server run seed
```

### 3. Nyalakan Backend API (Express)
Buka **Terminal Tab 1**:
```powershell
npm --prefix server run dev
```
* API berjalan di: `http://localhost:8000`

### 4. Nyalakan AI Shopping Assistant (Python FastAPI)
Buka **Terminal Tab 2**:
```powershell
python agent/api_server.py
```
* Agent API berjalan di: `http://localhost:8001`

### 5. Nyalakan Frontend Client (Next.js)
Buka **Terminal Tab 3**:
```powershell
npm --prefix client run dev
```
* Buka browser di: `http://localhost:3000`

---

## 🔑 Akun Uji Coba (Demo Accounts)

Tersedia akun bawaan seeder untuk eksplorasi instan tanpa perlu mendaftar dari nol:

| Role | Username | Password | Keterangan Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Akses penuh dashboard `/admin` (Manajemen Produk, Kategori, Order, Moderasi) |
| **Customer** | `johndoe` | `user123` | Akses belanja, wishlist, keranjang, review, & checkout Midtrans |
| **Customer** | `janedoe` | `user123` | Akun pembeli alternatif |

> **Fitur Praktis Portfolio:** Pada modal tambah alamat (*Add Address*), terdapat tombol **"Isi Template Demo"** sehingga penguji/recruiter tidak perlu mengetik alamat panjang saat mencoba checkout.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend** | **Next.js 16 (App Router)**, **React 19**, TypeScript, **Tailwind CSS 4**, shadcn/ui, Radix UI, Lucide Icons, Sonner |
| **Backend** | **Node.js**, **Express 5**, TypeScript, **Prisma ORM** (`@prisma/adapter-pg`) |
| **AI Assistant** | **FastAPI (Python)**, **Google Gemini 2.5 Flash**, Function Calling Tools (`search_products`, `compare_products`, `get_store_info`) |
| **Database** | **PostgreSQL 17** (via Docker container pada port `5433` atau cloud Postgres) |
| **Auth** | JWT (*JSON Web Token*) tersimpan aman di dalam `httpOnly` cookie dengan mode cross-domain `SameSite=None; Secure` untuk cloud |
| **Payments** | **Midtrans Snap** (Sandbox/Production) dengan verifikasi signature SHA-512 & *Active Status Sync* fallback |
| **Media Storage**| **Cloudinary CDN** (Aset katalog produk resmi terorganisir per brand) |
| **Background Jobs**| `node-cron` — otomatis membatalkan pesanan kedaluwarsa (>15 menit) dan mengembalikan stok barang |

---

## 📚 Dokumentasi Lanjutan

* 🔌 **[Dokumentasi REST API (docs/api.md)](./docs/api.md)** — Spesifikasi seluruh endpoint API, request/response body, autentikasi cookie JWT, dan error handling.
* 📋 **[Product Requirements Document (docs/prd.md)](./docs/prd.md)** — Ruang lingkup fungsional, arsitektur flow, dan spesifikasi sistem.
* ⚙️ **[Panduan Setup & Troubleshooting (docs/setup.md)](./docs/setup.md)** — Detail konfigurasi environment variables untuk deployment Vercel & Railway.

---

## ⚖️ Disclaimer

*This website is a collaborative portfolio project created by Michael & Nicolaus for demonstration purposes only. All product images, brand names, and logos belong to their respective owners (ASUS, Lenovo, Dell, HP, Acer, MSI, Samsung). No real commercial transactions are conducted.*
