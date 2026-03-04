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

    const handlePointClick = useCallback((point) => {
        setSelectedStream(point);
    }, []);

    const handleClosePlayer = useCallback(() => {
        setSelectedStream(null);
    }, []);

    return (
        <GlobeProvider>
            <Overlay onStreamSelect={handlePointClick} />
            <LofiGlobe onPointClick={handlePointClick} />
            <SystemStatus />
            <StreamPlayer stream={selectedStream} onClose={handleClosePlayer} />
        </GlobeProvider>
    );
}

export default App;
