import { useGlobe } from './GlobeContext';
import streamData from './data.json';

const ZOOM_STEP = 0.6; // altitude delta per zoom click
const DEFAULT_ALTITUDE = 2.5;

// Aggregate city coordinates from data.json for flyTo
const cityCoords = streamData.reduce((acc, s) => {
    if (!acc[s.city]) {
        acc[s.city] = { lat: s.latitude, lng: s.longitude };
    }
    return acc;
}, {});

const Overlay = () => {
    const { globeRef } = useGlobe();

    const totalConnections = streamData.length;
    // Count unique cities
    const uniqueLocations = new Set(streamData.map(s => s.city)).size;

    // Aggregate data by city
    const cityCounts = streamData.reduce((acc, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
    }, {});

    // Convert to array and sort by count (descending)
    const topLocations = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Start with top 5

    // --- Zoom helpers ---
    const getCurrentAltitude = () => {
        if (!globeRef?.current) return DEFAULT_ALTITUDE;
        const pov = globeRef.current.pointOfView();
        return pov?.altitude ?? DEFAULT_ALTITUDE;
    };

    const handleZoomIn = () => {
        if (!globeRef?.current) return;
        const pov = globeRef.current.pointOfView();
        const newAlt = Math.max(0.1, (pov?.altitude ?? DEFAULT_ALTITUDE) - ZOOM_STEP);
        globeRef.current.pointOfView({ ...pov, altitude: newAlt }, 400);
    };

    const handleZoomOut = () => {
        if (!globeRef?.current) return;
        const pov = globeRef.current.pointOfView();
        const newAlt = Math.min(10, (pov?.altitude ?? DEFAULT_ALTITUDE) + ZOOM_STEP);
        globeRef.current.pointOfView({ ...pov, altitude: newAlt }, 400);
    };

    const handleResetRotation = () => {
        if (!globeRef?.current) return;
        // Re-enable auto-rotate and fly back to default view
        const controls = globeRef.current.controls();
        globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: DEFAULT_ALTITUDE }, 800);
        setTimeout(() => {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.7;
        }, 850);
    };

    // --- City fly-to ---
    const handleCityClick = (city) => {
        const coords = cityCoords[city];
        if (!coords || !globeRef?.current) return;
        const controls = globeRef.current.controls();
        controls.autoRotate = false;
        globeRef.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 0.8 }, 1200);
    };

    return (
        <div className="overlay-container">
            {/* Top Left: Title */}
            <div className="overlay-top-left">
                <h1 className="header-title">
                    rtsp-earth
                </h1>
            </div>

            {/* Top Right: Controls */}
            <div className="overlay-top-right">
                <button className="control-btn" title="Zoom In" onClick={handleZoomIn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Zoom Out" onClick={handleZoomOut}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Reset Rotation" onClick={handleResetRotation}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>
            </div>

            {/* Bottom Left: Ranking List */}
            <div className="overlay-bottom-left">
                <div className="locations-card">
                    <h3>TOP LOCATIONS</h3>
                    <ul className="locations-list">
                        {topLocations.map((loc, index) => (
                            <li
                                key={loc.city}
                                className="location-item location-item--clickable"
                                onClick={() => handleCityClick(loc.city)}
                                title={`Fly to ${loc.city}`}
                            >
                                <span className="rank">{index + 1}</span>
                                <span className="city-name">{loc.city}</span>
                                <span className="count">{loc.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Overlay;
