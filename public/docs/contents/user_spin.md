# Panduan: Spin Kelompok (Next-Gen)

Fitur **Spin Kelompok** F.AGRIELLA saat ini ditenagai oleh mesin animasi berbasis *Canvas/CSS-Inertia* yang terintegrasi langsung dalam ekosistem React, memberikan pengalaman pengundian yang halus dan transparan.

## Cara Mengoperasikan Spin

### 1. Memasukkan Peserta
Masukkan daftar nama siswa atau kode kelompok ke dalam kotak input yang responsif.
-   **Auto-Count**: Sistem secara otomatis menghitung jumlah entri Anda secara real-time.
-   **Clean Input**: Spasi berlebih akan dibersihkan secara otomatis oleh logika React sebelum roda digambarkan.

### 2. Konfigurasi Cerdas
Akses ikon gerigi (⚙️) untuk mengatur:
-   **Durasi Putaran**: Kontrol presisi dari 1 hingga 60 detik.
-   **Skip Animation**: Untuk hasil instan bagi yang tidak ingin menunggu.

---

## Fitur Transparansi (Backend Integrasi)

Berbeda dengan aplikasi pengacak biasa yang hasilnya hilang saat di-refresh, F.AGRIELLA memiliki fitur **Persistent Result**:
1.  **Logging Otomatis**: Hasil pengundian dikirim ke backend Google Sheets (`ResultSpin.gs`) sebagai bukti permanen.
2.  **Screenshot-Ready**: Antarmuka hasil dirancang agar mudah ditangkap layar (screenshot) sebagai bukti yang sah untuk dibagikan di grup kelas.
3.  **Share to WhatsApp**: Tombol berbagi otomatis yang menyusun pesan rapi berisi daftar pemenang atau kelompok yang telah dibagi.

> [!TIP]
> **Optimasi Visual**: Roda paling ideal digunakan untuk 5-20 peserta. Jika lebih dari itu, disarankan menggunakan fitur "Acak List" yang tersedia di tab dashboard samping.
