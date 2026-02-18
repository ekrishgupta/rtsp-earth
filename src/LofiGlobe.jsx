import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';

const LofiGlobe = () => {
    const globeEl = useRef();

    useEffect(() => {
        // Auto-rotate
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
    }, []);

    // Dummy Points
    const N = 3000;
    const gData = [...Array(N).keys()].map(() => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() / 3,
        color: ['red', 'black'][Math.round(Math.random() * 5) === 0 ? 0 : 1]
    }));

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Globe
                ref={globeEl}
                globeImageUrl={null} // No texture for lofi look
                backgroundColor="#ffffff" // White background
                pointsData={gData}
                pointAltitude={0.01}
                pointColor="color"
                pointRadius="size"
                atmosphereColor="#aaaaaa"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default LofiGlobe;
