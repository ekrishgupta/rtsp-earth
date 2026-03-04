import React, { useState, useCallback, useEffect } from 'react';
import LofiGlobe from './LofiGlobe';
import Overlay from './Overlay';
import StreamPlayer from './StreamPlayer';
import SystemStatus from './SystemStatus';
import { GlobeProvider } from './GlobeContext';
import streamData from './data.json';
import './index.css';

function App() {
    const [activeStreams, setActiveStreams] = useState([]);
    const [selectedStream, setSelectedStream] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Data Loading: Simulate API fetch
    useEffect(() => {
        const fetchStreams = async () => {
            setLoading(true);
            try {
                // In a real app, this would be: 
                // const response = await fetch('https://api.rtsp-earth.com/streams');
                // const data = await response.json();

                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 800));
                setActiveStreams(streamData);
            } catch (error) {
                console.error("Failed to fetch streams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();

        // Refresh every 60 seconds
        const interval = setInterval(fetchStreams, 60000);
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
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100,
                    color: '#00ff41',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '14px',
                }}>
                    INITIALIZING STREAM GRID...
                </div>
            )}
            <Overlay activeStreams={activeStreams} onStreamSelect={handlePointClick} />
            <LofiGlobe streams={activeStreams} onPointClick={handlePointClick} />
            <SystemStatus />
            <StreamPlayer stream={selectedStream} onClose={handleClosePlayer} />
        </GlobeProvider>
    );
}

export default App;
