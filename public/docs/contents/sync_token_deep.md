# Sinkronisasi Data & Keamanan (Deep Dive)

Bagian ini menjelaskan mekanisme di balik layar bagaimana data materi dan tugas tetap aman namun mudah diakses secara publik oleh seluruh mahasiswa Kelas F.

## Protokol Sinkronisasi

Sistem menggunakan metode **Selective Pulling**:
1.  **Index Fetch**: Saat aplikasi dibuka, React memicu *fetch request* ke Google Sheets untuk mengambil daftar metadata (nama file, tanggal, link) dalam format yang diperkecil (CSV/Simplified JSON).
2.  **State Hydration**: Data tersebut kemudian dimasukkan ke dalam state aplikasi untuk ditampilkan secara instan.
3.  **Lazy Loading**: File fisik (seperti PDF atau Foto) tidak akan diunduh sampai pengguna benar-benar mengkliknya, menghemat bandwidth secara signifikan.

---

## Keamanan & Token (Admin Only)

Meskipun data bersifat publik untuk dibaca (Read), proses penulisan (Write/Update) dilindungi oleh sistem **Token-Based Authorization**:
-   **App Token**: Kunci statis (misal: "FA-2025") yang diperlukan untuk melakukan upload materi baru.
-   **Admin Token**: Kunci dinamis yang hanya diketahui oleh admin utama untuk menghapus atau memodifikasi data yang sudah ada di Sheets atau Drive.

### Mengapa Google Sheets?
Kami memilih Google Sheets sebagai database utama karena:
-   **Transparansi**: Seluruh angkatan bisa melihat log mentah jika diperlukan.
-   **Kemudahan Maintenance**: Penanggung Jawab materi tidak perlu belajar database SQL/NoSQL; cukup mengisi tabel seperti Excel biasa.
-   **Gratis**: Tanpa biaya langganan database server.

---

> [!IMPORTANT]
> **Integritas Link**: Jangan pernah membagikan link file mentah dari Google Drive secara publik di luar website ini, karena link tersebut bisa saja berubah atau kedaluwarsa jika file dipindahkan oleh admin. Selalu bagikan link website ini untuk referensi materi.
