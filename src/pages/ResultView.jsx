import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RESULT_SPIN_SHEET_URL } from '../config';
import { parseCSV } from '../utils/api';
import { DiceFive, CheckCircle, Calendar, ArrowLeft, SpinnerGap } from '@phosphor-icons/react';

const ResultView = () => {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                // Fetch all results (CSV)
                const response = await fetch(`${RESULT_SPIN_SHEET_URL}&t=${Date.now()}`);
                if (!response.ok) throw new Error('Gagal memuat database hasil.');

                const csvText = await response.text();
                const allData = parseCSV(csvText);

                // User ID is row_number - 1 (Example: /r/1 is row 2)
                // In our parseCSV, objects are indexed 0, 1, 2...
                // If row 1 is header, row 2 is allData[0].
                // So /r/1 matches allData[0].
                const targetIndex = parseInt(id) - 1;

                if (targetIndex >= 0 && targetIndex < allData.length) {
                    const row = allData[targetIndex];

                    // Format the results for display
                    // The sheet format is: Timestamp | Action | Mode | G1 | G2 | ...
                    // Let's identify the group columns (usually start with "Kelompok")
                    const groups = Object.keys(row)
                        .filter(key => key.toLowerCase().includes('kelompok'))
                        .map(key => ({
                            name: key,
                            members: row[key].replace(/^Kelompok \d+: /i, '')
                        }))
                        .filter(g => g.members && g.members.trim() !== '');

                    setResult({
                        timestamp: row['Timestamp'] || row['Date'] || 'Unknown Date',
                        mode: row['Mode'] || 'Custom',
                        groups: groups
                    });
                } else {
                    setError('Hasil tidak ditemukan atau ID tidak valid.');
                }
            } catch (err) {
                console.error(err);
                setError('Terjadi kesalahan saat memuat bukti digital.');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <SpinnerGap size={48} className="animate-spin text-brand dark:text-amber-400" />
            <p className="text-sm font-black text-neutral-400 uppercase tracking-widest">Memvalidasi Bukti Digital...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <DiceFive size={40} />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tight">Oops! {error}</h2>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">Pastikan link yang Anda gunakan sudah benar atau coba muat ulang halaman.</p>
            </div>
            <Link to="/undi" className="px-8 py-3 bg-brand dark:bg-amber-500 text-white dark:text-[#1e3932] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                Kembali ke Spin
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-4 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-green-500/10">
                        <CheckCircle size={14} weight="fill" />
                        <span>Verified Digital Proof</span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 font-medium">Data pengundian resmi yang tercatat di sistem F.AGRIELLA.</p>
                </div>

                <Link to="/undi" className="inline-flex items-center gap-2 text-xs font-black text-neutral-400 hover:text-brand dark:hover:text-amber-400 transition-colors uppercase tracking-widest">
                    <ArrowLeft size={16} weight="bold" />
                    <span>Kembali</span>
                </Link>
            </div>

            <div className="card p-8 bg-white dark:bg-[#14231f] border-neutral-100 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand/5 dark:bg-white/5 rounded-bl-full -mr-24 -mt-24"></div>

                <div className="relative space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-50 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand dark:bg-amber-500 rounded-2xl flex items-center justify-center text-white dark:text-[#1e3932] shadow-lg shadow-brand/20">
                                <DiceFive size={24} weight="fill" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black text-brand dark:text-white uppercase tracking-tight">Hasil Pengundian #{id}</h1>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase">
                                    <Calendar size={12} weight="bold" />
                                    <span>{result.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.groups.map((group, i) => (
                            <div key={i} className="p-6 bg-neutral-50 dark:bg-black/20 rounded-3xl border border-neutral-100 dark:border-white/10 group-hover:border-brand/20 dark:group-hover:border-amber-500/20 transition-all">
                                <h3 className="text-xs font-black text-brand dark:text-amber-400 uppercase tracking-widest mb-3">{group.name}</h3>
                                <div className="space-y-1">
                                    {group.members.split(',').map((member, idx) => (
                                        <p key={idx} className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                                            {idx + 1}. {member.trim()}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] opacity-50">Sistem Pengundian Akademik F.AGRIELLA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultView;
