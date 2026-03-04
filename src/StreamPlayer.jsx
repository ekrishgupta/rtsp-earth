import React, { useState, useEffect, useRef, useCallback } from 'react';

const STATIC_PATTERNS = [
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
    'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,255,65,0.02) 3px, rgba(0,255,65,0.02) 6px)',
];

const StreamPlayer = ({ stream, onClose }) => {
    const [connectionPhase, setConnectionPhase] = useState('connecting');
    const [logLines, setLogLines] = useState([]);
    const [signalStrength, setSignalStrength] = useState(0);
    const [scanlineOffset, setScanlineOffset] = useState(0);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    // Simulated connection sequence
    useEffect(() => {
        if (!stream) return;

        const phases = [
            { delay: 0, phase: 'connecting', log: `> INIT RTSP handshake to ${stream.city}...` },
            { delay: 800, phase: 'connecting', log: `> Resolving ${stream.url}` },
            { delay: 1400, phase: 'connecting', log: '> DESCRIBE rtsp://... RTSP/1.0' },
            { delay: 2000, phase: 'connecting', log: '> 200 OK (SDP received)' },
            { delay: 2500, phase: 'connecting', log: '> SETUP transport: RTP/AVP;unicast' },
            { delay: 3000, phase: 'buffering', log: '> PLAY session=0x3FA8B1' },
            { delay: 3500, phase: 'buffering', log: '> Buffering RTP packets...' },
            { delay: 4200, phase: 'buffering', log: `> Codec: H.264 @ 1920x1080 30fps` },
            { delay: 4800, phase: 'streaming', log: '> STREAM ACTIVE ━━━━━━━━━━━━━━━━' },
        ];

        const timers = phases.map(({ delay, phase, log }) =>
            setTimeout(() => {
                setConnectionPhase(phase);
                setLogLines(prev => [...prev, log]);
            }, delay)
        );

        return () => timers.forEach(clearTimeout);
    }, [stream]);

    // Signal strength simulation
    useEffect(() => {
        if (connectionPhase !== 'streaming') return;
        const interval = setInterval(() => {
            setSignalStrength(prev => {
                const drift = (Math.random() - 0.3) * 15;
                return Math.max(40, Math.min(98, prev + drift));
            });
        }, 500);
        setSignalStrength(72);
        return () => clearInterval(interval);
    }, [connectionPhase]);

    // Static noise canvas animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;

        const drawNoise = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            const isStreaming = connectionPhase === 'streaming';
            const intensity = isStreaming ? 12 : 60;

            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * intensity;
                if (isStreaming) {
                    // Green-tinted night-vision effect
                    data[i] = noise * 0.3;
                    data[i + 1] = noise + 15;
                    data[i + 2] = noise * 0.2;
                    data[i + 3] = 180;
                } else {
                    // Pure static
                    data[i] = data[i + 1] = data[i + 2] = noise;
                    data[i + 3] = 200;
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Scanline effect
            setScanlineOffset(prev => (prev + 1) % canvas.height);

            animFrameRef.current = requestAnimationFrame(drawNoise);
        };

        drawNoise();
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [connectionPhase]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!stream) return null;

    const signalBars = Math.ceil(signalStrength / 20);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    return (
        <div className="stream-modal-backdrop" onClick={onClose}>
            <div className="stream-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="stream-modal-header">
                    <div className="stream-modal-title">
                        <span className={`stream-status-dot ${connectionPhase}`} />
                        <span className="stream-title-text">{stream.title}</span>
                    </div>
                    <button className="stream-close-btn" onClick={onClose}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Video Area */}
                <div className="stream-video-container">
                    <canvas ref={canvasRef} className="stream-canvas" />

                    {/* Scanline overlay */}
                    <div className="stream-scanlines" />

                    {/* HUD overlay */}
                    <div className="stream-hud">
                        <div className="stream-hud-top">
                            <span className="stream-hud-label">
                                {connectionPhase === 'streaming' ? 'LIVE' : connectionPhase.toUpperCase()}
                            </span>
                            <span className="stream-hud-timestamp">{timestamp}</span>
                        </div>
                        <div className="stream-hud-bottom">
                            <span className="stream-hud-coords">
                                {stream.lat?.toFixed(4)}°, {stream.lng?.toFixed(4)}°
                            </span>
                            <span className="stream-hud-signal">
                                SIG {signalBars > 0 && '█'.repeat(signalBars)}{'░'.repeat(5 - signalBars)} {signalStrength.toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    {/* Connection log overlay (during connecting phase) */}
                    {connectionPhase !== 'streaming' && (
                        <div className="stream-connection-log">
                            {logLines.map((line, i) => (
                                <div key={i} className="stream-log-line">{line}</div>
                            ))}
                            <span className="stream-cursor-blink">_</span>
                        </div>
                    )}
                </div>

                {/* Info bar */}
                <div className="stream-info-bar">
                    <span>{stream.city}, {stream.country}</span>
                    <span className="stream-protocol">RTSP/1.0 → WebRTC Proxy</span>
                </div>
            </div>
        </div>
    );
};

export default StreamPlayer;
