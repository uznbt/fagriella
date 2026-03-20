import React from 'react';
import { SYNC_SCRIPT_URL } from '../config';

const Upload = () => {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-end">
                <span className="px-3 py-1 bg-brand/10 dark:bg-white/5 text-brand dark:text-neutral-400 text-xs font-bold rounded-full border dark:border-white/5 uppercase tracking-widest">GOOGLE APPS SCRIPT</span>
            </div>

            <div className="flex-1 bg-white dark:bg-[#14231f] rounded-2xl border border-neutral-100 dark:border-white/5 shadow-sm overflow-hidden min-h-[600px] transition-colors duration-300">
                <iframe
                    src={SYNC_SCRIPT_URL}
                    className="w-full h-full border-none"
                    title="Upload Iframe"
                    allow="camera; microphone"
                />
            </div>
        </div>
    );
};

export default Upload;
