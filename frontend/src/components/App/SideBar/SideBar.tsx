import React from "react";
import TrafficPanel from "../TrafficPanel/TrafficPanel";

export default function SideBar() {
  return (
    <aside className="w-80 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Traffic Panel</h2>
      <TrafficPanel />
    </aside>
  );
}
