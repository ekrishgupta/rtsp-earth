import React, { createContext, useContext, useState, useCallback } from 'react';

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);

    const addLog = useCallback((text) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => {
            const newEntries = [...prev, { id: Date.now() + Math.random(), time: timestamp, text }];
            return newEntries.slice(-40); // Keep more logs in context
        });
    }, []);

    return (
        <SystemContext.Provider value={{ logs, addLog }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => useContext(SystemContext);

export default SystemContext;
