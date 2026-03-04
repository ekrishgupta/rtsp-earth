import React, { useState } from 'react';
import LofiGlobe from './LofiGlobe';
import Overlay from './Overlay';
import StreamModal from './StreamModal';
import { GlobeProvider } from './GlobeContext';
import './index.css';

function App() {
    const [selectedStream, setSelectedStream] = useState(null);

    return (
        <GlobeProvider>
            <Overlay />
            <LofiGlobe onPointClick={setSelectedStream} />
            <StreamModal stream={selectedStream} onClose={() => setSelectedStream(null)} />
        </GlobeProvider>
    );
}

export default App;
