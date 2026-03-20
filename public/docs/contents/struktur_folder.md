# Struktur Folder & Organisasi Kode

Proyek F.AGRIELLA mengikuti standar struktur folder React modern untuk memastikan keterbacaan kode (clean code) dan kemudahan pemeliharaan jangka panjang.

## 1. Pohon Direktori Utama

```bash
ArsipKuliah/
├── analisis/          # Sumber dokumentasi & riset (Legacy & Docs)
├── public/            # Aset statis (Gambar, Favicon, JSON Dokumentasi)
│   └── docs/          # Aset Sistem Dokumentasi terintegrasi
├── src/               # Inti dari aplikasi React
│   ├── assets/        # Gambar & WebP yang di-import via JS
│   ├── components/    # Komponen UI kecil (Button, Card, Modal)
│   ├── contexts/      # State Management (Theme, Auth)
│   ├── layouts/       # Wrapper tampilan (Desktop, Mobile)
│   ├── pages/         # Halaman utama aplikasi (Home, Undi, dll)
│   ├── App.jsx        # Routing utama & Entry point logic
│   ├── main.jsx       # Mounting React ke DOM
│   └── index.css      # Styling global & Tailwind Layer
├── tailwind.config.js # Konfigurasi desain (Colors, Fonts, Blur)
└── vite.config.js     # Konfigurasi Build & Developer Server
```

---

## 2. Penjelasan Direktori Penting

### A. `/src/pages`
Sesuai dengan prinsip **Atomic Design**, setiap file di sini merepresentasikan satu menu utama.
- `Home.jsx`: Dashboard materi dan tugas.
- `Undi.jsx`: Logika mesin spin dan pengundian kelompok.
- `ArsipFoto.jsx`: Galeri dokumentasi visual.
- `Dokumentasi.jsx`: Komponen yang sedang Anda baca sekarang (Markdown Viewer).

### B. `/src/layouts`
Memisahkan pengalaman pengguna antara perangkat layar lebar dan HP secara eksplisit.
- `DesktopLayout.jsx`: Sidebar kiri permanen dan header lebar.
- `MobileLayout.jsx`: Bottom navigation bar dan header simpel dengan *Zero-Lag Philosophy* (tanpa blur/shadow).

### C. `/public/docs`
Ini adalah folder vital untuk sistem informasi terintegrasi. Berisi subfolder `contents` (file .md) dan `images`. Dengan memisahkan konten dokumentasi dari kode React, kita bisa memperbarui isi panduan tanpa perlu melakukan kompilasi ulang kode utama secara besar-besaran.

---

## 3. Alur Pengembangan (Convention)

1.  **Komponen**: Buat komponen baru di `src/components` menggunakan functional component dengan Hooks.
2.  **Styling**: Gunakan kelas utilitas Tailwind langsung di elemen. Untuk style yang sangat sering diulang atau kompleks (seperti markdown), gunakan `@apply` di `index.css`.
3.  **Aset**: Selalu konversi gambar ke format `.webp` dan letakkan di `src/assets` jika ingin di-bundle, atau di `public/` jika ingin diakses langsung via URL.

> [!TIP]
> **Modularitas**: Jika sebuah halaman memiliki logika yang sangat panjang, pecahlah menjadi beberapa sub-komponen di dalam folder yang sama untuk mempermudah debugging.
