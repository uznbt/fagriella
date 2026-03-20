import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { DiceFive, ArrowsCounterClockwise, Users, ListNumbers, Trash, Play, CheckCircle } from '@phosphor-icons/react';

const Undi = () => {
    const [names, setNames] = useState('');
    const [mode, setMode] = useState('kelompok'); // 'kelompok' or 'urutan'
    const [count, setCount] = useState(5);
    const [isSpinning, setIsSpinning] = useState(false);
    const [results, setResults] = useState([]);
    const [isSharedView, setIsSharedView] = useState(false);

    // Session State
    const [session, setSession] = useState({
        active: false,
        remaining: [],
        history: [],
        currentWinner: null
    });

    const controls = useAnimation();
    const wheelRef = useRef(null);
    const [rotation, setRotation] = useState(0);

    // Parse URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('r');
        const m = params.get('m');

        if (r && m) {
            try {
                const decoded = atob(r);
                let finalResults = [];
                if (m === 'kelompok') {
                    finalResults = decoded.split('|').map(g => g.split(',').filter(n => n));
                } else {
                    finalResults = decoded.split(',').filter(n => n);
                }

                setResults(finalResults);
                setMode(m);
                setIsSharedView(true);
                setSession({
                    active: true,
                    remaining: [],
                    history: finalResults.flat(),
                    currentWinner: null
                });
            } catch (e) {
                console.error("Gagal memuat hasil berbagi:", e);
            }
        }
    }, []);

    // Initialize or Reset Session
    const startNewSession = () => {
        const list = names.split('\n').map(n => n.trim()).filter(n => n !== '');
        if (list.length === 0) return alert('Masukkan daftar nama terlebih dahulu!');

        setSession({
            active: true,
            remaining: [...list],
            history: [],
            currentWinner: null
        });
        setResults([]);
        setIsSharedView(false);
    };

    const resetSession = () => {
        if (window.confirm('Reset semua hasil dan mulai dari awal?')) {
            setSession({ active: false, remaining: [], history: [], currentWinner: null });
            setResults([]);
            setRotation(0);
            setIsSharedView(false);
            // Clear URL params
            window.history.replaceState({}, '', window.location.pathname);
        }
    };

    const handleSpin = async () => {
        if (!session.active) return startNewSession();
        if (session.remaining.length === 0) return alert('Semua nama sudah diundi!');

        setIsSpinning(true);

        // ... (rotation calculation remains same)
        const extraRounds = 5 + Math.floor(Math.random() * 5);
        const finalAngle = Math.floor(Math.random() * 360);
        const totalRotation = rotation + (extraRounds * 360) + finalAngle;

        await controls.start({
            rotate: totalRotation,
            transition: { duration: 4, ease: [0.15, 0, 0.15, 1] }
        });

        setRotation(totalRotation);

        // Selection Logic
        const randomIndex = Math.floor(Math.random() * session.remaining.length);
        const winner = session.remaining[randomIndex];
        const newRemaining = session.remaining.filter((_, i) => i !== randomIndex);

        if (mode === 'kelompok') {
            const newResults = [...results];
            if (newResults.length < count) {
                for (let i = 0; i < count; i++) if (!newResults[i]) newResults[i] = [];
            }
            newResults[session.history.length % count].push(winner);
            setResults(newResults);
        } else {
            setResults(prev => [...prev, winner]);
        }

        setSession(prev => ({
            ...prev,
            remaining: newRemaining,
            history: [...prev.history, winner],
            currentWinner: winner
        }));

        setIsSpinning(false);
    };

    const [isLogging, setIsLogging] = useState(false);

    const getShareData = (rowId = null) => {
        let text = `🎰 *HASIL PENGUNDIAN F.AGRIELLA*\n`;
        text += `--------------------------------\n`;
        if (mode === 'kelompok') {
            results.forEach((group, i) => { text += `👥 *Kelompok ${i + 1}*: ${group.join(', ')}\n`; });
        } else {
            results.forEach((n, i) => { text += `${i + 1}. ${n}\n`; });
        }

        const link = rowId
            ? `${window.location.origin}/undi/r/${rowId}`
            : `${window.location.origin}/undi?m=${mode}&r=${btoa(mode === 'kelompok' ? results.map(g => g.join(',')).join('|') : results.join(','))}`;

        return { text, link, full: `${text}\n🔗 *Bukti Digital:*\n${link}\n\n_Dibuat dengan fagriella.vercel.app_` };
    };

    const logToSheets = async (fullText) => {
        setIsLogging(true);
        const groupData = mode === 'kelompok'
            ? results.map((g, i) => `Kelompok ${i + 1}: ${g.join(', ')}`)
            : [results.join(', ')];

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzhZkLgXDqLVi80_NY7cbIx8UwZVBONgvwBnJIik4EqHfThHq2iU0EuPGzlBxa-OQpd/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'payload=' + encodeURIComponent(JSON.stringify({
                    action: 'logSpin',
                    mode: mode,
                    groupData: groupData,
                    fullText: fullText,
                    timestamp: new Date().toISOString()
                }))
            });
            const res = await response.json();
            return res.row || null;
        } catch (e) {
            console.error("Logging failed:", e);
            return null;
        } finally {
            setIsLogging(false);
        }
    };

    const handleCopyLink = async () => {
        if (results.length === 0 || isLogging) return;
        const rowId = await logToSheets("Initial Log");
        const { link } = getShareData(rowId);
        try {
            await navigator.clipboard.writeText(link);
            alert('Link bukti digital berhasil disalin!');
        } catch (err) { console.error(err); }
    };

    const handleWhatsAppShare = async () => {
        if (results.length === 0 || isLogging) return;
        const rowId = await logToSheets("WhatsApp Share Log");
        const { full } = getShareData(rowId);
        window.open(`https://wa.me/?text=${encodeURIComponent(full)}`, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-4 overflow-hidden">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 dark:bg-amber-500/10 text-brand dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-brand/5">
                        <DiceFive size={14} weight="fill" />
                        <span>Interactive Randomizer</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Acak kelompok atau urutan presentasi dengan sensasi kasino.</p>
                </div>

                <div className="flex bg-neutral-100 dark:bg-white/5 p-1.5 rounded-2xl border dark:border-white/5 w-full md:w-auto">
                    <button
                        onClick={() => !session.active && setMode('kelompok')}
                        disabled={session.active}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${mode === 'kelompok' ? 'bg-white dark:bg-brand text-brand dark:text-white border border-brand/10 dark:border-white/10' : 'text-neutral-400 opacity-50'}`}
                    >
                        <Users size={20} weight="bold" /> KELOMPOK
                    </button>
                    <button
                        onClick={() => !session.active && setMode('urutan')}
                        disabled={session.active}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${mode === 'urutan' ? 'bg-white dark:bg-brand text-brand dark:text-white border border-brand/10 dark:border-white/10' : 'text-neutral-400 opacity-50'}`}
                    >
                        <ListNumbers size={20} weight="bold" /> URUTAN
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Panel: Input & Controls (4 cols) */}
                <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                    {isSharedView && (
                        <div className="card p-6 bg-brand/10 border-brand/20 dark:bg-amber-500/10 dark:border-amber-500/20 animate-in zoom-in-95">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle size={28} weight="fill" className="text-brand dark:text-amber-400" />
                                <div>
                                    <h4 className="text-sm font-black text-brand dark:text-amber-400">HASIL BERBAGI</h4>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Ini adalah hasil resmi yang dibagikan</p>
                                </div>
                            </div>
                            <button
                                onClick={resetSession}
                                className="w-full py-3 bg-brand dark:bg-amber-500 text-white dark:text-[#1e3932] rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
                            >
                                Mulai Spin Baru
                            </button>
                        </div>
                    )}

                    <div className={`card p-8 bg-white dark:bg-[#14231f] border-neutral-100 dark:border-white/5 relative overflow-hidden group ${isSharedView ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 dark:bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                        <div className="relative space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex justify-between">
                                    <span>List Nama Mahasiswa</span>
                                    <span className={session.active ? 'text-amber-500 animate-pulse' : ''}>
                                        {session.active ? 'Sesi Aktif' : 'Mode Edit'}
                                    </span>
                                </label>
                                <textarea
                                    value={names}
                                    onChange={(e) => setNames(e.target.value)}
                                    disabled={session.active}
                                    className="w-full h-72 bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-white/10 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-brand/10 outline-none transition-all resize-none dark:text-white disabled:opacity-50 tracking-tight"
                                    placeholder="Masukkan nama...&#10;Contoh:&#10;Andi&#10;Budi&#10;Caca"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                                    {mode === 'kelompok' ? 'Tentukan Jumlah Kelompok' : 'Sample Size'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        value={count}
                                        onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        disabled={session.active}
                                        className="w-full bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-white/10 rounded-2xl px-6 py-4 font-black text-xl text-brand dark:text-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none disabled:opacity-50"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30 uppercase">Set</div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleSpin}
                                    disabled={isSpinning || (session.active && session.remaining.length === 0)}
                                    className="w-full py-5 bg-brand dark:bg-amber-500 text-white dark:text-[#1e3932] rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isSpinning ? <ArrowsCounterClockwise className="animate-spin" size={28} weight="bold" /> : <Play size={28} weight="fill" />}
                                    {session.active ? 'LANJUT ACAK' : 'MULAI SESI'}
                                </button>

                                {session.active && (
                                    <button
                                        onClick={resetSession}
                                        className="w-full py-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all border border-red-100 dark:border-red-500/20"
                                    >
                                        <Trash size={18} weight="bold" /> RESET SESI
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: The Wheel (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-start gap-12 py-12 order-1 lg:order-2 lg:sticky lg:top-24">
                    <div className="relative group">
                        {/* Needle/Pointer */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                            <div className="w-8 h-10 bg-red-600 clip-path-triangle flex items-end justify-center pb-1 shadow-md">
                                <div className="w-2 h-2 bg-white/40 rounded-full mb-4"></div>
                            </div>
                        </div>

                        {/* Outer Glow - Removed for performance */}

                        {/* The Wheel */}
                        <motion.div
                            animate={controls}
                            className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[10px] border-[#2a4d44] dark:border-[#14231f] relative overflow-hidden flex items-center justify-center bg-white dark:bg-[#0b1311]"
                            style={{
                                background: `conic-gradient(
                                    #1e3932 0deg 45deg, 
                                    #fbbf24 45deg 90deg, 
                                    #2a4d44 90deg 135deg, 
                                    #f59e0b 135deg 180deg,
                                    #1e3932 180deg 225deg,
                                    #fbbf24 225deg 270deg,
                                    #2a4d44 270deg 315deg,
                                    #f59e0b 315deg 360deg
                                )`
                            }}
                        >
                            {/* Decorative Middle Hub */}
                            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                            <div className="absolute inset-4 rounded-full border border-dashed border-white/20 z-10 pointer-events-none"></div>
                            <div className="w-16 h-16 rounded-full bg-[#1e3932] border-4 border-[#2a4d44] dark:border-[#14231f] z-20 shadow-none flex items-center justify-center">
                                <DiceFive size={32} weight="fill" className="text-amber-500 animate-pulse" />
                            </div>

                            {/* Wheel Dividers */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-[2px] h-full bg-white/10 origin-top"
                                    style={{ transform: `translate(-50%, -50%) rotate(${i * 45}deg)` }}
                                ></div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Action Confirmation / Winner Display */}
                    <AnimatePresence mode="wait">
                        {session.currentWinner && !isSpinning && (
                            <motion.div
                                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -20, opacity: 0, scale: 0.9 }}
                                className="text-center space-y-4"
                            >
                                <div className="text-neutral-400 text-xs font-black uppercase tracking-[0.3em]">Hore! Selamat Kepada</div>
                                <div className="text-4xl md:text-5xl font-black text-brand dark:text-amber-400 font-outfit uppercase tracking-tighter">
                                    "{session.currentWinner}"
                                </div>
                                <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm">
                                    <CheckCircle size={20} weight="fill" />
                                    <span>Tersimpan di {mode === 'kelompok' ? 'Grup' : 'Urutan'}</span>
                                </div>
                            </motion.div>
                        )}
                        {!session.active && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-neutral-400 text-sm italic font-medium">
                                Masukkan nama dan tekan "Mulai Sesi" untuk memutar roda!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Panel: Live Results (3 cols) */}
                <div className="lg:col-span-3 space-y-6 order-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-black text-brand dark:text-white uppercase tracking-wider">Live Results</h3>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-brand text-white rounded-full">
                            {session.history.length} DRAWN
                        </span>
                    </div>

                    {results.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={handleCopyLink}
                                disabled={isLogging}
                                className="flex-1 py-3 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 border dark:border-white/10 hover:bg-neutral-200 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
                            >
                                {isLogging ? <SpinnerGap size={16} className="animate-spin" /> : <Link size={16} weight="bold" />}
                                SALIN LINK BUKTI
                            </button>
                            <button
                                onClick={handleWhatsAppShare}
                                disabled={isLogging}
                                className="px-4 py-3 bg-green-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-green-500/20 disabled:opacity-50"
                            >
                                {isLogging ? <SpinnerGap size={20} className="animate-spin" /> : <WhatsappLogo size={20} weight="fill" />}
                            </button>
                        </div>
                    )}

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {results.length === 0 && (
                            <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-3xl opacity-40">
                                <DiceFive size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-bold uppercase tracking-widest">Belum Ada Hasil</p>
                            </div>
                        )}

                        {mode === 'kelompok' ? (
                            <div className="space-y-4">
                                {results.map((group, i) => (
                                    <div key={i} className="card p-5 bg-white dark:bg-[#14231f] border-neutral-100 dark:border-white/5 shadow-sm rounded-2xl animate-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black text-brand dark:text-amber-400 uppercase tracking-widest">Kelompok {i + 1}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand/20 dark:bg-amber-400/20"></div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {group.map((n, j) => (
                                                <span key={j} className="px-3 py-1 bg-neutral-50 dark:bg-white/5 rounded-lg text-xs font-bold dark:text-white border dark:border-white/5">
                                                    {n}
                                                </span>
                                            ))}
                                            {group.length === 0 && <span className="text-xs italic text-neutral-300 uppercase font-bold tracking-tighter">Waiting...</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                {results.map((n, i) => (
                                    <div key={i} className="flex items-center gap-2 p-3 bg-white dark:bg-[#14231f] border border-neutral-100 dark:border-white/5 rounded-2xl shadow-sm animate-in zoom-in-95">
                                        <div className="w-6 h-6 flex-shrink-0 bg-brand/5 dark:bg-amber-400/10 text-brand dark:text-amber-400 rounded-lg flex items-center justify-center text-[10px] font-black border border-brand/10">
                                            {i + 1}
                                        </div>
                                        <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-200 uppercase tracking-tight truncate">{n}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Global Styles for Triangle Pointer */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .clip-path-triangle {
                    clip-path: polygon(50% 100%, 0 0, 100% 0);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(30, 57, 50, 0.1);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}} />
        </div>
    );
};

export default Undi;
