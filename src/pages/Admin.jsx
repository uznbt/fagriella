import React, { useState } from 'react';
import { Megaphone, PaperPlaneTilt, Spinner, ArrowLeft, ShieldCheck, Link, TextT, WarningCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [apiKey, setApiKey] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('https://fagriella.vercel.app');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleSend = async (e) => {
        e.preventDefault();
        if (!apiKey || !title || !message) {
            setStatus({ type: 'error', msg: 'Lengkapi Token PJ, Judul, dan Pesan!' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    title,
                    body: message,
                    url
                })
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', msg: `Berhasil! Notifikasi dikirim ke ${result.results?.length || 0} perangkat.` });
                setTitle('');
                setMessage('');
            } else {
                setStatus({ type: 'error', msg: result.error || 'Gagal mengirim. Cek Token PJ Anda.' });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: 'Koneksi bermasalah atau API tidak merespon.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Kembali</span>
            </button>

            <div className="bg-white dark:bg-[#14231f] rounded-[2.5rem] border border-neutral-100 dark:border-white/5 p-8 md:p-12 shadow-2xl shadow-brand/5 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 dark:bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="relative z-10 space-y-8">
                    <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-brand dark:bg-amber-500 text-white dark:text-black rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-brand/20 dark:shadow-amber-900/10">
                            <Megaphone size={32} weight="fill" />
                        </div>
                        <h1 className="text-3xl font-outfit font-black text-neutral-800 dark:text-white tracking-tight">Broadcast Center</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs mx-auto">Kirim pesan real-time ke seluruh subscriber F.AGRIELLA.</p>
                    </div>

                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-4">
                            {/* Token PJ */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">
                                    <ShieldCheck size={14} />
                                    Token PJ (Password)
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand dark:focus:ring-amber-500 outline-none transition-all font-mono"
                                />
                            </div>

                            {/* Judul */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">
                                    <TextT size={14} />
                                    Judul Notifikasi
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ada tugas baru!"
                                    className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand dark:focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>

                            {/* Pesan */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">
                                    <Megaphone size={14} />
                                    Isi Pesan
                                </label>
                                <textarea
                                    rows="3"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Deadline besok pagi jam 07:00..."
                                    className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand dark:focus:ring-amber-500 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* URL */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">
                                    <Link size={14} />
                                    Link Tujuan (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand dark:focus:ring-amber-500 outline-none transition-all text-neutral-500"
                                />
                            </div>
                        </div>

                        {status.msg && (
                            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${status.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10' : 'bg-brand/5 text-brand dark:bg-amber-500/10 dark:text-amber-500'}`}>
                                <WarningCircle size={20} className="flex-shrink-0 mt-0.5" />
                                <p className="text-xs font-bold leading-relaxed">{status.msg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !apiKey || !title || !message}
                            className="w-full bg-brand dark:bg-amber-500 text-white dark:text-black py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-brand/20 dark:shadow-amber-900/10 flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Spinner size={20} className="animate-spin" />
                                    MENGIRIM...
                                </>
                            ) : (
                                <>
                                    <PaperPlaneTilt size={20} weight="bold" />
                                    KIRIM BROADCAST
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-12 text-center space-y-2 opacity-30">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={14} />
                    Secured by Vercel Serverless
                </p>
                <p className="text-[9px] text-neutral-400">Penyalahgunaan akses dapat berakibat pada pembekuan Token PJ.</p>
            </div>
        </div>
    );
};

export default Admin;
