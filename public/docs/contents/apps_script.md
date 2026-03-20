# Google Apps Script (Logic Server)

**Google Apps Script (GAS)** adalah otak di balik sistem otomasi F.AGRIELLA. Ini adalah platform serverless yang menjalankan script JavaScript (V8 engine) langsung di infrastruktur Google Cloud.

## Peran Utama Apps Script

### 1. Handler Form Materi (Upload)
Saat Anda mengirim data dari halaman Upload, GAS akan menangkap data tersebut, menyimpannya ke Google Drive (jika ada file), dan mencatat metadatanya ke dalam Google Sheets secara otomatis.

### 2. AI Intelligence Engine
GAS bertindak sebagai jembatan (proxy) antara website dengan **AI Groq**. Saat Anda menempelkan pesan jadwal WA, GAS mengirimkan instruksi khusus (system prompt) ke model AI untuk memproses teks tersebut menjadi format tabel yang rapi.

### 3. Otomasi & Pembersihan
GAS memiliki fitur *Trigger* yang berjalan di jam-jam tertentu untuk:
-   Memeriksa apakah ada file yang kadaluwarsa.
-   Mensinkronisasi token akses admin.
-   Melakukan backup data secara rutin dari Sheets ke folder cadangan.

---

## Logika Inti (Functions)

Beberapa fungsi utama yang ada di dalam skrip backend kita:
-   `doPost(e)`: Pintu masuk utama untuk seluruh pengiriman data dari website.
-   `processAIRequest()`: Logika pengolahan teks menggunakan Artificial Intelligence.
-   `uploadToDrive()`: Logika transfer file Base64 menjadi file fisik di Google Drive.

> [!CAUTION]
> **Keamanan Kunci**: Seluruh `API_KEY` dan `ACCESS_TOKEN` disimpan di dalam Properti Skrip (Environment Variables) di Google Apps Script sehingga tidak akan terekspos ke publik meskipun kode frontend kita bersifat *open-source*.
