import { House, Images, DiceFive, UploadSimple, Gear, Info, Sun, Moon, BookOpen } from '@phosphor-icons/react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const DesktopLayout = ({ children }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    const getHeaderTitle = () => {
        const path = location.pathname;
        if (path === '/' || path.includes('/smt=')) return { yellow: 'Dashboard', white: 'F.AGRIELLA' };
        if (path === '/arsipfoto') return { yellow: 'Arsip', white: 'Dokumentasi' };
        if (path === '/undi') return { yellow: 'Spin', white: 'Wheel' };
        if (path === '/upload') return { yellow: 'Upload', white: 'Materi' };
        if (path === '/pengaturan') return { yellow: 'Penga', white: 'turan' };
        if (path === '/tentang') return { yellow: 'Tentang', white: 'Project' };
        return { yellow: 'F.', white: 'AGRIELLA' };
    };

    const title = getHeaderTitle();

    return (
        <div className="flex min-h-screen bg-neutral-50 dark:bg-[#0b1311] transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2a4d44] border-r border-white/10 flex flex-col sticky top-0 h-screen shadow-2xl transition-colors duration-300">
                <div className="p-8 pb-4">
                    <NavLink to="/" className="text-3xl font-black tracking-tight font-outfit uppercase">
                        <span className="text-[#fbbf24]">F.</span>
                        <span className="text-white">AGRIELLA</span>
                    </NavLink>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    <NavItem to="/" icon={<House size={22} />} label="Beranda" />
                    <NavItem to="/arsipfoto" icon={<Images size={22} />} label="Arsip Foto" />
                    <NavItem to="/undi" icon={<DiceFive size={22} />} label="Spin" />
                    <NavItem to="/upload" icon={<UploadSimple size={22} />} label="Upload Materi" />
                    <NavItem to="/pengaturan" icon={<Gear size={22} />} label="Pengaturan" />
                    <NavItem to="/dokumentasi" icon={<BookOpen size={22} />} label="Buku Panduan" />
                    <NavItem to="/tentang" icon={<Info size={22} />} label="Tentang" />
                </nav>

                <div className="p-4">
                    <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#fbbf24]/5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-[#fbbf24]/10 transition-all"></div>
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-[10px] font-black text-[#fbbf24] uppercase tracking-[0.2em] opacity-80">AKTIF</span>
                            </div>
                            <p className="text-sm font-black text-white tracking-tight leading-none uppercase">Smt 3 • Agribisnis</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar Header */}
                <header className="h-16 bg-white/80 dark:bg-[#0b1311]/80 backdrop-blur-md border-b border-neutral-100 dark:border-white/5 sticky top-0 z-30 flex items-center justify-between px-8 transition-colors duration-300">
                    <h1 className="text-xl font-outfit font-black tracking-tight uppercase">
                        <span className="text-brand dark:text-amber-400">{title.yellow}</span>
                        <span className="text-neutral-800 dark:text-white ml-2">{title.white}</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari materi..."
                                className="pl-10 pr-4 py-2 bg-neutral-100 dark:bg-white/5 border-none rounded-full text-sm focus:ring-2 focus:ring-amber-500/30 transition-all w-64 dark:text-white"
                            />
                            <i className="ph ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-amber-400/50"></i>
                        </div>
                        <button
                            onClick={(e) => toggleTheme(e)}
                            className="p-2.5 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-full transition-all hover:bg-neutral-200 dark:hover:bg-white/10 active:scale-95 shadow-sm overflow-hidden"
                            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isDarkMode ? 'sun' : 'moon'}
                                    initial={{ y: 20, rotate: 90, opacity: 0 }}
                                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                                    exit={{ y: -20, rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'backOut' }}
                                >
                                    {isDarkMode ? (
                                        <Sun size={20} weight="fill" className="text-yellow-400" />
                                    ) : (
                                        <Moon size={20} weight="fill" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-colors text-neutral-600 dark:text-neutral-400">
                            <Gear size={22} />
                        </button>
                    </div>
                </header>

                <main className="p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => {
            // For Beranda (to="/"), it should be active if we're at root OR on any /smt=... route
            const isHomeActive = to === "/" && (isActive || window.location.pathname.includes("/smt="));
            const active = to === "/" ? isHomeActive : isActive;

            return `
                flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-500 font-black text-sm
                ${active
                    ? 'bg-[#1e3932] text-[#fbbf24] shadow-xl shadow-black/20 scale-[1.05]'
                    : 'text-white hover:bg-white/10'}
            `;
        }}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default DesktopLayout;
