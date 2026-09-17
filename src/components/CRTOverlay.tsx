"use client";

import React from "react";

interface CRTOverlayProps {
  enabled?: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Scanlines layer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-75" />

      {/* Subtle CRT screen flicker / glow animation */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_60%,_rgba(0,0,0,0.85)_100%] opacity-90" />
      
      {/* Top subtle scan beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/20 animate-pulse pointer-events-none" />
    </div>
  );
};
