"use client";

import React, { useEffect, useRef } from "react";
import { LyricLine } from "@/data/lyrics";

interface SyncedLyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  onSelectLine: (time: number) => void;
  className?: string;
}

export const SyncedLyrics: React.FC<SyncedLyricsProps> = ({
  lyrics,
  currentTime,
  onSelectLine,
  className = "",
}) => {
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Find currently active lyric line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    const item = lyrics[i];
    const nextItem = lyrics[i + 1];
    const endTime = item.endTime || (nextItem ? nextItem.time : item.time + 6);

    if (currentTime >= item.time && currentTime < endTime) {
      activeIndex = i;
      break;
    }
  }

  // Auto scroll to active lyric line smoothly
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeLineRef.current;
      const offsetTop = element.offsetTop - container.offsetTop - container.clientHeight / 2 + element.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div className={`flex flex-col items-center w-full max-w-xl font-mono select-none ${className}`}>
      {/* Synced Lyrics List View */}
      <div
        ref={containerRef}
        className="w-full h-48 sm:h-56 overflow-y-auto px-4 py-6 space-y-4 border-y border-white/15 bg-black/40 backdrop-blur-sm scrollbar-none rounded-lg relative"
        style={{ scrollbarWidth: "none" }}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              onClick={() => onSelectLine(line.time)}
              className={`cursor-pointer transition-all duration-300 flex items-center justify-center text-center gap-2 group ${
                isActive
                  ? "text-white text-base sm:text-lg font-bold scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-100"
                  : "text-neutral-500 text-xs sm:text-sm hover:text-neutral-300 opacity-50 hover:opacity-80"
              }`}
            >
              {isActive && (
                <span className="text-yellow-400 text-xs animate-pulse">&gt;</span>
              )}
              <span className="tracking-wide">
                {line.text}
              </span>
              {isActive && (
                <span className="text-yellow-400 text-xs animate-pulse">&lt;</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
