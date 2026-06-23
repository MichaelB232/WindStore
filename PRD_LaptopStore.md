# Product Requirements Document
## WindStore

**Version:** 1.0.0
**Date:** June 2026
**Status:** Draft
**Currency:** IDR (Indonesian Rupiah)

# Overview
project : Windstore
Toko online single vendor untuk penjualan laptop berbagai brand berbasis Windows

# Tujuan utama project
- Memahami dan menyelesaikan sistem transaksi end-to-end
- Sistem bisa di deploy 
- Jadi nilai jual portofolio

Indikator keberhasilan: customer bisa daftar -> cari produk -> masukkan produk ke keranjang -> checkout -> pembayaran tanpa error -> pengurangan stok di inventaris.

# Target pengguna 
Customer: Mahasiswa, Gamer casual - professional, Pekerja.
Admin: developer sendiri sebagai pengelola toko

# Lingkup produk
## In Scope (Fitur Harus ada)
- Customer bisa lihat katalog produk, bisa melakukan search dan filter, bisa menyimpan produk ke keranjang belanja, bisa melakukan checkout dan pembayaran, bisa melihat riwayat pesanan, bisa login dan daftar akun, wishlist item, bisa memilih preset konfigurasi komponen tertentu sebelum memesan.
- Admin bisa menambahkan data barang, menghapus data barang, mengedit data barang, bisa melihat stok yang sudah habis, kelola pesanan (update status pesanan), bisa lihat daftar pesanan

## Out of Scope (Fitur lanjutan)
- Customer: bisa melakukan live chat dengan admin, customer bisa memberikan rating dan review di satu produk, fitur perbandingan produk
- Admin: bisa menambah vendor lain selain developer (multi vendor), 

# User Stories
- Sebagai customer saya ingin daftarkan akun agar bisa berbelanja
- Sebagai customer saya ingin filter laptop berdasarkan kriteria tertentu supaya cepat menemukan laptop sesuai keinginan
- Sebagai customer saya ingin menyimpan produk ke keranjang belanja supaya saya bisa menyimpan pilihan produk saya dan tidak melakukan pencarian ulang serta saya bisa menentukan produk mana saja yang akan saya checkout di akhir nanti
- Sebagai customer saya ingin memfavoritkan sebuah produk sebagai penanda untuk produk yang akan saya beli nanti, ini juga sebagai penanda ketertarikan saya terhadap produk tersebut
- Sebagai customer saya ingin memilih metode pembayaran yang familiar (transfer bank/e-wallet) supaya saya percaya transaksinya aman.
- Sebagai customer saya ingin memilih preset konfigurasi tertentu di dalam laptop seperti RAM, SSD, Garansi, OS nya (Windows 10, 11 , pro dll)
- Sebagai customer saya ingin melihat riwayat pemesanan yang sudah saya lakukan

- Sebagai admin saya ingin melihat produk dengan stok yang sudah habis / menipis
- Sebagai admin saya ingin melihat & mengelola data barang
- Sebagai admin saya ingin melihat & mengelola data pesanan 

# Functional Requirement
F001 - Autentikasi
Customer dan admin bisa register dan login menggunakan email & password. Sistem membedakan role (customer/admin) dan password disimpan dalam bentuk hash.

F002 - Katalog Produk
Customer bisa melihat daftar produk laptop (nama, brand, harga, spek utama, status stok) dan membuka halaman detail tiap produk.

F003 - Keranjang Belanja
Customer bisa menambah, mengubah jumlah, dan menghapus produk di keranjang sebelum checkout. Jika produk punya konfigurasi (lihat F011), konfigurasi yang dipilih ikut tersimpan di item keranjang.

F004 - Payment
Customer melakukan pembayaran melalui payment gateway (Midtrans). Sistem menerima callback status pembayaran, lalu otomatis memperbarui status pesanan dan mengurangi stok produk.

F005 - Admin Panel
Admin bisa menambah, mengedit, dan menghapus data produk beserta gambar, spesifikasi, dan stok.

F006 - Filter Produk
Customer bisa memfilter produk berdasarkan brand, kategori, rentang harga, dan spek (RAM, storage, processor).

F007 - Search Produk
Customer bisa mencari produk berdasarkan kata kunci nama produk atau brand.

F008 - Wishlist Produk
Customer bisa menyimpan produk ke daftar favorit untuk dilihat kembali tanpa harus mencari ulang.

F009 - Riwayat Pesanan
Customer bisa melihat daftar pesanan yang pernah dilakukan beserta status dan detail item di dalamnya.

F010 - Manajemen Pesanan (Admin)
Admin bisa melihat daftar pesanan masuk dan memperbarui status pesanan (diproses, dikirim, selesai).

F011 - Kustomisasi Produk
Customer bisa memilih konfigurasi tertentu pada laptop (misal varian RAM/storage, garansi, edisi Windows) dari beberapa preset opsi yang sudah disiapkan admin per produk. Harga menyesuaikan otomatis sesuai opsi yang dipilih.

# End-To-End Flow
1. Customer daftar/login
         ↓
2. Browse katalog, pilih produk + konfigurasi
         ↓
3. Tambah ke cart_items
         ↓
4. Checkout → sistem buat 1 baris orders
         ↓
5. cart_items dikonversi jadi order_items, lalu dihapus
         ↓
6. Customer pilih metode bayar → sistem buat 1 baris payments (status: pending)
         ↓
7. Customer bayar via Midtrans atau payment gateway lain
         ↓
8. Midtrans kirim callback ke backend
         ↓
9. Backend update payments.status → paid
         ↓
10. Backend update orders.status → processing
         ↓
11. Backend kurangi stock di products

# Tech
Frontend: Next Js 16 App router, Shadcn UI, Lucide
Backend: Node Js 22
DBMS: PostgreSQL