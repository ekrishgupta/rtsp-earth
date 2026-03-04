import React, { useState, useCallback, useRef, useEffect } from 'react';
import streamData from './data.json';
import { useGlobe } from './GlobeContext';

const SearchFilter = ({ onResultSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);
    const { globeRef } = useGlobe();

    // Filter streams by query
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const q = query.toLowerCase();
        const filtered = streamData.filter(s =>
            s.city.toLowerCase().includes(q) ||
            s.country.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q)
        );
        setResults(filtered);
    }, [query]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard shortcut (Ctrl+K / Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSelect = useCallback((stream) => {
        // Fly to location
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = false;
            globeRef.current.pointOfView(
                { lat: stream.latitude, lng: stream.longitude, altitude: 0.8 },
                1200
            );
        }

        if (onResultSelect) {
            onResultSelect({
                lat: stream.latitude,
                lng: stream.longitude,
                title: stream.title,
                url: stream.url,
                city: stream.city,
                country: stream.country,
            });
        }

        setIsOpen(false);
        setQuery('');
    }, [globeRef, onResultSelect]);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
        if (isOpen) setQuery('');
    }, [isOpen]);

    return (
        <>
            {/* Search trigger button */}
            <button className="search-trigger-btn" onClick={toggleOpen} title="Search (⌘K)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-shortcut">⌘K</span>
            </button>

            {/* Search modal overlay */}
            {isOpen && (
                <div className="search-modal-backdrop" onClick={() => { setIsOpen(false); setQuery(''); }}>
                    <div className="search-modal" onClick={e => e.stopPropagation()}>
                        <div className="search-input-container">
                            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                ref={inputRef}
                                className="search-input"
                                type="text"
                                placeholder="Search cities, countries..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <kbd className="search-esc">ESC</kbd>
                        </div>

                        {/* Results */}
                        {results.length > 0 && (
                            <ul className="search-results">
                                {results.map((stream, i) => (
                                    <li
                                        key={`${stream.title}-${i}`}
                                        className="search-result-item"
                                        onClick={() => handleSelect(stream)}
                                    >
                                        <div className="search-result-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className="search-result-info">
                                            <span className="search-result-title">{stream.title}</span>
                                            <span className="search-result-meta">{stream.city}, {stream.country}</span>
                                        </div>
                                        <span className="search-result-arrow">→</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {query && results.length === 0 && (
                            <div className="search-no-results">
                                No streams found for "{query}"
                            </div>
                        )}

                        {!query && (
                            <div className="search-hint">
                                Type to search across {streamData.length} active streams
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchFilter;
