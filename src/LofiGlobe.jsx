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
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = true;

      // Stop auto-rotation when user interacts
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });

      // Use setTimeout to ensure we override any internal initialization
      setTimeout(() => {
        const globeObj = globeEl.current;
        if (globeObj && globeObj.globeMaterial) {
          // Switch to MeshLambertMaterial with high emissive to force light grey color
          const newMat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            emissive: 0xf0f0f0,
            emissiveIntensity: 1
          });
          globeObj.globeMaterial(newMat);
        }
      }, 100);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'move', marginLeft: '8vw' }}>
      <Globe
        ref={globeEl}
        onGlobeReady={handleGlobeReady}
        globeImageUrl={null}
        backgroundColor="rgba(0,0,0,0)" // Transparent, let body bg show through (White)
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
