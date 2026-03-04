import React, { createContext, useContext, useRef } from 'react';

const GlobeContext = createContext(null);

export const GlobeProvider = ({ children }) => {
    const globeRef = useRef(null);
    return (
        <GlobeContext.Provider value={{ globeRef }}>
            {children}
        </GlobeContext.Provider>
    );
};

export const useGlobe = () => useContext(GlobeContext);

export default GlobeContext;
