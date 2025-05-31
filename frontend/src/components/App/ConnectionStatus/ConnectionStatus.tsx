import React from "react";

export default function ConnectionStatus() {
  const connected = true; // Replace with real logic if needed

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${
          connected ? "bg-green-400" : "bg-red-500"
        }`}
      />
      <span className="text-sm">
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
