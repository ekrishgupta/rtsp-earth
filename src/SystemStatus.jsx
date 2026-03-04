import { useSystem } from './SystemContext';

const CONNECTION_SOURCES = [
    'Tokyo-NRT', 'London-LHR', 'NYC-JFK', 'Sydney-SYD', 'Moscow-SVO',
    'Paris-CDG', 'Cairo-CAI', 'Mumbai-BOM', 'São Paulo-GRU', 'Berlin-BER',
    'Seoul-ICN', 'Toronto-YYZ', 'Dubai-DXB', 'Singapore-SIN', 'Lagos-LOS',
];

const LOG_TEMPLATES = [
    (src) => `[RTSP] ${src} DESCRIBE 200`,
    (src) => `[RTP]  ${src} packets: ${Math.floor(Math.random() * 500 + 100)}`,
    (src) => `[SIG]  ${src} signal: ${(Math.random() * 40 + 60).toFixed(1)}%`,
    (src) => `[PING] ${src} latency: ${Math.floor(Math.random() * 180 + 20)}ms`,
];

const SystemStatus = () => {
    const { logs, addLog } = useSystem();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeConns, setActiveConns] = useState(7);
    const [bandwidth, setBandwidth] = useState(12.4);
    const [uptime, setUptime] = useState(0);
    const logContainerRef = useRef(null);

    // Real-time clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Uptime counter
    useEffect(() => {
        const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Background fluff logs
    useEffect(() => {
        const interval = setInterval(() => {
            const src = CONNECTION_SOURCES[Math.floor(Math.random() * CONNECTION_SOURCES.length)];
            const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
            addLog(template(src));
        }, 3000 + Math.random() * 3000);
        return () => clearInterval(interval);
    }, [addLog]);

    // Auto-scroll log
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Fluctuate stats
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveConns(prev => Math.max(3, Math.min(15, prev + Math.floor(Math.random() * 3) - 1)));
            setBandwidth(prev => Math.max(5, Math.min(30, prev + (Math.random() - 0.5) * 4)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const timeStr = currentTime.toLocaleTimeString('en-US', { hour12: false });
    const dateStr = currentTime.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit'
    });

    return (
        <div className="system-status">
            {/* Clock */}
            <div className="system-clock">
                <span className="clock-time">{timeStr}</span>
                <span className="clock-date">{dateStr}</span>
            </div>

            {/* Stats Row */}
            <div className="system-stats-row">
                <div className="sys-stat">
                    <span className="sys-stat-label">CONN</span>
                    <span className="sys-stat-value">{activeConns}</span>
                </div>
                <div className="sys-stat">
                    <span className="sys-stat-label">BW</span>
                    <span className="sys-stat-value">{bandwidth.toFixed(1)}<small>Mbps</small></span>
                </div>
                <div className="sys-stat">
                    <span className="sys-stat-label">UP</span>
                    <span className="sys-stat-value">{formatUptime(uptime)}</span>
                </div>
            </div>

            {/* Scrolling Log */}
            <div className="system-log" ref={logContainerRef}>
                {logs.map(entry => (
                    <div key={entry.id} className="log-entry">
                        <span className="log-time">{entry.time}</span>
                        <span className="log-text">{entry.text}</span>
                    </div>
                ))}
                <span className="log-cursor">█</span>
            </div>
        </div>
    );
};

export default SystemStatus;
