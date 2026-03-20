import React from 'react';
import { Book, Info, CheckCircle, Warning } from '@phosphor-icons/react';

const PanduanUpload = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 py-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="border-b border-neutral-100 pb-8">
                <h2 className="text-4xl font-outfit font-bold text-brand">Panduan Upload Materi</h2>
                <p className="text-neutral-500 mt-2">Ikuti langkah-langkah berikut untuk berkontribusi pada arsip digital angkatan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center font-bold">1</div>
                        <h3 className="font-outfit font-bold text-xl text-neutral-800">Persiapan File</h3>
                    </div>
                    <div className="card p-6 bg-neutral-50/50 border-dashed border-2">
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Pastikan file dalam format PDF, DOCX, atau PPTX.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Beri nama file yang jelas (Contoh: "Materi_Mikro_Pekan1.pdf").</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Maksimum ukuran file adalah 10MB per unggahan.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center font-bold">2</div>
                        <h3 className="font-outfit font-bold text-xl text-neutral-800">Proses Unggah</h3>
                    </div>
                    <div className="card p-6 bg-neutral-50/50 border-dashed border-2">
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Buka halaman <strong>Upload</strong> melalui menu sidebar atau bottom nav.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Pilih mata kuliah yang relevan dari daftar drop-down.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle size={20} className="text-brand shrink-0" weight="fill" />
                                <span className="text-sm text-neutral-600">Klik tombol submit dan tunggu konfirmasi sinkronisasi.</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <div className="bg-amber-50 rounded-3xl p-8 flex items-start gap-4 border border-amber-100 shadow-sm shadow-amber-900/5">
                <Warning size={32} weight="duotone" className="text-amber-600 shrink-0" />
                <div>
                    <h4 className="font-outfit font-bold text-amber-900 mb-1 text-lg">Catatan Penting</h4>
                    <p className="text-amber-800/80 text-sm leading-relaxed">
                        Data yang Anda unggah akan melalui proses moderasi otomatis sebelum tampil di daftar mata kuliah.
                        Hindari mengunggah file yang mengandung unsur SARA, pornografi, atau konten yang merugikan pihak lain.
                    </p>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button className="px-8 py-3 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Book size={20} weight="bold" />
                    Buka Panduan Lengkap
                </button>
            </div>
        </div>
    );
};

export default PanduanUpload;
