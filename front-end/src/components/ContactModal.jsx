import React, { useState } from 'react';
import { Clipboard } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, email, title }) => {
    if (!isOpen) return null;

    const [copied,setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);

            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Interested in {title}?</h2>
                    <p className="text-slate-400 mb-6">
                        Send the seller an email to arrange a pickup or for additional information!
                    </p>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-2">
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Seller Email</p>
                        <p className="text-lg text-blue-400 font-mono select-all">{email}</p>
                        <button
                                onClick={handleCopy}
                                className="p-2 rounded-md hover:bg-slate-700 transition"
                                aria-label="Copy email"
                            >
                                
                                <Clipboard size={18} className="text-slate-400" />
                              
                        </button>
                    </div>
                    {copied && (
                        <p className="text-sm text-green-400 mt-2">
                            Email copied
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactModal;