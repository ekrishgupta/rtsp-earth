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

    // Process stream data with safety check
    if (Array.isArray(streamData)) {
      const formattedStreams = streamData.map(s => ({
        lat: s.latitude,
        lng: s.longitude,
        size: 0.5,
        color: 'red',
        title: s.title
      }));
      setStreams(formattedStreams);
    } else {
      console.error("streamData is not an array:", streamData);
    }
  }, []);

  const handleGlobeReady = () => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;

      // Set Globe Material to Light Grey
      // react-globe.gl forwards ref to ThreeGlobe, which has globeMaterial()
      const globeObj = globeEl.current;
      // Check if globeMaterial method exists (it should on ThreeGlobe instance)
      if (globeObj.globeMaterial) {
        const mat = globeObj.globeMaterial();
        mat.color = new THREE.Color(0xe6e6e6);
        mat.emissive = new THREE.Color(0x222222);
        mat.emissiveIntensity = 0.1;
      }
    }
  };

  return (
    <Globe
      ref={globeEl}
      onGlobeReady={handleGlobeReady}
      globeImageUrl={null}
      backgroundColor="#ffffff" // Crisp White Background
      onGlobeReady={handleGlobeReady}

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
    </div >
  );
};

export default LofiGlobe;
