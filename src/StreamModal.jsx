import React, { useEffect, useState } from 'react';

const STEPS = [
    { id: 'resolve', label: 'Resolving stream endpoint…' },
    { id: 'handshake', label: 'Performing RTSP handshake…' },
    { id: 'auth', label: 'Authenticating connection…' },
    { id: 'buffering', label: 'Buffering stream…' },
    { id: 'ready', label: 'Stream ready' },
];

const STEP_DELAY_MS = 600;

const StreamModal = ({ stream, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!stream) return;
        setCurrentStep(0);
        setDone(false);

        let step = 0;
        const advance = () => {
            step += 1;
            if (step < STEPS.length) {
                setCurrentStep(step);
                setTimeout(advance, STEP_DELAY_MS);
            } else {
                setDone(true);
            }
        };
        const timer = setTimeout(advance, STEP_DELAY_MS);
        return () => clearTimeout(timer);
    }, [stream]);

    if (!stream) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-live-dot" />
                        <h2 className="modal-title">{stream.title}</h2>
                    </div>
                    <p className="modal-subtitle">{stream.city}, {stream.country}</p>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Connection sequence */}
                <div className="modal-body">
                    <div className="conn-steps">
                        {STEPS.map((step, i) => {
                            const isActive = i === currentStep && !done;
                            const isComplete = i < currentStep || done;
                            return (
                                <div key={step.id} className={`conn-step ${isComplete ? 'conn-step--done' : ''} ${isActive ? 'conn-step--active' : ''}`}>
                                    <div className="conn-icon">
                                        {isComplete ? (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        ) : isActive ? (
                                            <div className="spinner" />
                                        ) : (
                                            <div className="conn-dot" />
                                        )}
                                    </div>
                                    <span className="conn-label">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {done && (
                        <div className="stream-preview">
                            <div className="stream-placeholder">
                                <div className="stream-scanline" />
                                <div className="stream-center-text">
                                    <span className="stream-live-badge">● LIVE</span>
                                    <p className="stream-url">{stream.url}</p>
                                </div>
                            </div>
                            <div className="stream-actions">
                                <button className="stream-btn stream-btn--primary">
                                    Open Stream
                                </button>
                                <button className="stream-btn stream-btn--secondary" onClick={onClose}>
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreamModal;
