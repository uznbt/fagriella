# Google Sheets sebagai Database (DB Engine)

F.AGRIELLA menggunakan **Google Sheets** sebagai mesin basis data utamanya. Pilihan ini diambil untuk mengedepankan transparansi dan kemudahan pengelolaan data oleh admin Kelas F.

## Struktur Tabel (Sheets)

Database kita terbagi menjadi beberapa TAB penting di dalam satu Spreadsheet utama:

### 1. Tab `Courses` (Mata Kuliah)
Berisi daftar mata kuliah yang pernah dan sedang berjalan.
-   **Kolom**: `name`, `dosen`, `semester`, `pic` (Penanggung Jawab).

### 2. Tab `Materials` (Gudang Materi)
Berisi seluruh index file yang bisa diunduh oleh mahasiswa.
-   **Kolom**: `course`, `filename`, `date`, `type`, `size`, `link` (Tautan GDrive/Web).

### 3. Tab `Assignments` (Tugas Kuliah)
Berisi jadwal tugas harian.
-   **Kolom**: `date`, `course`, `lecturer`, `description`, `deadline`, `note`.

---

## Mengapa Kami Menggunakan Sheets?

Kami tidak menggunakan database tradisional seperti MySQL atau MongoDB karena:
1.  **Kemudahan Input**: Admin dapat mengedit data menggunakan antarmuka Excel/Sheets yang sudah sangat familiar di HP maupun laptop.
2.  **Zero Downtime**: Server Google memiliki reliabilitas yang sangat tinggi; data hampir selalu tersedia 24/7.
3.  **Collaboration**: Beberapa admin dapat memperbarui jadwal tugas secara bersamaan tanpa konflik akses yang rumit.

> [!TIP]
> **API Access**: website ini tidak memanggil API Sheets satu-per-satu untuk efisiensi, melainkan membaca data dalam format **CSV terkompresi** yang dihasilkan secara otomatis oleh skrip backend kita di Apps Script.
