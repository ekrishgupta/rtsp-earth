import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
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

    // Auto-rotate and Color Setup
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;

      // Set Globe Material to Light Grey (The "Planet")
      const globeMaterial = globeEl.current.globeMaterial();
      globeMaterial.color = new THREE.Color(0xe6e6e6); // Light Grey
      globeMaterial.emissive = new THREE.Color(0x222222);
      globeMaterial.emissiveIntensity = 0.1;
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'move' }}>
      <Globe
        ref={globeEl}
        globeImageUrl={null}
        backgroundColor="#ffffff" // Crisp White Background

        // Landmass (Hexagons) - Darker Grey
        hexPolygonsData={landPolygons}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#808080'} // Darker Grey Continents

        // Stream Points
        pointsData={streams}
        pointAltitude={0.05}
        pointColor="color"
        pointRadius="size"
        pointLabel="title"

        // Atmosphere (Clean)
        atmosphereColor="#ffffff"
        atmosphereAltitude={0.1}
      />
    </div>
  );
};

export default LofiGlobe;
