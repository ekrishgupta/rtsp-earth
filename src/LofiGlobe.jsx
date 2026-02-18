import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const LofiGlobe = () => {
    const globeEl = useRef();
    const [landPolygons, setLandPolygons] = useState([]);

    useEffect(() => {
        // Load minimal land data (GeoJSON)
        fetch('//unpkg.com/world-atlas/land-110m.json')
            .then(res => res.json())
            .then(landTopo => {
                // We need a way to convert topojson to geojson, but react-globe.gl 
                // examples often use a specific URL for hex data or raw polygons.
                // Let's use a known geojson source for simplicity:
                // https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson
            });

        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(countries => {
                setLandPolygons(countries.features);
            });

        // Auto-rotate
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.5;
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', cursor: 'move' }}>
            <Globe
                ref={globeEl}
                globeImageUrl={null} // No texture for lofi look
                backgroundColor="#ffffff" // White background

                // Landmass (Hexagons) - Minimal/Techy Look
                hexPolygonsData={landPolygons}
                hexPolygonResolution={3}
                hexPolygonMargin={0.3}
                hexPolygonColor={() => '#000000'} // Black continents

                // Atmosphere
                atmosphereColor="#aaaaaa"
                atmosphereAltitude={0.1}
            />
        </div>
    );
};

export default LofiGlobe;
