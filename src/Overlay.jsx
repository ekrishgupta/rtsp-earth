import React, { useState, useEffect } from 'react';

const Overlay = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="overlay-container">
            {/* Top Left: System Status */}
            <div className="ui-panel top-left">
                <div className="status-line">
                    <span className="label">SYSTEM:</span>
                    <span className="value safe">ONLINE</span>
                </div>
                <div className="status-line">
                    <span className="label">RTSP_EARTH:</span>
                    <span className="value highlight">CONNECTED</span>
                </div>
                <div className="status-line">
                    <span className="label">TIME:</span>
                    <span className="value">{time.toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Bottom Left: Coordinates (Simulation) */}
            <div className="ui-panel bottom-left">
                <div className="status-line">
                    <span className="label">LAT:</span>
                    <span className="value">{(Math.random() * 180 - 90).toFixed(4)}</span>
                </div>
                <div className="status-line">
                    <span className="label">LON:</span>
                    <span className="value">{(Math.random() * 360 - 180).toFixed(4)}</span>
                </div>
            </div>

        </div>
    );
};

export default Overlay;
