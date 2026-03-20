# Panduan: Upload Materi & Kontribusi

Sistem kontribusi F.AGRIELLA ditenagai oleh kombinasi **React Form State** dan **Google Apps Script** untuk memastikan pengunggahan materi yang aman dan terorganisir.

## Langkah-Langkah Berkontribusi

### 1. Memilih Kategori
Tentukan jenis materi yang ingin Anda unggah:
-   **Materi**: File referensi belajar (PDF/DOCX/PPT).
-   **Foto**: Dokumentasi kegiatan atau foto papan tulis.
-   **Tugas**: Informasi tenggat waktu dan deskripsi tugas.

### 2. Memasukkan Metadata
Pilih **Semester** terlebih dahulu. Sistem akan secara cerdas memuat daftar **Mata Kuliah** yang relevan secara asinkron. Masukkan judul materi dan deskripsi singkat.

### 3. Keamanan (Token)
Untuk mencegah *spamming* atau upload sembarangan, sistem memerlukan **Token Keamanan**. Token ini dibagikan oleh admin angkatan kepada mahasiswa yang dipercaya sebagai kontributor.

### 4. Eksekusi Upload
Pilih file dari perangkat Anda. Sistem mendukung **Multi-file upload**. Klik tombol "Upload" dan tunggu indikator progres hingga muncul pesan sukses.

---

## Fitur Cerdas: AI Task Extraction (Smart AI)

Jika Anda memiliki pesan panjang dari grup WhatsApp berisi jadwal tugas yang berantakan, Anda tidak perlu mengetiknya secara manual:
1.  Buka tab **Generate via AI** di menu Upload.
2.  Tempel (Paste) teks dari WhatsApp tersebut.
3.  Klik **Analisis AI**. Sistem akan mengekstrak Nama Mata Kuliah, Dosen, Deskripsi, dan Deadline secara otomatis menggunakan AI Groq.

> [!TIP]
> **Format File**: PDF adalah format yang paling disarankan karena kemudahannya untuk langsung dipratinjau dalam browser tanpa perlu diunduh terlebih dahulu.
