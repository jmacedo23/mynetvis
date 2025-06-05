/// <reference types="vite/client" />
import { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";

export default function CesiumMap() {
  const viewerRef = useRef<HTMLDivElement | null>(null); // The HTML <div> container for the map
  const viewer = useRef<Cesium.Viewer | null>(null); // Stores the Cesium globe instance
  const satelliteEntities = useRef<{ [id: string]: Cesium.Entity }>({}); // Tracks satellite markers

  
  const getApiBase = () => {
    const { hostname } = window.location;
    if (hostname === "localhost") {
      return "http://localhost:8000"; // For dev use
    }
    return "http://backend:8000"; // Inside Docker or production
  };

  useEffect(() => {
    if (!viewerRef.current) return;

    
    viewer.current = new Cesium.Viewer(viewerRef.current, {
      shouldAnimate: true,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
    });

    viewer.current.scene.globe.enableLighting = true;


    const updateSatellites = () => {
      fetch(`${getApiBase()}/satellites/positions`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Received satellite data:", data);
          const satellites = data.satellites;

          type Satellite = {
            satellite_id: string;
            lat: number;
            lon: number;
            alt_km: number;
          };

          satellites.forEach((sat: Satellite) => {
            if (
              typeof sat.lat !== "number" ||
              typeof sat.lon !== "number" ||
              typeof sat.alt_km !== "number" ||
              isNaN(sat.lat) ||
              isNaN(sat.lon) ||
              isNaN(sat.alt_km)
            ) {
              console.warn("Skipping invalid satellite:", sat);
              return;
            }

            const position = Cesium.Cartesian3.fromDegrees(
              sat.lon,
              sat.lat,
              sat.alt_km * 1000
            );

            const existing = satelliteEntities.current[sat.satellite_id];

            if (existing) {
              existing.position = position;
            } else {
              const entity = viewer.current?.entities.add({
                name: sat.satellite_id,
                position: position,
                point: {
                  pixelSize: 8,
                  color: Cesium.Color.CYAN,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 1,
                },
                label: {
                  text: sat.satellite_id,
                  font: "12px sans-serif",
                  fillColor: Cesium.Color.WHITE,
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.TOP,
                  pixelOffset: new Cesium.Cartesian2(0, -20),
                },
              });
              satelliteEntities.current[sat.satellite_id] = entity;
            }
          });
        })
        .catch((err) => {
          console.error("Failed to fetch satellites:", err);
        });
    };

    // 🕒 Fetch initially and every 5 seconds
    updateSatellites();
    const intervalId = setInterval(updateSatellites, 5000);

    // 💥 Cleanup when component unmounts
    return () => {
      viewer.current?.destroy();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      id="cesiumContainer"
      ref={viewerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
