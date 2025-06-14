/// <reference types="vite/client" />
import { useEffect, useRef } from "react";
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";

export default function CesiumMap() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<Cesium.Viewer | null>(null);
  const satelliteEntities = useRef<{ [id: string]: Cesium.Entity }>({});
  const groundEntities = useRef<Cesium.Entity[]>([]);
  const firstLoad = useRef<boolean>(true);

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
        console.log("Sat count:", data.length);
        console.log("First sat:", data[0]);
        console.log("First path length:", data[0]?.path?.length);
        console.log("Satellite data:", data); 
        if (data.length && data[0].path.length && viewer.current) {
          const startTime = Cesium.JulianDate.fromDate(
            new Date(data[0].path[0].timestamp)
          );
          const stopTime = Cesium.JulianDate.fromDate(
            new Date(data[0].path.slice(-1)[0].timestamp)
          );

          if (firstLoad.current) {
            viewer.current.clock.startTime = startTime.clone();
            viewer.current.clock.currentTime = startTime.clone();
            viewer.current.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
            viewer.current.clock.multiplier = 10;

            if (viewer.current.timeline) {
              viewer.current.timeline.zoomTo(startTime, stopTime);
            }
          }
        }

        data.forEach((sat: any) => {
          const position = new Cesium.SampledPositionProperty();
          position.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
          position.forwardExtrapolationDuration = Infinity;
          position.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
          position.backwardExtrapolationDuration = Infinity;

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
                show: false,
              },
            });
            satelliteEntities.current[sat.satellite_id] = entity!;
          }
        });
        if (firstLoad.current && viewer.current?.entities.values.length > 0) {
          viewer.current.zoomTo(viewer.current.entities);
          firstLoad.current = false;
        }
      })
      .catch((err) => console.error("TLE fetch error", err));
  };

  const loadGroundStations = () => {
    fetch(`${getApiBase()}/ground-stations`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((gs: any) => {
          const entity = viewer.current?.entities.add({
            position: Cesium.Cartesian3.fromDegrees(gs.lon, gs.lat, 0),
            point: {
              pixelSize: 8,
              color: Cesium.Color.RED,
            },
            label: {
              text: gs.name,
              font: "12px sans-serif",
              fillColor: Cesium.Color.WHITE,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              outlineWidth: 2,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(0, -20),
            },
          });
          if (entity) {
            groundEntities.current.push(entity);
          }
        });
      })
      .catch((err) => console.error("Ground station fetch error", err));
  };


  useEffect(() => {
    if (!viewerRef.current) return;

    // 🪐 Create viewer
    viewer.current = new Cesium.Viewer(viewerRef.current, {
      shouldAnimate: true,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
    });

    // 🌍 Enable globe lighting
    viewer.current.scene.globe.enableLighting = true;

    // ⏱ Sync Cesium clock with satellite timestamps
    const startDate = new Date();
    const stopDate = new Date(startDate.getTime() + 6 * 60 * 1000); // 6 minutes

    const start = Cesium.JulianDate.fromDate(startDate);
    const stop = Cesium.JulianDate.fromDate(stopDate);

    const clock = viewer.current.clock;
    clock.startTime = start.clone();
    clock.stopTime = stop.clone();
    clock.currentTime = start.clone();
    clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    clock.multiplier = 10;
    clock.shouldAnimate = true;

    if (viewer.current.timeline) {
      viewer.current.timeline.zoomTo(start, stop);
    }

    // 🛰 Load satellites
    updateSatellites();
    loadGroundStations();

    // 🔁 Periodic update
    const interval = setInterval(updateSatellites, 60000);

    return () => {
      clearInterval(interval);
      viewer.current?.destroy();
    };
  }, []);


  return <div ref={viewerRef} style={{ width: "100%", height: "100vh" }} />;
}
