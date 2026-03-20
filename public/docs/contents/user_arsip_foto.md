# Panduan: Arsip Foto & Dokumentasi Visual

Sistem **Arsip Foto** F.AGRIELLA menyajikan dokumentasi kegiatan angkatan dalam balutan galeri premium yang didukung oleh teknologi *Image Optimization* dan *React Lightbox*.

## Navigasi Galeri

### 1. Filter Semester
Gunakan dropdown semester di bagian atas galeri untuk menyaring album. Sistem menggunakan *Client-Side Filtering* yang memungkinkan pergantian album secara instan tanpa memuat ulang halaman.

### 2. Eksplorasi Album
Setiap album memiliki sampul (cover) dan deskripsi singkat. Klik pada kartu album untuk masuk ke dalam kumpulan foto.

### 3. Mode Lightbox
Klik pada foto mana pun untuk membukanya dalam ukuran penuh. Di dalam mode ini, Anda bisa:
-   Melihat detail foto dengan jelas.
-   Bernavigasi antar foto dengan cepat.
-   Melakukan klik kanan untuk menyimpan (save image) atau menyalin tautan gambar.

---

## Integritas Data & Penyimpanan
Foto-foto yang Anda lihat dikelola melalui **Google Sheets** sebagai indexer dan disimpan di CDN (GitHub/Vercel) untuk memastikan kecepatan akses yang maksimal bagi pengguna di Indonesia.

> [!IMPORTANT]
> **Kecepatan Akses**: Jika gambar lambat dimuat, pastikan Anda berada di jaringan yang stabil. Website akan secara otomatis mencoba memuat versi gambar yang lebih kecil (WebP) untuk menghemat kuota data Anda.
