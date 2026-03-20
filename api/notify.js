import webpush from 'web-push';
import Redis from 'ioredis';

// Inisialisasi Redis
const redis = new Redis(process.env.REDIS_URL || process.env.STORAGE_URL || process.env.KV_URL);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, NOTIFICATION_API_KEY } = process.env;

    // Pastikan konfigurasi VAPID ada di server (Vercel)
    if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        return response.status(500).json({ error: 'Server configuration error (Missing VAPID keys)' });
    }

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    // Keamanan menggunakan API Key
    const apiKey = request.headers['x-api-key'];
    if (apiKey !== NOTIFICATION_API_KEY) {
        return response.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    const { title, body, icon, url } = request.body;

    try {
        // Ambil semua subscriber dari Redis
        const keys = await redis.keys('sub:*');

        if (!keys || keys.length === 0) {
            return response.status(200).json({ success: true, count: 0, message: "No subscribers found" });
        }

        const notifications = [];

        for (const key of keys) {
            const subscription = await redis.get(key);
            if (subscription) {
                const subObj = JSON.parse(subscription);

                notifications.push(
                    webpush.sendNotification(subObj, JSON.stringify({
                        title,
                        body,
                        icon: icon || 'https://fagriella.vercel.app/icons/logo.webp',
                        data: { url: url || '/' }
                    })).catch(err => {
                        // Hapus subscriber jika sudah tidak valid (Expired/Unsubscribed dari browser)
                        if (err.statusCode === 410 || err.statusCode === 404) {
                            return redis.del(key);
                        }
                        console.error('Push Send Error:', err.statusCode);
                    })
                );
            }
        }

        await Promise.all(notifications);
        return response.status(200).json({ success: true, count: notifications.length });
    } catch (error) {
        console.error('General Notify Error:', error);
        return response.status(500).json({ error: 'Failed to trigger notifications: ' + error.message });
    }
}
