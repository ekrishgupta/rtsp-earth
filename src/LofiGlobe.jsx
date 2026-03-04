import React, { useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import streamData from './data.json';
import { useGlobe } from './GlobeContext';

const DEFAULT_ALTITUDE = 2.5;

const LofiGlobe = ({ onPointClick }) => {
  const { globeRef } = useGlobe();
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
        title: s.title,
        url: s.url,
        city: s.city,
        country: s.country,
      }));
      setStreams(formattedStreams);
    } else {
      console.error("streamData is not an array:", streamData);
    }
  }, []);

  const handleGlobeReady = useCallback(() => {
    if (globeRef.current) {
      // Auto-rotate
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.7;
      controls.enableZoom = true;

      // Stop auto-rotation when user interacts
      controls.addEventListener('start', () => {
        controls.autoRotate = false;
      });

      // Use setTimeout to ensure we override any internal initialization
      setTimeout(() => {
        const globeObj = globeRef.current;
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
  }, [globeRef]);

  const handlePointClick = useCallback((point) => {
    if (onPointClick) {
      onPointClick(point);
    }
    // Stop auto-rotate and fly to point
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = false;
      globeRef.current.pointOfView(
        { lat: point.lat, lng: point.lng, altitude: 0.8 },
        1200
      );
    }
  }, [globeRef, onPointClick]);

  return (
    <div style={{ width: '100vw', height: '100vh', cursor: 'move', marginLeft: '8vw' }}>
      <Globe
        ref={globeRef}
        onGlobeReady={handleGlobeReady}
        globeImageUrl={null}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}

        // Landmass (Hexagons) - Dark Grey
        hexPolygonsData={landPolygons}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        hexPolygonColor={() => '#a0a0a0'}

        // Stream Points
        pointsData={streams}
        pointAltitude={0.05}
        pointColor="color"
        pointRadius="size"
        pointLabel="title"
        onPointClick={handlePointClick}
      />
    </div>
  );
};

export default LofiGlobe;
