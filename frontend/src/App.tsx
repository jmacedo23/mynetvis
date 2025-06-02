import React from "react";  
import ConnectionStatus from "./components/App/ConnectionStatus/ConnectionStatus";
import SideBar from "./components/App/SideBar/SideBar";
import LeafletMap from "./components/App/LeafletMap/LeafletMap";
import "./index.css";

// src/components/App/App.tsx

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "40px", background: "#222", color: "white", padding: "0 1rem", display: "flex", alignItems: "center" }}>
        NetVis — Connection Status: Connected
      </div>
      <div style={{ flex: 1 }}>
        <LeafletMap />
      </div>
    </div>
  );
}

