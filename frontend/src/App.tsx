import React from "react";  
import ConnectionStatus from "./components/App/ConnectionStatus/ConnectionStatus";
import SideBar from "./components/App/SideBar/SideBar";
import LeafletMap from "./components/App/LeafletMap/LeafletMap";
import "./index.css";

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <h1 className="text-2xl font-bold">NetVis</h1>
        <ConnectionStatus />
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <SideBar />

        {/* Map View */}
        <main className="flex-1">
          <LeafletMap />
        </main>
      </div>
    </div>
  );
}
