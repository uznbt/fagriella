import React from 'react';
import { House, Images, DiceFive, UploadSimple, Plus, Gear, Sun, Moon, BookOpen, List } from '@phosphor-icons/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const MobileLayout = ({ children }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const getHeaderTitle = () => {
        const path = location.pathname;
        if (path === '/' || path.includes('/smt=')) return { yellow: 'F.', white: 'AGRIELLA' };
        if (path === '/arsipfoto') return { yellow: 'Arsip', white: 'Dokumentasi' };
        if (path === '/undi') return { yellow: 'Spin', white: 'Wheel' };
        if (path === '/upload') return { yellow: 'UP', white: 'LOAD' };
        if (path === '/pengaturan') return { yellow: 'Pe', white: 'ngaturan' };
        if (path === '/dokumentasi') return { yellow: 'Buku', white: 'Panduan' };
        return { yellow: 'F.', white: 'AGRIELLA' };
    };

    const title = getHeaderTitle();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0b1311] flex flex-col pb-20 transition-colors duration-200">
            {/* Substantial Top Navbar - Green */}
            <header className="h-16 bg-[#1e3932] border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                    {location.pathname === '/dokumentasi' && (
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('toggle-docs-sidebar'))}
                            className="p-2 -ml-2 text-white/80 hover:bg-white/10 rounded-xl transition-colors active:scale-90"
                        >
                            <List size={24} weight="bold" />
                        </button>
                    )}
                    <span className="text-2xl font-black tracking-tight font-outfit">
                        <span className="text-[#fbbf24]">{title.yellow}</span>
                        <span className="text-white">{title.white}</span>
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {location.pathname !== '/dokumentasi' && (
                        <button
                            onClick={() => navigate('/dokumentasi')}
                            className="p-2.5 bg-white/5 text-white rounded-2xl transition-all active:scale-90"
                            title="Buku Panduan"
                        >
                            <BookOpen size={22} weight="bold" />
                        </button>
                    )}
                    <button
                        onClick={(e) => toggleTheme(e)}
                        className="p-2.5 bg-white/5 text-white rounded-2xl transition-all active:scale-90 overflow-hidden"
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
                                    <Sun size={22} weight="fill" className="text-yellow-400" />
                                ) : (
                                    <Moon size={22} weight="bold" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-5">
                {children}
            </main>

            {/* Substantial Bottom Navigation Bar - Deep Green - Sits at Bottom */}
            <div className="fixed bottom-0 left-0 w-full h-20 bg-[#2a4d44] border-t border-white/10 rounded-t-3xl grid grid-cols-5 items-center px-1 z-40 transition-all duration-200">
                <div className="flex justify-center relative -top-1">
                    <MobileNavItem to="/" icon={<House size={20} weight="bold" />} label="Home" />
                </div>
                <div className="flex justify-center relative -top-1">
                    <MobileNavItem to="/arsipfoto" icon={<Images size={20} weight="bold" />} label="Foto" />
                </div>

                <div className="flex justify-center relative -top-6">
                    <MobileNavItem
                        to="/upload"
                        icon={<Plus size={24} weight="bold" />}
                        label="Upload"
                        customActiveBg="bg-gradient-to-br from-[#1e3932] to-[#fbbf24]"
                        persistentShape={true}
                        customLabelClass="mt-4"
                    />
                </div>

                <div className="flex justify-center relative -top-1">
                    <MobileNavItem to="/undi" icon={<DiceFive size={20} weight="bold" />} label="Spin" />
                </div>
                <div className="flex justify-center relative -top-1">
                    <MobileNavItem to="/pengaturan" icon={<Gear size={20} weight="bold" />} label="Opsi" />
                </div>
            </div>
        </div>
    );
};

const MobileNavItem = ({ to, icon, label, customActiveBg, persistentShape, customLabelClass }) => (
    <NavLink
        to={to}
        className={({ isActive }) => {
            const isHomeActive = to === "/" && (isActive || window.location.pathname.includes("/smt="));
            const active = to === "/" ? isHomeActive : isActive;
            return `
                flex flex-col items-center gap-1 transition-colors duration-200
                ${active ? 'text-[#fbbf24] font-black' : 'text-white'}
            `;
        }}
    >
        {({ isActive }) => {
            const isHomeActive = to === "/" && (isActive || window.location.pathname.includes("/smt="));
            const active = to === "/" ? isHomeActive : isActive;
            return (
                <>
                    <div className={`${persistentShape ? 'w-14 h-14 ring-4 ring-white/40' : 'w-12 h-12'} flex items-center justify-center rounded-full ${active
                        ? (customActiveBg || 'bg-[#fbbf24]') + ' text-[#1e3932]' + (persistentShape ? ' ring-4 ring-white/60' : '')
                        : persistentShape
                            ? (customActiveBg + ' text-white opacity-100')
                            : 'text-white/40'
                        }`}>
                        {React.cloneElement(icon, { size: persistentShape ? 28 : 24 })}
                    </div>
                    <span className={`text-[7px] font-black uppercase tracking-wider ${customLabelClass || ''} ${(active || persistentShape) ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
                </>
            );
        }}
    </NavLink>
);

export default MobileLayout;
