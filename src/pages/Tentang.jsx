import React from 'react';
import { Info, GithubLogo, InstagramLogo } from '@phosphor-icons/react';

const Tentang = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-brand rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-brand/20 rotate-3">
                    <span className="text-3xl font-bold text-white tracking-tighter">F.</span>
                </div>
                <p className="text-neutral-500 text-lg">Eksklusif untuk Keluarga Besar F.AGRIELLA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6 border-l-4 border-l-brand">
                    <h3 className="flex items-center gap-2 font-bold text-brand mb-4">
                        <Info size={24} weight="bold" />
                        Visi Project
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                        Menyediakan aksesibilitas data yang cepat dan terorganisir bagi mahasiswa Kelas F Agribisnis 2025 (F.AGRIELLA) Universitas Singaperbangsa Karawang.
                    </p>
                </div>

                <div className="card p-6 border-l-4 border-l-accent">
                    <h3 className="flex items-center gap-2 font-bold text-brand mb-4">
                        <InstagramLogo size={24} weight="bold" />
                        Hubungi Kami
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                        Punya saran atau materi tambahan? Hubungi pengembang melalui platform sosial media kami.
                    </p>
                </div>
            </div>

            <div className="text-center pt-8 border-t border-neutral-100">
                <p className="text-neutral-400 text-sm mb-6 uppercase tracking-widest font-bold">Built with Modern Tech</p>
                <div className="flex justify-center items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <img src="https://vitejs.dev/logo.svg" className="h-8" alt="Vite" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" className="h-8" alt="React" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" className="h-6" alt="Tailwind" />
                </div>
            </div>
        </div>
    );
};

export default Tentang;
