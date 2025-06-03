// frontend/src/components/App/LeafletMap/LeafletMap.tsx
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
} from "react-leaflet";
import { nodes } from "../../../data/nodes";
import "leaflet/dist/leaflet.css";

export default function LeafletMap() {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      scrollWheelZoom={true}
      zoomSnap={0.1}
      zoomDelta={0.25}
      zoomAnimation={true}
      worldCopyJump={false}
      maxBounds={[
        [-90, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        noWrap={true}
      />
      ;
      {nodes.map((node) =>
        node.type === "satellite" ? (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lon]}
            radius={6}
            pathOptions={{
              color: "#00f0ff",
              fillColor: "#00f0ff",
              fillOpacity: 1,
            }}
            className="glow-dot"
          >
            <Popup>{node.name}</Popup>
          </CircleMarker>
        ) : (
          <Marker key={node.id} position={[node.lat, node.lon]}>
            <Popup>{node.name}</Popup>
          </Marker>
        )
      )}
    </MapContainer>
  );
}

