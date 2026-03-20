import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRinging, X } from '@phosphor-icons/react';
import { useNotification } from '../contexts/NotificationContext';

const NotifPrompt = () => {
    const { permission, isSubscribed, isSupported, subscribe } = useNotification();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Cek jika sudah disubscribe atau permission sudah granted/denied
        const dismissed = localStorage.getItem('notif_prompt_dismissed') === 'true';

        if (isSupported && !isSubscribed && permission === 'default' && !dismissed) {
            // Tampilkan setelah 5 detik buat kesan tidak agresif
            const timer = setTimeout(() => setIsVisible(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [isSupported, isSubscribed, permission]);

    const handleAccept = async () => {
        const success = await subscribe();
        if (success) setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('notif_prompt_dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, x: '-50%', opacity: 0 }}
                    animate={{ y: 24, x: '-50%', opacity: 1 }}
                    exit={{ y: -100, x: '-50%', opacity: 0 }}
                    className="fixed top-0 left-1/2 z-[100] w-[90%] max-w-md bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/10 p-4 rounded-3xl shadow-2xl flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BellRinging size={24} weight="fill" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-neutral-800 dark:text-white uppercase tracking-tight">Aktifkan Notifikasi?</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">Dapatkan info tugas & jadwal kuliah terbaru.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDismiss}
                            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleAccept}
                            className="bg-brand dark:bg-amber-500 text-white dark:text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all active:scale-95"
                        >
                            Izinkan
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotifPrompt;
