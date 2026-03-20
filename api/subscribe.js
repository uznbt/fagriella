import Redis from 'ioredis';

// Inisialisasi Redis (mendukung banyak konfigurasi provider)
const redis = new Redis(process.env.REDIS_URL || process.env.STORAGE_URL || process.env.KV_URL);

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { subscription, userId } = request.body;

    if (!subscription) {
        return response.status(400).json({ error: 'Subscription is required' });
    }

    // Key unik untuk setiap subscriber (menggunakan fingerprint browser)
    const key = `sub:${userId || 'anonymous'}`;

    try {
        await redis.set(key, JSON.stringify(subscription));
        return response.status(200).json({ success: true });
    } catch (error) {
        console.error('Redis Subscription Error:', error);
        return response.status(500).json({ error: 'Failed to save subscription settings.' });
    }
}
