import Redis from 'ioredis';

// Inisialisasi koneksi Redis menggunakan URL dari Environment Variables
const redis = new Redis(process.env.REDIS_URL);

/**
 * API Handler untuk mengetes koneksi Redis di Vercel.
 * Akses via: https://fagriella-six.vercel.app/api/test-redis
 */
export default async function handler(request, response) {
    // Set Header agar tidak di-cache oleh browser
    response.setHeader('Cache-Control', 'no-store, max-age=0');

    try {
        // Step 1: Coba simpan data (SET)
        const testKey = "fagriella_test_time";
        const now = new Date().toLocaleString('id-ID');
        await redis.set(testKey, now);

        // Step 2: Coba ambil kembali data (GET)
        const value = await redis.get(testKey);

        // Step 3: Kirim respon sukses
        return response.status(200).json({
            success: true,
            status: "Koneksi Redis Berhasil! ✅",
            message: "Berhasil menulis dan membaca data dari Upstash Redis.",
            data_stored: value,
            redis_host: process.env.REDIS_URL ? "URL Terkonfigurasi 🛡️" : "URL Kosong ❌"
        });
    } catch (error) {
        // Jika gagal koneksi/konfigurasi
        console.error("Redis Test Error:", error);
        return response.status(500).json({
            success: false,
            status: "Koneksi Redis Gagal! ❌",
            error: error.message,
            tip: "Pastikan REDIS_URL sudah disave di Dashboard Vercel (bukan cuma di .env lokal)."
        });
    }
}
