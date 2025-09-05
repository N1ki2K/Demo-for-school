
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Search: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { t, getTranslation } = useLanguage();

    const openSearch = () => {
        setIsOpen(true);
    };

    const closeSearch = () => {
        setIsOpen(false);
        setQuery('');
    };
    
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            closeSearch();
        }
    };

    return (
        <>
            <button
                onClick={openSearch}
                className="p-2 text-white hover:text-brand-gold-light transition-colors"
                aria-label={getTranslation('search.label', 'Търсене')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-brand-blue bg-opacity-95 z-[100] flex items-center justify-center animate-fade-in"
                    onClick={closeSearch}
                >
                    <button 
                        onClick={closeSearch} 
                        className="absolute top-6 right-8 text-white text-5xl font-bold hover:text-brand-gold-light"
                        aria-label={getTranslation('search.close', 'Затвори')}
                    >
                        &times;
                    </button>
                    <form 
                        className="w-full max-w-2xl px-4"
                        onSubmit={handleSearch}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={getTranslation('search.placeholder', 'Търсете...')}
                                className="w-full p-4 pr-12 text-lg text-white bg-transparent border-b-2 border-brand-gold focus:outline-none focus:border-white placeholder-gray-400"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-gold hover:text-white" aria-label={getTranslation('search.button', 'Търси')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Search;
