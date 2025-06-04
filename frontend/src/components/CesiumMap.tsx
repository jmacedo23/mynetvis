import { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";

export default function CesiumMap() {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = new Cesium.Viewer(viewerRef.current, {
      shouldAnimate: true,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
    });

    viewer.scene.globe.enableLighting = true;

    // ✅ Fetch satellite data from backend API
    fetch("http://localhost:8000/satellites")
      .then((res) => res.json())
      .then((data) => {
        const satellites = data.data;

        satellites.forEach((sat: any, index: number) => {
          viewer.entities.add({
            name: `Satellite ${index}`,
            position: Cesium.Cartesian3.fromDegrees(
              sat.lon,
              sat.lat,
              sat.alt_km * 1000 // convert km to meters
            ),
            point: {
              pixelSize: 8,
              color: Cesium.Color.CYAN,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 1,
            },
          });
        });
      })
      .catch((error) => {
        console.error("Failed to fetch satellite data:", error);
      });

    Cesium.Ion.defaultAccessToken = "";

    return () => viewer.destroy();
  }, []);

  return (
    <div
      id="cesiumContainer"
      ref={viewerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
