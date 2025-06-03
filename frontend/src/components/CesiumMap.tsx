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

    const satellites = [
      { name: "Satellite 0", lat: 0, lon: 0, alt: 600 },
      { name: "Satellite 1", lat: 40, lon: 0, alt: 600 },
      { name: "Satellite 2", lat: 80, lon: 0, alt: 600 },
      { name: "Satellite 3", lat: 60, lon: 180, alt: 600 },
      { name: "Satellite 4", lat: 20, lon: 180, alt: 600 },
      { name: "Satellite 5", lat: 0, lon: -180, alt: 600 },
      { name: "Satellite 6", lat: -40, lon: -180, alt: 600 },
      { name: "Satellite 7", lat: -80, lon: -180, alt: 600 },
      { name: "Satellite 8", lat: -60, lon: 0, alt: 600 },
      { name: "Satellite 9", lat: -20, lon: 0, alt: 600 },
      { name: "Satellite 10", lat: 0, lon: 180, alt: 600 },
      { name: "Satellite 11", lat: 40, lon: 180, alt: 600 },
      { name: "Satellite 12", lat: 80, lon: 180, alt: 600 },
      { name: "Satellite 13", lat: 60, lon: -180, alt: 600 },
      { name: "Satellite 14", lat: 20, lon: -180, alt: 600 },
      { name: "Satellite 15", lat: 0, lon: -90, alt: 600 },
      { name: "Satellite 16", lat: 40, lon: -90, alt: 600 },
      { name: "Satellite 17", lat: 80, lon: -90, alt: 600 },
      { name: "Satellite 18", lat: 60, lon: 90, alt: 600 },
      { name: "Satellite 19", lat: 20, lon: 90, alt: 600 },
    ];

    satellites.forEach((sat) => {
      viewer.entities.add({
        name: sat.name,
        position: Cesium.Cartesian3.fromDegrees(
          sat.lon,
          sat.lat,
          sat.alt * 1000
        ),
        point: {
          pixelSize: 8,
          color: Cesium.Color.CYAN,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
        },
      });
    });



      Cesium.Ion.defaultAccessToken = "";


 

    return () => viewer.destroy();
  }, []);

  return <div id="cesiumContainer" ref={viewerRef} />;
}
