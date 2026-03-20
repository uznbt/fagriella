# Web Push Notifications (Deep Dive)

Sistem notifikasi F.AGRIELLA menggunakan standar **VAPID (Voluntary Application Server Identification)** untuk mengirimkan pengumuman tugas harian langsung ke pusat notifikasi HP/Laptop Anda.

## Arsitektur Notifikasi

### 1. Pendaftaran (Subscription)
Saat Anda menekan tombol "Berlangganan" di Pengaturan:
1.  Browser Anda membuat sepasang kunci kriptografi unik.
2.  Private key tetap di browser, sedangkan **Public Key** dan **Endpoint** dikirim ke database **Upstash Redis** milik platform.

### 2. Pengiriman (Broadcast)
Admin memicu notifikasi melalui panel admin (`admin-notif.html`). Serverless function di Vercel kemudian:
1.  Mengambil ribuan token subscriber dari Redis.
2.  Membungkus pesan ke dalam paket data terenkripsi.
3.  Mengirimkannya ke server Push milik Google (FCM) atau Apple (APNs).

### 3. Penerimaan (Service Worker)
Di sisi penerima, ada file bernama `service-worker.js` yang berjalan di latar belakang (background) meskipun browser dalam keadaan tertutup. Layanan inilah yang menangkap sinyal dan menampilkan jendela pop-up notifikasi.

---

## Tips Troubleshooting
-   **Izin Diblokir**: Jika tidak muncul, cek pengaturan browser dan pastikan izin notifikasi untuk website ini adalah "Allow".
-   **Mode Hemat Daya**: Beberapa HP (terutama Android) mematikan proses latar belakang browser. Masukkan website ini ke dalam "Whitelist" baterai agar notifikasi selalu masuk tepat waktu.

> [!CAUTION]
> **Keamanan**: Kami tidak pernah mengumpulkan data pribadi (nama, email) untuk notifikasi ini. Sistem hanya menyimpan alamat anonim dari server push browser Anda untuk keperluan pengiriman pesan.
