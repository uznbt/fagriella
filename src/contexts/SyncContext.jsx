import React, { createContext, useContext, useState, useEffect } from 'react';
import { SYNC_SCRIPT_URL } from '../config';

const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({ children }) => {
    const [syncToken, setSyncToken] = useState(localStorage.getItem('sync_token') || '');
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(localStorage.getItem('last_sync_time') || null);

    // Data yang akan disinkronkan
    const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem('bookmarks')) || []);

    // Simpan bookmarks ke localStorage setiap kali berubah
    useEffect(() => {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = (material) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.link === material.link);
            if (exists) {
                return prev.filter(b => b.link !== material.link);
            }
            return [...prev, { ...material, bookmarkedAt: new Date().toISOString() }];
        });
    };

    const pullData = async (token) => {
        if (!token || !SYNC_SCRIPT_URL) return null;
        setIsSyncing(true);
        try {
            const url = `${SYNC_SCRIPT_URL}${SYNC_SCRIPT_URL.includes('?') ? '&' : '?'}action=user_sync&method=get&token=${encodeURIComponent(token)}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.status === 'success' && result.data) {
                const serverData = JSON.parse(result.data);

                // Merge bookmarks (prioritaskan server atau gabungkan)
                if (serverData.bookmarks) {
                    setBookmarks(serverData.bookmarks);
                }

                // Tema & Semester
                if (serverData.theme) localStorage.setItem('theme', serverData.theme);
                if (serverData.semester) localStorage.setItem('last_semester', serverData.semester);

                setLastSync(new Date().toLocaleString());
                localStorage.setItem('last_sync_time', new Date().toLocaleString());
                return serverData;
            }
            return null;
        } catch (error) {
            console.error('Sync Pull Error:', error);
            return null;
        } finally {
            setIsSyncing(false);
        }
    };

    const pushData = async () => {
        if (!syncToken || !SYNC_SCRIPT_URL) return;

        const data = {
            theme: localStorage.getItem('theme') || 'light',
            semester: localStorage.getItem('last_semester') || '3',
            bookmarks: bookmarks
        };

        const url = `${SYNC_SCRIPT_URL}${SYNC_SCRIPT_URL.includes('?') ? '&' : '?'}action=user_sync&method=set&token=${encodeURIComponent(syncToken)}&data=${encodeURIComponent(JSON.stringify(data))}`;

        try {
            await fetch(url);
            setLastSync(new Date().toLocaleString());
            localStorage.setItem('last_sync_time', new Date().toLocaleString());
        } catch (error) {
            console.warn('Sync Push Failed:', error);
        }
    };

    const login = async (token) => {
        const data = await pullData(token);
        setSyncToken(token);
        localStorage.setItem('sync_token', token);
        return !!data;
    };

    const logout = () => {
        setSyncToken('');
        localStorage.removeItem('sync_token');
        localStorage.removeItem('last_sync_time');
        setBookmarks([]);
    };

    // Auto-push data jika token aktif (setiap ada perubahan bookmarks)
    useEffect(() => {
        if (syncToken) {
            const timer = setTimeout(() => pushData(), 2000);
            return () => clearTimeout(timer);
        }
    }, [bookmarks, syncToken]);

    return (
        <SyncContext.Provider value={{
            syncToken,
            isSyncing,
            lastSync,
            bookmarks,
            toggleBookmark,
            login,
            logout,
            pushData
        }}>
            {children}
        </SyncContext.Provider>
    );
};
