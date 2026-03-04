import React, { useState, useCallback } from 'react';
import LofiGlobe from './LofiGlobe';
import Overlay from './Overlay';
import StreamPlayer from './StreamPlayer';
import SystemStatus from './SystemStatus';
import { GlobeProvider } from './GlobeContext';
import streamData from './data.json';
import './index.css';

function App() {
    const [activeStreams, setActiveStreams] = useState(streamData);
    const [selectedStream, setSelectedStream] = useState(null);

    // Simulate dynamic stream status
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveStreams(prev => {
                const newStreams = [...prev];
                const randomIndex = Math.floor(Math.random() * newStreams.length);
                const stream = newStreams[randomIndex];

                // For simulation, we just log it or we could actually remove it
                // To keep the UI stable but dynamic, let's just rotate the list
                // OR better: actually remove and re-add after a delay
                if (newStreams.length > 5 && Math.random() > 0.5) {
                    newStreams.splice(randomIndex, 1);
                } else if (newStreams.length < streamData.length) {
                    const missing = streamData.find(s => !newStreams.includes(s));
                    if (missing) newStreams.push(missing);
                }
                return newStreams;
            });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handlePointClick = useCallback((point) => {
        setSelectedStream(point);
    }, []);

    const handleClosePlayer = useCallback(() => {
        setSelectedStream(null);
    }, []);

    return (
        <GlobeProvider>
            <Overlay activeStreams={activeStreams} onStreamSelect={handlePointClick} />
            <LofiGlobe streams={activeStreams} onPointClick={handlePointClick} />
            <SystemStatus />
            <StreamPlayer stream={selectedStream} onClose={handleClosePlayer} />
        </GlobeProvider>
    );
}

export default App;
