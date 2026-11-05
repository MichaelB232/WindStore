# WindStore — Development Setup & Installation Guide

Panduan lengkap instalasi, konfigurasi lingkungan, dan alur pengujian lokal untuk WindStore.

---

## 📋 Prerequisites

Sebelum memulai, pastikan perangkat Anda telah terpasang:
- **Node.js**: v18.0.0 atau lebih tinggi (disarankan Node.js v20+)
- **npm**: v9+
- **Docker Desktop**: Untuk menjalankan database PostgreSQL lokal
- **Git**: Versi terbaru

---

## 🚀 First Time Setup

### 1. Clone Repository

```bash
git clone https://github.com/MichaelB232/WindStore.git
cd WindStore
```

### 2. Install Dependencies

Install dependensi untuk kedua aplikasi (**Server** dan **Client**):

```bash
# Install dependensi backend
cd server
npm install

# Install dependensi frontend
cd ../client
npm install
cd ..
```

---

### 3. Konfigurasi Environment Variables

#### A. Backend (`server/.env`)

Salin file contoh konfigurasi pada folder `server/`:

```bash
cd server
cp .env.example .env
```

Sesuaikan nilai di dalam `server/.env`:

```env
# Database PostgreSQL (Port 5433 sesuai pemetaan docker-compose)
DATABASE_URL="postgresql://postgres:password123@localhost:5433/windstore"

# JWT Authentication
JWT_SECRET="kunci-rahasia-jwt-acak-anda-disini"

# Server Port & Client URL
PORT=8000
CLIENT_URL=http://localhost:3000

# Midtrans Payment Gateway (Sandbox Keys)
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Cloudinary Media Storage (Untuk upload foto produk laptop)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### B. Frontend (`client/.env.local`)

Buat file `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxxxxxxxxxx
```

---

### 4. Menjalankan Database PostgreSQL (Docker)

Jalankan container PostgreSQL menggunakan Docker Compose dari root proyek:

```bash
# Dari root directory
docker-compose up -d
```

> **Catatan Port:** PostgreSQL berjalan di port **5433** pada host machine (`5433:5432`) untuk mencegah konflik dengan instalasi PostgreSQL lokal yang biasanya memakai port default 5432.

---

### 5. Generate Prisma Client & Database Migrations

Jalankan migrasi skema database dan generate Prisma Client:

```bash
cd server
npx prisma migrate dev
```

---

### 6. Seeding Data Awal

Isi database dengan data produk laptop, kategori, brand, spesifikasi, dan user default:

```bash
# Dari dalam folder server
npm run seed
```

---

### 7. Menjalankan Server & Client

Buka dua terminal terpisah:

```bash
# Terminal 1 — Backend (Express API)
cd server
npm run dev
# Berjalan di http://localhost:8000
```

```bash
# Terminal 2 — Frontend (Next.js)
cd client
npm run dev
# Berjalan di http://localhost:3000
```

Buka browser Anda di [http://localhost:3000](http://localhost:3000).

---

## 💳 Panduan Pembayaran Midtrans Sandbox

WindStore terintegrasi langsung dengan payment gateway **Midtrans Snap**.

### Cara Kerja Pengujian Pembayaran:

WindStore telah dilengkapi dengan **Active Status Sync Fallback**. Artinya, saat pengujian di `localhost`, Anda **tidak wajib** menggunakan Ngrok. Begitu pembayaran selesai di pop-up Snap, sistem backend otomatis menyinkronkan status pesanan menjadi `paid` saat halaman detail pesanan dimuat!

### Kredensial Kartu Kredit Uji Coba (Sandbox Card):

Jika pada pop-up Midtrans Snap memilih metode **Credit / Debit Card**, gunakan kredensial berikut:

| Field | Nilai Uji Coba | Keterangan |
| :--- | :--- | :--- |
| **Card Number** | `4811 1111 1111 1114` | Visa 3DS Success |
| **Valid Thru / Expiry** | `12/28` | Bulan/Tahun masa depan apa saja |
| **CVV** | `123` | 3 digit sembarang |
| **3DS OTP / Password** | `112233` | Password OTP resmi Midtrans Sandbox |

### Simulasi Virtual Account & E-Wallet:

Jika memilih metode **Virtual Account (BCA / Mandiri / BNI / BRI)**:
1. Midtrans akan memunculkan Nomor Virtual Account simulasi.
2. Salin nomor VA tersebut.
3. Buka [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com).
4. Pilih bank yang sesuai, tempel nomor VA, dan klik **Inquire / Pay**.
5. Pesanan akan otomatis terbayar.

---

## 🌐 Opsional: Setup Ngrok Webhook

Jika Anda ingin menguji webhook real-time dari server Midtrans langsung ke `localhost`:

1. Download dan pasang [ngrok](https://ngrok.com/).
2. Hubungkan authtoken:
   ```bash
   ngrok config add-authtoken <TOKEN_ANDA>
   ```
3. Jalankan tunnel port backend:
   ```bash
   ngrok http 8000
   ```
4. Salin URL HTTPS yang dihasilkan (misal: `https://abc123.ngrok-free.app`).
5. Buka **Midtrans Dashboard Sandbox** → **Settings** → **Configuration**.
6. Isi **Payment Notification URL** dengan:
   ```
   https://abc123.ngrok-free.app/api/payments/webhook
   ```
7. Klik **Save Changes**.

---

## 👥 Akun Uji Coba Bawaan (Seed Data)

Setelah menjalankan `npm run seed`, Anda dapat langsung login menggunakan akun berikut:

| Role | Username / Identifier | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Akses penuh dashboard `/admin`, katalog, pesanan, moderasi review |
| **Customer** | `johndoe` | `user123` | Belanja, kustomisasi laptop, checkout, review produk |
| **Customer** | `janedoe` | `user123` | Belanja, checkout |

> **Catatan Login:** Form login mendukung input menggunakan **username** maupun **email**.

---

## 🛠️ Common Troubleshooting

### 1. Database connection failed / Connection Refused
- Pastikan Docker Desktop sedang aktif.
- Jalankan `docker ps` dan pastikan container `windstore-db` berstatus *Up*.
- Periksa port pada `.env`: pastikan menggunakan port `5433` (`localhost:5433`).

### 2. `TypeError: Failed to fetch` di browser
- Pastikan server backend (`npm run dev` di `server/`) menyala di port `8000`.
- Periksa variabel `NEXT_PUBLIC_API_URL` pada `client/.env.local`.

### 3. Migrasi Gagal atau Schema Out of Sync
- Jalankan:
  ```bash
  cd server
  npx prisma generate
  npx prisma migrate dev
  ```
