import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { useGlobe } from './GlobeContext';

const DEFAULT_ALTITUDE = 2.5;

const LofiGlobe = ({ streams = [], onPointClick }) => {
  const { globeRef } = useGlobe();
  const [landPolygons, setLandPolygons] = useState([]);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    // Load land data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        setLandPolygons(countries.features);
      });
  }, []);

  // Format streams for the globe points
  const globePoints = useMemo(() => {
    return streams.map(s => ({
      lat: s.latitude,
      lng: s.longitude,
      size: 0.5,
      color: 'red',
      title: s.title,
      url: s.url,
      city: s.city,
      country: s.country,
    }));
  }, [streams]);

  // Pulse animation for points
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
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

        // Add bloom-like glow to the scene via post-processing emulation
        if (globeObj && globeObj.scene) {
          const scene = globeObj.scene();
          // Add ambient light for soft glow
          const ambientLight = new THREE.AmbientLight(0xff2222, 0.15);
          scene.add(ambientLight);

          // Add a subtle red point light at the globe center for glow
          const pointLight = new THREE.PointLight(0xff3333, 0.5, 200);
          pointLight.position.set(0, 0, 0);
          scene.add(pointLight);
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

  // Dynamic point altitude for pulsing glow effect
  const pointAltitude = useCallback(() => {
    return 0.05 + Math.sin(pulsePhase * 0.1) * 0.02;
  }, [pulsePhase]);

  // Dynamic ring data for glow halos around points
  const ringsData = useMemo(() => {
    return globePoints.map(s => ({
      lat: s.lat,
      lng: s.lng,
      maxR: 2,
      propagationSpeed: 1.5,
      repeatPeriod: 1200,
    }));
  }, [globePoints]);

  return (
    <div className="globe-container">
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

        // Stream Points with glow
        pointsData={globePoints}
        pointAltitude={pointAltitude}
        pointColor={() => '#ff2020'}
        pointRadius={0.6}
        pointLabel="title"
        onPointClick={handlePointClick}

        // Glow rings around stream points
        ringsData={ringsData}
        ringColor={() => t => `rgba(255, 40, 40, ${1 - t})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
};

export default LofiGlobe;
