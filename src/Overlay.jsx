import streamData from './data.json';

const Overlay = () => {
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
                <button className="control-btn" title="Zoom In">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Zoom Out">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                </button>
                <button className="control-btn" title="Reset Rotation">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                </button>
            </div>

            {/* Bottom Left: Ranking List */}
            <div className="overlay-bottom-left">
                <div className="locations-card">
                    <h3>TOP LOCATIONS</h3>
                    <ul className="locations-list">
                        {topLocations.map((loc, index) => (
                            <li key={loc.city} className="location-item">
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
