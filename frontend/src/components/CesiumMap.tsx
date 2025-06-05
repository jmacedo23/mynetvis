/// <reference types="vite/client" />
import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Widgets/widgets.css";

export default function CesiumMap() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);
  const satelliteEntities = useRef<{ [id: string]: Cesium.Entity }>({});

  const getApiBase = () => {
    const { hostname } = window.location;
    return hostname === "localhost"
      ? "http://localhost:8000"
      : "http://backend:8000";
  };

  const updateSatellites = () => {
    fetch(`${getApiBase()}/satellites/paths`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((sat: any) => {
          const position = new Cesium.SampledPositionProperty();

          sat.path.forEach((point: any) => {
            const time = Cesium.JulianDate.fromDate(new Date(point.timestamp));
            const pos = Cesium.Cartesian3.fromElements(
              point.x * 1000,
              point.y * 1000,
              point.z * 1000
            );
            position.addSample(time, pos);
          });

          const existing = satelliteEntities.current[sat.satellite_id];
          if (existing) {
            existing.position = position;
          } else {
            const entity = viewer.current?.entities.add({
              id: sat.satellite_id,
              name: sat.name,
              position,
              point: {
                pixelSize: 6,
                color: Cesium.Color.YELLOW,
              },
              label: {
                text: sat.name,
                font: "12px sans-serif",
                fillColor: Cesium.Color.WHITE,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, -20),
              },
              path: {
                show: true,
                leadTime: 60,
                trailTime: 60,
                width: 2,
                material: Cesium.Color.YELLOW.withAlpha(0.4),
              },
            });
            satelliteEntities.current[sat.satellite_id] = entity!;
          }
        });
      })
      .catch((err) => console.error("TLE fetch error", err));
  };

  useEffect(() => {
    if (!viewerRef.current) return;

    viewer.current = new Cesium.Viewer(viewerRef.current, {
      shouldAnimate: true,
      timeline: true,
      animation: true,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
    });

    viewer.current.scene.globe.enableLighting = true;
    viewer.current.clock.shouldAnimate = true;
    viewer.current.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    viewer.current.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.current.clock.multiplier = 10;

    updateSatellites();

    const interval = setInterval(updateSatellites, 60_000);
    return () => clearInterval(interval);
  }, []);

  return <div ref={viewerRef} style={{ width: "100%", height: "100vh" }} />;
}
