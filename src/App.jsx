import React from 'react';
import LofiGlobe from './LofiGlobe';
import Overlay from './Overlay';
import { GlobeProvider } from './GlobeContext';
import './index.css';

function App() {
    return (
        <GlobeProvider>
            <Overlay />
            <LofiGlobe />
        </GlobeProvider>
    );
}

export default App;
