import streamData from './data.json';

const Overlay = () => {
    const totalConnections = streamData.length;
    // Count unique cities
    const uniqueLocations = new Set(streamData.map(s => s.city)).size;

    return (
        <div className="overlay-container">
            {/* Top Left: Header & Stats */}
            <div className="overlay-top-left">
                <h1 className="header-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    Locations
                </h1>
                <div className="stats-pill">
                    <span className="stat-item">
                        <span className="dot-indicator"></span>
                        {totalConnections.toLocaleString()} connections
                    </span>
                    <span className="separator">|</span>
                    <span className="stat-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        {uniqueLocations} locations
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Overlay;
