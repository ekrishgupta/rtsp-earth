import React, { useState, useCallback } from 'react';
import LofiGlobe from './LofiGlobe';
import Overlay from './Overlay';
import StreamPlayer from './StreamPlayer';
import SystemStatus from './SystemStatus';
import { GlobeProvider } from './GlobeContext';
import { SystemProvider, useSystem } from './SystemContext';
import streamData from './data.json';
import './index.css';

const AppContent = () => {
    const [activeStreams, setActiveStreams] = useState(streamData);
    const [selectedStream, setSelectedStream] = useState(null);
    const { addLog } = useSystem();

    // Simulate dynamic stream status
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveStreams(prev => {
                const newStreams = [...prev];
                const randomIndex = Math.floor(Math.random() * newStreams.length);
                const stream = newStreams[randomIndex];

                if (newStreams.length > 5 && Math.random() > 0.5) {
                    newStreams.splice(randomIndex, 1);
                    addLog(`[DROP] Connection lost: ${stream.city}`);
                } else if (newStreams.length < streamData.length) {
                    const missing = streamData.find(s => !newStreams.some(active => active.title === s.title));
                    if (missing) {
                        newStreams.push(missing);
                        addLog(`[CONN] New stream found: ${missing.city}`);
                    }
                }
                return newStreams;
            });
        }, 8000);
        return () => clearInterval(interval);
    }, [addLog]);

    const handlePointClick = useCallback((point) => {
        setSelectedStream(point);
    }, []);

    const handleClosePlayer = useCallback(() => {
        setSelectedStream(null);
    }, []);

    return (
        <>
            <Overlay activeStreams={activeStreams} onStreamSelect={handlePointClick} />
            <LofiGlobe streams={activeStreams} onPointClick={handlePointClick} />
            <SystemStatus />
            <StreamPlayer stream={selectedStream} onClose={handleClosePlayer} />
        </>
    );
};

function App() {
    return (
        <SystemProvider>
            <GlobeProvider>
                <AppContent />
            </GlobeProvider>
        </SystemProvider>
    );
}

export default App;
