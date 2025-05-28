# Bookshelf API

Bookshelf API adalah RESTful API sederhana yang dibuat menggunakan **Node.js (native HTTP module)** untuk keperluan submission belajar back-end dari Dicoding. API ini memungkinkan pengguna untuk menyimpan, membaca, mengubah, dan menghapus data buku.

## 📌 Fitur

- Tambah buku baru
- Lihat semua buku
- Lihat detail buku berdasarkan ID
- Ubah informasi buku
- Hapus buku
- Filter berdasarkan nama, status selesai dibaca, dan sedang dibaca

## 📁 Struktur Proyek

bookshelf-api/
├── src/
│ ├── server.js # File utama server
│ ├── books.js # Data dan array buku
│ └── handler.js # Handler CRUD
├── package.json
└── README.md


## 🚀 Cara Menjalankan

1. **Klon repositori:**
   ```bash
   git clone https://github.com/username/bookshelf-api.git
   cd bookshelf-api

2. **Install dependensi:**
   ```bash
   npm install

3. **Jalankan server:**
   ```bash
   npm start

5. **Server berjalan di:**
   ```bash
   http://localhost:9000
   (Ubah port di server.js jika perlu)

## 🛠️ Teknologi
1. Node.js (tanpa framework tambahan)
2. nanoid untuk ID unik
3. ESLint untuk linter
