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
      globeEl.current.controls().enableZoom = true;

      // Set Globe Material to Very Light Grey (The "Ocean")
      const globeObj = globeEl.current;
      if (globeObj.globeMaterial) {
        // Switch to MeshBasicMaterial for flat, lighting-independent color
        const oldMat = globeObj.globeMaterial();
        const newMat = new THREE.MeshBasicMaterial({ color: 0xf2f2f2 }); // Very Light Grey
        globeObj.globeMaterial(newMat);
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'move' }}>
      <Globe
        ref={globeEl}
        onGlobeReady={handleGlobeReady}
        globeImageUrl={null}
        backgroundColor="#ffffff" // Crisp White Background
        showAtmosphere={false} // Disable blue halo/vignette

        // Landmass (Hexagons) - Dark Grey
        hexPolygonsData={landPolygons}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#a0a0a0'} // Darker Grey Continents

        // Stream Points
        pointsData={streams}
        pointAltitude={0.05}
        pointColor="color"
        pointRadius="size"
        pointLabel="title"
      />
    </div>
  );
};

export default LofiGlobe;
