import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import streamData from './data.json';

const LofiGlobe = () => {
  const globeEl = useRef();
  const [landPolygons, setLandPolygons] = useState([]);
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    // Load land data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        setLandPolygons(countries.features);
      });

    // Process stream data
    const formattedStreams = streamData.map(s => ({
      lat: s.latitude,
      lng: s.longitude,
      size: 0.5,
      color: 'red',
      title: s.title
    }));
    setStreams(formattedStreams);

    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'move' }}>
      <Globe
        ref={globeEl}
        globeImageUrl={null}
        backgroundColor="#ffffff"

        // Landmass (Hexagons)
        hexPolygonsData={landPolygons}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#000000'}

        // Stream Points
        pointsData={streams}
        pointAltitude={0.05}
        pointColor="color"
        pointRadius="size"
        pointLabel="title"

        // Atmosphere
        atmosphereColor="#aaaaaa"
        atmosphereAltitude={0.1}
      />
    </div>
  );
};

export default LofiGlobe;
