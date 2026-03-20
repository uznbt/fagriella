import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, CaretDown, Users, ArrowsOut, X, Folder, Star, BookmarkSimple } from '@phosphor-icons/react';
import { fetchAppData } from '../utils/api';
import { useSync } from '../contexts/SyncContext';

const normalizeString = (str) => {
    if (!str) return '';
    try {
        // Double decode and strip non-printable characters
        const decoded = decodeURIComponent(decodeURIComponent(str).replace(/\+/g, ' '));
        return decoded.toLowerCase()
            .trim()
            .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '') // Strip zero-width and directional marks
            .replace(/[\u2010-\u2015\u2212_-]/g, ' ')                      // Replace all dash-like characters with space
            .replace(/\s+/g, ' ');                                         // Collapse multiple spaces
    } catch (e) {
        try {
            const decoded = decodeURIComponent(str.replace(/\+/g, ' '));
            return decoded.toLowerCase()
                .trim()
                .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/[\u2010-\u2015\u2212_-]/g, ' ')
                .replace(/\s+/g, ' ');
        } catch (e2) {
            return str.toLowerCase()
                .trim()
                .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '')
                .replace(/[\u2010-\u2015\u2212_-]/g, ' ')
                .replace(/\s+/g, ' ');
        }
    }
};

const Home = () => {
    const { smtParam, courseName, materialName } = useParams();
    const id = useMemo(() => {
        if (!smtParam) return undefined;
        return smtParam.startsWith('smt=') ? smtParam.split('=')[1] : smtParam;
    }, [smtParam]);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [semester, setSemester] = useState(localStorage.getItem('last_semester') || '3');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { bookmarks, toggleBookmark } = useSync();

    // Derived state from URL (No sync lag)
    const selectedCourse = useMemo(() => {
        if (!data || !courseName) return null;

        const normUrl = normalizeString(courseName);
        const ultraUrl = normUrl.replace(/[^a-z0-9]/g, '');
        const currentSmt = String(id || semester || '3');

        // Layer 1: Best match by name
        const matches = data.courses.filter(c => normalizeString(c.name) === normUrl);
        if (matches.length === 1) return matches[0];
        if (matches.length > 1) {
            return matches.find(c => String(c.semester) === currentSmt) || matches[0];
        }

        // Layer 2: Ultra-fuzzy (alphanumeric only)
        const ultraNormalize = (s) => normalizeString(s).replace(/[^a-z0-9]/g, '');
        const ultraMatch = data.courses.find(c => ultraNormalize(c.name) === ultraUrl);
        return ultraMatch || null;
    }, [data, courseName, id, semester]);

    const previewFile = useMemo(() => {
        if (!data || !materialName || !selectedCourse) return null;
        const normalizedMaterialNameFromUrl = normalizeString(materialName);

        return data.materials.find(m =>
            m.course === selectedCourse.name &&
            normalizeString(m.filename) === normalizedMaterialNameFromUrl
        );
    }, [data, materialName, selectedCourse]);

    // Handle initial semester and data fetching
    useEffect(() => {
        const currentSmtFromUrl = id || localStorage.getItem('last_semester') || '3';
        if (semester !== currentSmtFromUrl) {
            setSemester(currentSmtFromUrl);
        }
        localStorage.setItem('last_semester', currentSmtFromUrl);

        fetchAppData()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setError("Gagal memuat data. Silakan periksa koneksi internet Anda.");
                setLoading(false);
            });
    }, [id]);

    const handleSemesterChange = (newSmt) => {
        setSemester(newSmt);
        localStorage.setItem('last_semester', newSmt);
        navigate(`/smt=${newSmt}`);
    };

    const handleSelectCourse = (course) => {
        if (!course) {
            navigate(`/smt=${semester}`);
        } else {
            navigate(`/smt=${semester}/${encodeURIComponent(course.name)}`);
        }
    };

    const handlePreviewFile = (file) => {
        if (!file) {
            navigate(`/smt=${semester}/${encodeURIComponent(selectedCourse.name)}`);
        } else {
            navigate(`/smt=${semester}/${encodeURIComponent(selectedCourse.name)}/${encodeURIComponent(file.filename)}`);
        }
    };

    const filteredCourses = data?.courses.filter(c => String(c.semester) === String(semester)) || [];
    const totalCourses = data?.courses.length || 0;
    const totalAssignments = data?.assignments.length || 0;

    return (
        <>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Hero / Stats Section - Mobile Friendly Overhaul */}
                <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
                    <div className="md:col-span-2 bg-brand rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-xl shadow-brand/10">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-outfit font-black mb-2 md:mb-4 tracking-tighter text-white">Selamat Datang!</h2>
                            <p className="text-white/80 max-w-lg text-sm md:text-lg leading-relaxed">Materi kuliah & arsip tugas angkatan dalam satu tempat.</p>
                            <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
                                <div className="bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex-1 border border-white/10">
                                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-60 mb-0.5 md:mb-1">Matkul</p>
                                    <p className="text-xl md:text-2xl font-bold font-outfit">{totalCourses}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex-1 border border-white/10">
                                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold opacity-60 mb-0.5 md:mb-1">Tugas</p>
                                    <p className="text-xl md:text-2xl font-bold font-outfit">{totalAssignments}</p>
                                </div>
                            </div>
                        </div>
                        {/* Compact abstract decorations */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    <div className="bg-white dark:bg-[#14231f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-neutral-100 dark:border-white/5 shadow-sm flex md:flex-col items-center md:justify-center text-left md:text-center gap-4 transition-colors duration-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 text-accent rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Users size={24} className="md:hidden" weight="duotone" />
                            <Users size={32} className="hidden md:block" weight="duotone" />
                        </div>
                        <div>
                            <h3 className="font-outfit font-bold text-lg md:text-xl text-neutral-800 dark:text-white uppercase">F.AGRIELLA 2025</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mt-0.5 md:mt-2">Agribisnis UNSIKA</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-neutral-100 dark:border-white/5">
                    <div>
                        <h2 className="text-2xl font-outfit font-bold text-neutral-800 dark:text-white">Kurikulum Materi</h2>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">Akses materi berdasarkan semester akademik.</p>
                    </div>

                    {/* Quick Access Favorit (Jika ada) */}
                    {bookmarks.length > 0 && !courseName && (
                        <div className="flex-1 max-w-md mx-auto md:mx-0">
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <Star size={20} weight="fill" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Favorit Anda</p>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate font-medium">{bookmarks.length} materi disimpan di cloud</p>
                                </div>
                                <button
                                    onClick={() => navigate('/pengaturan')}
                                    className="ml-auto text-amber-600 dark:text-amber-400 p-2 hover:bg-amber-500/10 rounded-lg transition-colors"
                                >
                                    <BookmarkSimple size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="relative inline-flex items-center w-full md:w-auto">
                        <select
                            value={semester}
                            onChange={(e) => handleSemesterChange(e.target.value)}
                            className="w-full appearance-none bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-6 py-3.5 pr-12 rounded-2xl text-brand dark:text-amber-400 font-black text-sm hover:border-brand/30 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none"
                        >
                            <option value="1">SEMESTER 1</option>
                            <option value="2">SEMESTER 2</option>
                            <option value="3">SEMESTER 3</option>
                        </select>
                        <div className="absolute right-4 pointer-events-none text-neutral-400 dark:text-neutral-500 leading-none">
                            <span className="text-xs font-black">▼</span>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-40 md:h-56 bg-neutral-200 dark:bg-white/5 rounded-2xl md:rounded-3xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {filteredCourses.map((course, idx) => (
                            <CourseCard
                                key={idx}
                                course={course}
                                onClick={() => handleSelectCourse(course)}
                            />
                        ))}
                        {filteredCourses.length === 0 && (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-3xl bg-neutral-50/50 dark:bg-white/5">
                                <BookOpen size={64} className="mx-auto text-neutral-200 dark:text-neutral-800 mb-4" />
                                <p className="text-neutral-400 dark:text-neutral-500 font-medium text-lg font-outfit">Belum ada data untuk semester ini.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Course Material Modal */}
            {selectedCourse && (
                <CourseModal
                    course={selectedCourse}
                    materials={data?.materials.filter(m => normalizeString(m.course) === normalizeString(selectedCourse.name)) || []}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    onClose={() => handleSelectCourse(null)}
                    onPreview={(file) => handlePreviewFile(file)}
                />
            )}

            {/* Material Preview Modal */}
            {previewFile && (
                <PreviewModal
                    file={previewFile}
                    onClose={() => handlePreviewFile(null)}
                />
            )}
        </>
    );
};

const CourseCard = ({ course, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white dark:bg-[#14231f] rounded-2xl md:rounded-3xl border border-neutral-100 dark:border-white/5 p-1.5 md:p-2 shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
    >
        <div className="aspect-[4/3] rounded-xl md:rounded-2xl bg-neutral-100 dark:bg-white/5 relative overflow-hidden mb-3 md:mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent mix-blend-multiply opacity-40"></div>
            <div className="absolute top-2 left-2 md:top-4 md:left-4 scale-75 md:scale-100 origin-top-left">
                <span className="px-2 py-0.5 bg-white/90 dark:bg-[#14231f]/90 rounded-full text-[8px] uppercase font-black text-[#fbbf24] tracking-widest shadow-sm">
                    Smt {course.semester}
                </span>
            </div>
        </div>
        <div className="px-2 md:px-4 pb-3 md:pb-4">
            <h3 className="font-outfit font-bold text-xs md:text-sm text-neutral-800 dark:text-white leading-tight line-clamp-2 min-h-[2.5rem]">
                {course.name}
            </h3>
            <div className="mt-3 flex items-center justify-between">
                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 truncate max-w-[60px] md:max-w-[100px]">{course.dosen || 'PIC'}</span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-400 group-hover:bg-brand group-hover:text-white transition-colors">
                    <BookOpen size={16} weight="duotone" className="md:hidden" />
                    <BookOpen size={20} weight="duotone" className="hidden md:block" />
                </div>
            </div>
        </div>
    </div>
);

const CourseModal = ({ course, materials, bookmarks, onToggleBookmark, onClose, onPreview }) => {
    return (
        <div className="fixed inset-0 z-[998] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xl" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#14231f] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border dark:border-white/5">
                {/* Modal Header */}
                <div className="p-8 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex w-12 h-12 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl items-center justify-center text-brand dark:text-amber-400">
                            <Folder size={24} weight="duotone" />
                        </div>
                        <div>
                            <h3 className="text-xl font-outfit font-black text-neutral-800 dark:text-white leading-tight">{course.name}</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest mt-1">Semester {course.semester} • {course.dosen || 'Dosen Pengampu'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-2xl transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                        <CaretDown size={24} weight="bold" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-white dark:bg-[#14231f]">
                    {materials.length > 0 ? (
                        materials.map((m, i) => {
                            const isBookmarked = bookmarks.find(b => b.link === m.link);
                            return (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between p-5 rounded-3xl border border-neutral-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-brand/30 dark:hover:border-amber-500/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300"
                                >
                                    <div
                                        className="flex items-center gap-4 flex-1 cursor-pointer"
                                        onClick={() => onPreview(m)}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-white/5 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:bg-brand/10 dark:group-hover:bg-amber-500/10 group-hover:text-brand dark:group-hover:text-amber-400 transition-colors">
                                            <div className="font-black text-[10px] uppercase">{m.type?.slice(0, 3) || 'FILE'}</div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-800 dark:text-white text-sm group-hover:text-brand dark:group-hover:text-amber-400 transition-colors line-clamp-1">{m.filename || 'Materi Kuliah'}</p>
                                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest mt-0.5">{m.size || 'Ketuk untuk Preview'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleBookmark(m);
                                            }}
                                            className={`p-3 rounded-2xl transition-all ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-neutral-50 dark:bg-white/5 text-neutral-300 dark:text-neutral-700 hover:text-amber-500'}`}
                                        >
                                            <Star size={18} weight={isBookmarked ? "fill" : "bold"} />
                                        </button>
                                        <div
                                            onClick={() => onPreview(m)}
                                            className="w-10 h-10 rounded-2xl bg-neutral-50 dark:bg-white/10 flex items-center justify-center text-neutral-300 dark:text-neutral-500 group-hover:bg-brand dark:group-hover:bg-amber-500 group-hover:text-white transition-all transform group-hover:translate-x-1 cursor-pointer"
                                        >
                                            <CaretDown size={18} weight="bold" className="-rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-neutral-100 dark:border-white/5 rounded-[2rem] bg-neutral-50/50 dark:bg-white/5">
                            <BookOpen size={48} className="mx-auto text-neutral-200 dark:text-neutral-800 mb-4" />
                            <p className="text-neutral-400 dark:text-neutral-500 font-bold text-sm uppercase tracking-widest">Belum ada materi tersedia</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-neutral-50/50 dark:bg-white/5 border-t border-neutral-100 dark:border-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 rounded-2xl font-bold text-sm hover:bg-neutral-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

const PreviewModal = ({ file, onClose }) => {
    const containerRef = React.useRef(null);
    const driveId = file.link?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || file.link?.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
    const previewUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : file.link;

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.webkitRequestFullscreen) {
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) {
                containerRef.current.msRequestFullscreen();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 backdrop-blur-2xl bg-white/0" onClick={onClose}></div>
            <div className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#14231f] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col border dark:border-white/5">
                <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand/10 dark:bg-amber-500/10 text-brand dark:text-amber-400 rounded-xl font-black text-[10px] uppercase">
                            Preview
                        </div>
                        <h3 className="font-outfit font-black text-neutral-800 dark:text-white truncate max-w-md">{file.filename || 'Pratinjau Materi'}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleFullscreen}
                            className="hidden md:flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-xl font-bold text-xs hover:bg-neutral-200 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                        >
                            <ArrowsOut size={16} weight="bold" />
                            FULLSCREEN
                        </button>
                        <a
                            href={file.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-brand dark:bg-amber-600 text-white rounded-xl font-bold text-xs hover:bg-brand-dark dark:hover:bg-amber-700 transition-all shadow-lg shadow-brand/20 dark:shadow-amber-900/40 active:scale-95 text-center"
                        >
                            BUKA ASLI
                        </a>
                        <button onClick={onClose} className="p-2.5 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors text-neutral-400 dark:text-neutral-500">
                            <X size={22} weight="bold" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-neutral-100 dark:bg-black/20 overflow-hidden relative" ref={containerRef}>
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-none"
                        title={file.nama}
                        allow="autoplay; fullscreen"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Home;
