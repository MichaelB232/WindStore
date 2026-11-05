# WindStore 💻🚀

**WindStore** adalah platform e-commerce full-stack modern untuk penjualan laptop berbasis Windows premium. Pengguna dapat menelusuri katalog laptop, melakukan kustomisasi varian komponen (RAM, Storage, OS, Garansi), membeli langsung (*Direct Checkout*) atau melalui keranjang, melakukan pembayaran nyata via payment gateway **Midtrans Snap**, serta memberikan ulasan terverifikasi setelah pesanan selesai. Dilengkapi pula dengan dashboard admin khusus untuk manajemen katalog, stok, dan moderasi.

Proyek ini dibangun menggunakan arsitektur monorepo yang bersih dan modular:

```
WindStore/
├── client/           # Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui
├── server/           # Node.js, Express 5, TypeScript, Prisma ORM (@prisma/adapter-pg)
├── docs/             # Dokumentasi teknis terpusat (Setup, API, PRD)
│   ├── setup.md      # Panduan instalasi, konfigurasi env, & pengujian lokal
│   ├── api.md        # Dokumentasi lengkap seluruh endpoint REST API
│   └── prd.md        # Product Requirements Document & arsitektur flow
└── docker-compose.yml# Container database PostgreSQL (Port 5433)
```

---

## 📚 Dokumentasi Teknis

Semua dokumentasi teknis telah dirapikan ke dalam direktori [`docs/`](./docs/):

* 🚀 **[Panduan Instalasi & Setup Lokal (docs/setup.md)](./docs/setup.md)** — Langkah instalasi lengkap, environment variables, kredensial Midtrans sandbox, dan troubleshooting.
* 🔌 **[Dokumentasi REST API (docs/api.md)](./docs/api.md)** — Spesifikasi seluruh endpoint API, request/response body, autentikasi cookie JWT, dan error handling.
* 📋 **[Product Requirements Document (docs/prd.md)](./docs/prd.md)** — Ruang lingkup fungsional, spesifikasi teknis, dan diagram alur transaksi.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend** | **Next.js 16 (App Router)**, **React 19**, TypeScript, **Tailwind CSS 4**, shadcn/ui, Radix UI, Lucide Icons, Sonner |
| **Backend** | **Node.js**, **Express 5**, TypeScript, **Prisma ORM** (`@prisma/adapter-pg`) |
| **Database** | **PostgreSQL 17** (via Docker container pada port `5433`) |
| **Auth** | JWT (*JSON Web Token*) tersimpan aman di dalam `httpOnly` cookie, hashing password via bcrypt |
| **Payments** | **Midtrans Snap** (Sandbox/Production) dengan verifikasi signature SHA-512 & *Active Status Sync* fallback |
| **Media Storage**| **Cloudinary** (Upload gambar produk via Multer in-memory storage) |
| **Concurrency** | *Pessimistic Row-Level Locking* (`SELECT FOR UPDATE`) & PostgreSQL Check Constraint (`stock >= 0`) |
| **Background Jobs**| `node-cron` — otomatis membatalkan pesanan kedaluwarsa (>15 menit) dan mengembalikan stok barang |

---

## ✨ Fitur Unggulan

### 🛍️ Storefront & Belanja
- **Katalog & Filter Presisi:** Filter berdasarkan kategori, brand, tipe prosesor, dan rentang harga dengan sorting dan live search bar.
- **Kustomisasi Konfigurasi (Build Your Setup):** Pemilihan varian RAM, SSD, dll. dengan penyesuaian harga (*price modifier*) dinamis.
- **Beli Sekarang (Direct Checkout):** Tombol checkout instan pada produk yang langsung membawa pengguna ke pembayaran tanpa harus melalui keranjang manual.
- **Multi-Item Keranjang Belanja:** Pemilihan parsial barang untuk di-checkout sewaktu-waktu.
- **Buku Alamat Pengiriman:** Simpan beberapa alamat dan tetapkan alamat pengiriman utama (*default*).
- **Payment Gateway Midtrans:** Mendukung Virtual Account (BCA, Mandiri, BNI, BRI), QRIS/GoPay, dan Kartu Kredit dengan 3DS OTP.
- **Ulasan Pembeli Terverifikasi (Verified Buyer Reviews):** Hanya customer yang telah membeli dan menyelesaikan pesanan yang dapat memberikan rating dan ulasan, serta dapat **mengedit ulasan** mereka kapan saja.

### 🛡️ Keamanan & Kepatuhan Transaksi
- **Pencegahan Race Condition Stok:** Transaksi checkout dilindungi dengan *Row-Level Locking* (`SELECT ... FOR UPDATE`) pada PostgreSQL agar stok tidak pernah minus meski di-checkout bersamaan di detik yang sama.
- **Kepatuhan Audit Finansial (Soft Delete):** Penghapusan akun customer menggunakan *Soft Delete* (`isActive: false`), memastikan riwayat transaksi dan pembukuan pesanan yang sudah dibayar tetap utuh demi kepatuhan audit.
- **Active Status Sync Fallback:** Status pesanan Midtrans otomatis tersinkronisasi saat halaman detail dibuka, memungkinkan pengujian mulus di `localhost` tanpa wajib setup tunnel Ngrok.

### ⚙️ Admin Dashboard
- **Katalog & Inventaris:** Tambah, edit, dan hapus laptop beserta upload multi-gambar ke Cloudinary.
- **Preset Konfigurasi:** Atur harga tambahan per opsi RAM/Storage.
- **Pantauan Pesanan & Pengguna:** Kelola status pesanan customer dan daftar pengguna terdaftar.

---

## ⚡ Quickstart (Menjalankan Secara Lokal)

### 1. Jalankan Database (Docker)
```bash
docker-compose up -d
```
> Database PostgreSQL berjalan pada `localhost:5433`.

### 2. Setup Backend (Server)
```bash
cd server
npm install
cp .env.example .env     # Sesuaikan credential database & Midtrans
npx prisma migrate dev  # Jalankan migrasi
npm run seed            # Isi database dengan data awal
npm run dev             # Berjalan di http://localhost:8000
```

### 3. Setup Frontend (Client)
```bash
cd ../client
npm install
cp .env.example .env.local  # Pastikan NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                 # Berjalan di http://localhost:3000
```

---

## 🔑 Akun Uji Coba Default

Setelah menjalankan `npm run seed`:

| Role | Username / Identifier | Password | Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Akses penuh dashboard `/admin` |
| **Customer** | `johndoe` | `user123` | Belanja, kustomisasi, checkout, review produk |
| **Customer** | `janedoe` | `user123` | Belanja dan checkout |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [ISC](LICENSE).
