"use client";

import React, { useRef } from "react";

interface RetroProgressBarProps {
  currentTime: number;
  duration: number;
  highlightTime?: number; // e.g. 109s (01:49)
  onSeek: (time: number) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const RetroProgressBar: React.FC<RetroProgressBarProps> = ({
  currentTime,
  duration,
  highlightTime = 109,
  onSeek,
  className = "",
}) => {
  const barRef = useRef<HTMLDivElement | null>(null);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const highlightPercent = duration > 0 ? Math.min(100, (highlightTime / duration) * 100) : 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newPercent = clickX / rect.width;
    onSeek(newPercent * duration);
  };

  return (
    <div className={`w-full max-w-xl flex flex-col gap-2 font-mono select-none ${className}`}>
      {/* Progress Track Container */}
      <div
        ref={barRef}
        onClick={handlePointerDown}
        className="group relative w-full h-7 flex items-center cursor-pointer px-1 py-2"
        role="slider"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
      >
        {/* Retro Track Outline (Dual scanline borders) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 bg-black border-y border-white/60 group-hover:border-white transition-colors">
          {/* Subtle background matrix grid */}
          <div
            className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)]"
            style={{ backgroundSize: "4px 4px" }}
          />

          {/* Progress Filled Bar */}
          <div
            className="h-full bg-white transition-[width] duration-75 relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Scanline pattern on filled bar */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)]" />
          </div>

          {/* Highlight Marker at 01:49 */}
          {highlightPercent > 0 && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-yellow-400/90 shadow-[0_0_8px_#facc15] z-10 pointer-events-none"
              style={{ left: `${highlightPercent}%` }}
              title="Iconic Snippet (01:49)"
            />
          )}

          {/* Cursor Head Indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-5 bg-white border border-black shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-90 group-hover:scale-110 transition-transform pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Time Display and 01:49 Highlight Tag */}
      <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 font-mono px-1">
        <span className="text-white font-bold tracking-wider drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
          {formatTime(currentTime)}
        </span>

        {/* Quick jump to 01:49 badge */}
        <button
          type="button"
          onClick={() => onSeek(highlightTime)}
          className="text-[10px] tracking-wider px-2 py-0.5 rounded border border-white/30 hover:border-yellow-400 hover:text-yellow-300 text-neutral-300 transition-all bg-white/5 flex items-center gap-1 active:scale-95"
          title="Jump to highlight: 01:49"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          HIGHLIGHT (01:49)
        </button>

        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
