import { useGlobe } from './GlobeContext';
import SearchFilter from './SearchFilter';

const Overlay = ({ activeStreams, onStreamSelect }) => {
    const { globeRef } = useGlobe();
    const totalConnections = activeStreams.length;

    // Aggregate data by city
    const cityCounts = activeStreams.reduce((acc, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
    }, {});

    // Convert to array and sort by count (descending)
    const topLocations = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Zoom In
    const handleZoomIn = useCallback(() => {
        if (globeRef.current) {
            const pov = globeRef.current.pointOfView();
            globeRef.current.pointOfView(
                { ...pov, altitude: Math.max(0.3, pov.altitude * 0.7) },
                300
            );
        }
    }, [globeRef]);

    // Zoom Out
    const handleZoomOut = useCallback(() => {
        if (globeRef.current) {
            const pov = globeRef.current.pointOfView();
            globeRef.current.pointOfView(
                { ...pov, altitude: Math.min(5, pov.altitude * 1.4) },
                300
            );
        }
    }, [globeRef]);

    // Reset rotation
    const handleReset = useCallback(() => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.7;
            globeRef.current.pointOfView(
                { lat: 20, lng: 0, altitude: 2.5 },
                1000
            );
        }
    }, [globeRef]);

    // Click location to fly to it
    const handleLocationClick = (city) => {
        const stream = activeStreams.find(s => s.city === city);
        if (stream && globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = false;
            globeRef.current.pointOfView(
                { lat: stream.latitude, lng: stream.longitude, altitude: 0.8 },
                1200
            );
        }
    }, [globeRef]);

    return (
        <div className="overlay-container">
            {/* Top Left: Title */}
            <div className="overlay-top-left">
                <h1 className="header-title">
                    rtsp-earth
                </h1>
                <div className="stats-pill">
                    <div className="stat-item">
                        <span className="dot-indicator live" />
                        <span>{totalConnections} streams</span>
                    </div>
                    <span className="separator">|</span>
                    <div className="stat-item">
                        <span>{new Set(activeStreams.map(s => s.country)).size} countries</span>
                    </div>
                </div>
            </div>

            {/* Top Right: Controls */}
            <div className="overlay-top-right">
                <SearchFilter onResultSelect={onStreamSelect} />
                <button className="control-btn" title="Zoom In" onClick={handleZoomIn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Zoom Out" onClick={handleZoomOut}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Reset Rotation" onClick={handleReset}>
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
                                className="location-item clickable"
                                onClick={() => handleLocationClick(loc.city)}
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
