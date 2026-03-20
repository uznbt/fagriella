import React, { useState, useEffect } from 'react';
import { fetchAppData } from '../utils/api';
import { Images, FolderOpen, ArrowLeft, Camera, Image as ImageIcon, Play } from '@phosphor-icons/react';

const ArsipFoto = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState({ type: 'main', id: null, subtitle: '' }); // type: 'main', 'semester', 'album'
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        fetchAppData().then(res => {
            setData(res);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square bg-neutral-200 animate-pulse rounded-3xl"></div>)}
        </div>
    );

    // Logic grouping (simplified version of legacy logic)
    const photos = data?.materials.filter(m => ['image', 'jpg', 'png', 'jpeg', 'mp4', 'video'].includes(m.type?.toLowerCase())) || [];
    const extraPhotos = data?.arsipFoto || [];

    const semesterGroups = {}; // { '1': { 'Matkul A': [...] } }
    const generalAlbums = {};  // { 'Album X': [...] }

    // 1. Process Materials (Semester-based)
    photos.forEach(m => {
        const courseName = m.course || 'Lain-lain';
        const relatedCourse = data?.courses.find(c => c.name === courseName);
        const sem = relatedCourse?.semester || 'Lain-lain';

        if (!semesterGroups[sem]) semesterGroups[sem] = {};
        if (!semesterGroups[sem][courseName]) semesterGroups[sem][courseName] = [];
        semesterGroups[sem][courseName].push(m);
    });

    // 2. Process Arsip Foto (Direct Albums)
    extraPhotos.forEach(m => {
        const albumName = m.album || 'Umum';
        if (!generalAlbums[albumName]) generalAlbums[albumName] = [];
        generalAlbums[albumName].push(m);
    });

    const semesters = Object.keys(semesterGroups).filter(s => s !== 'Lain-lain').sort();
    const generalAlbumKeys = Object.keys(generalAlbums).sort();

    // Navigation back
    const goBack = () => {
        if (view.type === 'album') {
            setView(prev => prev.parent ? { type: 'semester', id: prev.parent, subtitle: `Semester ${prev.parent}` } : { type: 'main' });
        } else {
            setView({ type: 'main' });
        }
    };

    const getPhotoSrc = (link) => {
        if (!link) return '';
        const driveId = link.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || link.match(/id=([a-zA-Z0-9_-]+)/)?.[1];
        return driveId ? `https://drive.google.com/uc?export=view&id=${driveId}` : link;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    {view.type !== 'main' && (
                        <button onClick={goBack} className="p-3 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/10 transition-all active:scale-90 shadow-sm">
                            <ArrowLeft size={20} weight="bold" className="text-brand dark:text-brand-light" />
                        </button>
                    )}
                    <div>
                        <p className="text-neutral-500 text-base">{view.subtitle || 'Kumpulan kenangan dan dokumentasi angkatan.'}</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-2xl font-bold text-xs">
                    <Camera size={18} weight="duotone" />
                    <span>{photos.length + extraPhotos.length} FOTO TERSIMPAN</span>
                </div>
            </div>

            {/* Content Rendering */}
            {view.type === 'main' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* Semester Folders */}
                    {semesters.map(sem => {
                        const firstAlbum = Object.keys(semesterGroups[sem])[0];
                        const firstPhoto = semesterGroups[sem][firstAlbum]?.[0];
                        return (
                            <AlbumFolder
                                key={sem}
                                title={`Semester ${sem}`}
                                count={`${Object.keys(semesterGroups[sem]).length} Album`}
                                cover={firstPhoto ? getPhotoSrc(firstPhoto.link) : null}
                                icon={<FolderOpen size={32} weight="duotone" />}
                                onClick={() => setView({ type: 'semester', id: sem, subtitle: `Semester ${sem}` })}
                            />
                        );
                    })}
                    {/* General Albums */}
                    {generalAlbumKeys.map(album => {
                        const firstPhoto = generalAlbums[album]?.[0];
                        return (
                            <AlbumFolder
                                key={album}
                                title={album}
                                count={`${generalAlbums[album].length} Foto`}
                                cover={firstPhoto ? getPhotoSrc(firstPhoto.link) : null}
                                icon={<ImageIcon size={32} weight="duotone" />}
                                onClick={() => setView({ type: 'album', id: album, subtitle: 'Album Dokumentasi' })}
                            />
                        );
                    })}
                </div>
            )}

            {view.type === 'semester' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Object.keys(semesterGroups[view.id]).map(album => {
                        const firstPhoto = semesterGroups[view.id][album]?.[0];
                        return (
                            <AlbumFolder
                                key={album}
                                title={album}
                                count={`${semesterGroups[view.id][album].length} Foto`}
                                cover={firstPhoto ? getPhotoSrc(firstPhoto.link) : null}
                                icon={<Images size={32} weight="duotone" />}
                                onClick={() => setView({ type: 'album', id: album, subtitle: `Semester ${view.id}`, parent: view.id })}
                            />
                        );
                    })}
                </div>
            )}

            {view.type === 'album' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                    {(view.parent ? semesterGroups[view.parent][view.id] : generalAlbums[view.id]).map((photo, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedPhoto(photo)}
                            className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-[#14231f] border border-neutral-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-brand/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                        >
                            <img
                                src={getPhotoSrc(photo.link)}
                                alt=""
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/600x600/1e3932/ffffff?text=Buka+di+G-Drive';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest opacity-60">
                                        {photo.course || photo.album || 'Dokumentasi'}
                                    </span>
                                    {photo.filename?.toLowerCase().endsWith('.mp4') && (
                                        <div className="p-1 bg-white/20 rounded-full text-white">
                                            <Play size={12} weight="fill" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-white text-xs font-bold truncate">{photo.filename || 'Media Dokumentasi'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && (
                <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} getPhotoSrc={getPhotoSrc} />
            )}
        </div>
    );
};

const AlbumFolder = ({ title, count, icon, cover, onClick }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center bg-white dark:bg-[#14231f] p-4 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 transition-all duration-300 w-full"
    >
        <div className="relative w-full aspect-square bg-neutral-50 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 group-hover:text-white rounded-[2rem] flex items-center justify-center mb-4 transition-all shadow-inner overflow-hidden">
            {cover ? (
                <img src={cover} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
                <div className="group-hover:bg-brand w-full h-full flex items-center justify-center transition-colors">
                    {icon}
                </div>
            )}
        </div>
        <span className="font-outfit font-bold text-neutral-800 dark:text-white text-sm text-center line-clamp-2 px-2">{title}</span>
        <span className="text-[10px] font-black text-neutral-300 dark:text-amber-500/40 mt-1 uppercase tracking-widest">{count}</span>
    </button>
);

const PhotoModal = ({ photo, onClose, getPhotoSrc }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-fit max-w-[95vw] max-h-[90vh] bg-white dark:bg-[#14231f] rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row border dark:border-white/5">
            <div className="bg-neutral-50 dark:bg-black/20 flex items-center justify-center overflow-hidden w-full h-[50vh] md:h-auto min-h-[300px]">
                {photo.filename?.toLowerCase().endsWith('.mp4') || photo.type?.toLowerCase() === 'video' ? (
                    photo.link?.includes('drive.google.com') ? (
                        <iframe
                            src={`https://drive.google.com/file/d/${photo.link?.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || photo.link?.match(/id=([a-zA-Z0-9_-]+)/)?.[1]}/preview`}
                            className="w-full h-full border-none min-h-[400px]"
                            allow="autoplay; fullscreen"
                            title={photo.filename}
                        ></iframe>
                    ) : (
                        <video
                            src={photo.link}
                            controls
                            autoPlay
                            className="w-full max-h-[70vh] md:max-h-[85vh] object-contain"
                        />
                    )
                ) : (
                    <img
                        src={getPhotoSrc(photo.link)}
                        alt={photo.filename}
                        className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain"
                    />
                )}
            </div>
            <div className="w-full md:w-80 p-8 flex flex-col justify-between border-l border-neutral-100 dark:border-white/5 bg-white dark:bg-[#14231f]">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <span className="px-4 py-1.5 bg-brand/10 dark:bg-amber-500/10 text-brand dark:text-amber-400 text-[10px] font-black rounded-full uppercase tracking-widest">
                            {photo.course || photo.album || 'Dokumentasi'}
                        </span>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-white">
                            <ArrowLeft size={20} weight="bold" />
                        </button>
                    </div>
                    <h3 className="text-xl font-outfit font-black text-neutral-800 dark:text-white mb-2 leading-tight">
                        {photo.filename || 'Foto Dokumentasi'}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Diambil dari arsip dokumentasi angkatan Agribisnis.
                    </p>
                </div>
                <div className="space-y-3">
                    <a
                        href={getPhotoSrc(photo.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-brand text-white rounded-2xl font-bold text-sm hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 active:scale-95"
                    >
                        <Images size={18} weight="bold" />
                        BUKA ASLI
                    </a>
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 rounded-2xl font-bold text-sm hover:bg-neutral-200 dark:hover:bg-white/10 transition-all active:scale-95"
                    >
                        TUTUP
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ArsipFoto;
