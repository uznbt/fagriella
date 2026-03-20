import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    HouseLine,
    UploadSimple,
    DiceFive,
    Images,
    AppStoreLogo,
    AndroidLogo,
    Cpu,
    Folders,
    Table,
    Code,
    BellRinging,
    CloudArrowUp,
    List,
    X,
    Warning
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';

const Dokumentasi = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImg, setLightboxImg] = useState({ src: '', alt: '' });

    const location = useLocation();
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Mulai',
            items: [
                { id: 'pengenalan', label: 'Pengenalan', icon: <HouseLine size={20} /> }
            ]
        },
        {
            title: 'Panduan Pengguna',
            items: [
                { id: 'user_upload', label: 'Upload Materi', icon: <UploadSimple size={20} /> },
                { id: 'user_spin', label: 'Spin Kelompok', icon: <DiceFive size={20} /> },
                { id: 'user_arsip_foto', label: 'Arsip Foto', icon: <Images size={20} /> }
            ]
        },
        {
            title: 'Aplikasi & PWA',
            items: [
                { id: 'pwa_install', label: 'Instalasi PWA', icon: <AppStoreLogo size={20} /> },
                { id: 'apk_android', label: 'APK Android', icon: <AndroidLogo size={20} /> }
            ]
        },
        {
            title: 'Teknis & Backend',
            items: [
                { id: 'arsitektur', label: 'Arsitektur Sistem', icon: <Cpu size={20} /> },
                { id: 'struktur_folder', label: 'Struktur Folder', icon: <Folders size={20} /> },
                { id: 'google_sheets', label: 'Google Sheets (DB)', icon: <Table size={20} /> },
                { id: 'apps_script', label: 'Apps Script (Server)', icon: <Code size={20} /> },
                { id: 'push_notif_deep', label: 'Push Notif (Deep)', icon: <BellRinging size={20} /> },
                { id: 'sync_token_deep', label: 'Sync & Token (Deep)', icon: <CloudArrowUp size={20} /> }
            ]
        }
    ];

    const currentId = location.hash.replace('#', '') || 'pengenalan';

    useEffect(() => {
        const handleToggle = () => setMobileMenuOpen(prev => !prev);
        window.addEventListener('toggle-docs-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-docs-sidebar', handleToggle);
    }, []);

    useEffect(() => {
        const fetchMarkdown = async () => {
            setLoading(true);
            setError(false);
            try {
                let response = await fetch(`/docs/contents/${currentId}.md?v=${Date.now()}`);
                let detectedBase = '/docs';

                // If the response is HTML (Vite/Vercel SPA fallback), try the /public/ path
                if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
                    const fallbackResponse = await fetch(`/public/docs/contents/${currentId}.md?v=${Date.now()}`);
                    if (fallbackResponse.ok && !fallbackResponse.headers.get('content-type')?.includes('text/html')) {
                        response = fallbackResponse;
                        detectedBase = '/public/docs';
                    }
                }

                if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
                    throw new Error('File not found');
                }
                const text = await response.text();

                const processedText = text.replace(/!\[(.*?)\]\(images\/(.*?)\)/g, `![$1](${detectedBase}/images/$2)`);

                const renderMarkdown = () => {
                    if (window.marked) {
                        try {
                            const html = typeof window.marked.parse === 'function'
                                ? window.marked.parse(processedText)
                                : window.marked(processedText);
                            setContent(html);

                            if (processedText.includes('```mermaid') && window.mermaid) {
                                setTimeout(() => {
                                    try {
                                        if (window.mermaid.run) window.mermaid.run();
                                        else if (window.mermaid.init) window.mermaid.init();
                                    } catch (e) { }
                                }, 500);
                            }
                        } catch (e) {
                            setContent("<p>Error parsing markdown.</p>");
                        }
                    } else {
                        setTimeout(renderMarkdown, 200);
                    }
                };

                renderMarkdown();
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkdown();
        window.scrollTo(0, 0);
    }, [currentId]);

    // Handle image clicks for Lightbox
    useEffect(() => {
        const handleImageClick = (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.markdown-content')) {
                setLightboxImg({ src: e.target.src, alt: e.target.alt });
                setLightboxOpen(true);
            }
        };

        document.addEventListener('click', handleImageClick);
        return () => document.removeEventListener('click', handleImageClick);
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-160px)] bg-white dark:bg-[#0b1311] rounded-3xl overflow-hidden border border-neutral-100 dark:border-white/5 shadow-none relative">
            {/* Sidebar with overlay for mobile */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            <aside className={`
                w-[80%] md:w-72 bg-neutral-50 dark:bg-black/20 border-r border-neutral-100 dark:border-white/5 overflow-y-auto
                fixed inset-y-0 left-0 z-[101] md:relative md:block
                transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 space-y-8 pb-32">
                    <div className="md:hidden flex items-center justify-between mb-2">
                        <span className="font-black text-brand dark:text-amber-400 uppercase text-xs tracking-widest">Buku Panduan</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white dark:bg-white/5 rounded-xl border border-neutral-200 dark:border-white/10">
                            <X size={20} />
                        </button>
                    </div>

                    {sections.map((section, idx) => (
                        <nav key={idx} className="space-y-3">
                            <p className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] px-3">{section.title}</p>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            navigate(`#${item.id}`);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold
                                            ${currentId === item.id
                                                ? 'bg-brand dark:bg-amber-500 text-white dark:text-brand shadow-lg shadow-brand/10 dark:shadow-amber-500/10'
                                                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'}
                                        `}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </nav>
                    ))}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-white dark:bg-transparent min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-brand/10 border-t-brand dark:border-amber-500/10 dark:border-t-amber-500 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                        <Warning size={48} className="text-red-500 opacity-50" />
                        <h2 className="text-xl font-black text-neutral-800 dark:text-white uppercase tracking-tight">Halaman Tidak Ditemukan</h2>
                        <button onClick={() => navigate('#pengenalan')} className="px-6 py-2.5 bg-brand dark:bg-amber-500 text-white dark:text-brand rounded-xl text-xs font-black uppercase tracking-widest">
                            Kembali
                        </button>
                    </div>
                ) : (
                    <article
                        className="markdown-content max-w-none text-left"
                        data-page={currentId}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X size={40} weight="bold" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={lightboxImg.src}
                            alt={lightboxImg.alt}
                            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <p className="absolute bottom-10 text-white/70 font-bold tracking-tight">{lightboxImg.alt}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dokumentasi;
