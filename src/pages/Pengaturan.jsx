import React from 'react';
import { Gear, Moon, Sun, Bell, ShieldCheck, Palette } from '@phosphor-icons/react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';

const Pengaturan = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isSubscribed, isSupported, subscribe, unsubscribe } = useNotification();

    const handleToggleNotif = async () => {
        if (isSubscribed) {
            await unsubscribe();
        } else {
            const success = await subscribe();
            if (!success) {
                alert("Gagal mengaktifkan notifikasi. Silakan izinkan di browser.");
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="border-b border-neutral-100 dark:border-white/5 pb-2">
                <p className="text-neutral-500 text-sm">Sesuaikan preferensi tampilan dan keamanan akun Anda.</p>
            </div>

            <div className="space-y-6">
                {/* Appearance */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-800 dark:text-white px-2">
                        <Palette size={20} weight="duotone" className="text-brand dark:text-amber-400" />
                        Tampilan
                    </h3>
                    <div className="card divide-y divide-neutral-50 dark:divide-white/5">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                                    {isDarkMode ? <Moon size={20} weight="fill" /> : <Sun size={20} weight="fill" />}
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-800 dark:text-white text-sm">Mode Gelap (BETA)</p>
                                    <p className="text-xs text-neutral-400">Aktifkan untuk kenyamanan mata di malam hari.</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand' : 'bg-neutral-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-800 dark:text-white px-2">
                        <Bell size={20} weight="duotone" className="text-brand dark:text-amber-400" />
                        Notifikasi
                    </h3>
                    <div className="card divide-y divide-neutral-50 dark:divide-white/5">
                        <div className="p-5 flex items-center justify-between opacity-100 disabled:opacity-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                                    <Bell size={20} weight="bold" />
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-800 dark:text-white text-sm">Update Materi Baru</p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Terima pemberitahuan saat ada materi baru diunggah.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleNotif}
                                disabled={!isSupported}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isSubscribed ? 'bg-brand dark:bg-amber-500' : 'bg-neutral-200 dark:bg-white/10'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white dark:bg-neutral-900 rounded-full transition-all ${isSubscribed ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                        {!isSupported && (
                            <p className="p-4 text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">Browser tidak mendukung Push Notifications</p>
                        )}
                    </div>
                </section>

                {/* Security */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-800 dark:text-white px-2">
                        <ShieldCheck size={20} weight="duotone" className="text-brand dark:text-amber-400" />
                        Privasi & Keamanan
                    </h3>
                    <div className="card p-5 bg-neutral-50/50 dark:bg-white/5 border-dashed border-2 dark:border-white/5 text-center space-y-2">
                        <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Data Anda Aman</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">Kami tidak menyimpan data pribadi sensitif. Semua informasi materi bersifat terbuka untuk publik angkatan.</p>
                    </div>
                </section>

                {/* About & Info (Moved from main nav) */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-neutral-800 dark:text-white px-2">
                        <Gear size={20} weight="duotone" className="text-brand dark:text-amber-400" />
                        Bantuan & Info
                    </h3>
                    <div className="card divide-y divide-neutral-50 dark:divide-white/5">
                        <a href="/tentang" className="p-5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <ShieldCheck size={20} weight="bold" />
                                </div>
                                <p className="font-bold text-neutral-800 dark:text-white text-sm">Tentang Aplikasi</p>
                            </div>
                            <span className="text-neutral-300 dark:text-neutral-700">→</span>
                        </a>
                        <a href="/panduan-upload" className="p-5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Gear size={20} weight="bold" />
                                </div>
                                <p className="font-bold text-neutral-800 dark:text-white text-sm">Panduan Upload</p>
                            </div>
                            <span className="text-neutral-300 dark:text-neutral-700">→</span>
                        </a>
                    </div>
                </section>
            </div>

            <div className="pt-8 text-center text-neutral-300 text-[10px] font-black uppercase tracking-widest pb-10">
                Version 3.0.1-react
            </div>
        </div>
    );
};

export default Pengaturan;
