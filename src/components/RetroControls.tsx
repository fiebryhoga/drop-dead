"use client";

import React from "react";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Repeat,
  Maximize2,
  Minimize2,
  Zap,
} from "lucide-react";

interface RetroControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeekRelative: (offsetSeconds: number) => void;
  onJumpHighlight: () => void;
  playbackRate: number;
  onCycleSpeed: () => void;
  isLoop: boolean;
  onToggleLoop: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const RetroControls: React.FC<RetroControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSeekRelative,
  onJumpHighlight,
  playbackRate,
  onCycleSpeed,
  isLoop,
  onToggleLoop,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl font-mono select-none">
      {/* Primary Retro Controls (Mobile-Optimized: 3 main buttons on mobile, full controls on desktop) */}
      <div className="flex items-center justify-center gap-6 sm:gap-7 w-full flex-nowrap">
        {/* Restart 0:00 Button (Hidden on Mobile) */}
        <button
          type="button"
          onClick={onJumpHighlight}
          className="hidden sm:flex shrink-0 px-2 py-1.5 border border-white/20 hover:border-white bg-black/60 rounded text-xs text-neutral-300 hover:text-white transition-all items-center gap-1 active:scale-90 whitespace-nowrap"
          title="Restart from 00:00"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">0:00</span>
        </button>

        {/* Previous / -5s */}
        <button
          type="button"
          onClick={() => onSeekRelative(-5)}
          className="shrink-0 text-white hover:text-neutral-300 text-base sm:text-base font-bold tracking-tighter px-3 py-1.5 border border-transparent hover:border-white/20 active:scale-90 transition-all rounded whitespace-nowrap select-none font-mono"
          title="Seek -5s"
        >
          |&lt;&lt;
        </button>

        {/* Central Play/Pause Button (Fixed size, perfectly centered, scanlines) */}
        <button
          type="button"
          onClick={onPlayPause}
          className="shrink-0 relative w-14 h-9 sm:w-16 sm:h-9 bg-white text-black font-extrabold rounded-sm hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.7)] flex items-center justify-center overflow-hidden"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {/* Scanline pattern on button */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.35)_2px,rgba(0,0,0,0.35)_4px)] pointer-events-none" />
          {isPlaying ? (
            <span className="text-base font-black tracking-tight leading-none z-10 whitespace-nowrap select-none">
              ||
            </span>
          ) : (
            <span className="text-sm font-black leading-none z-10 select-none pl-0.5">
              ▶
            </span>
          )}
        </button>

        {/* Next / +5s */}
        <button
          type="button"
          onClick={() => onSeekRelative(5)}
          className="shrink-0 text-white hover:text-neutral-300 text-base sm:text-base font-bold tracking-tighter px-3 py-1.5 border border-transparent hover:border-white/20 active:scale-90 transition-all rounded whitespace-nowrap select-none font-mono"
          title="Seek +5s"
        >
          &gt;&gt;|
        </button>

        {/* Speed Multiplier Button (Hidden on Mobile) */}
        <button
          type="button"
          onClick={onCycleSpeed}
          className="hidden sm:flex shrink-0 px-2 py-1.5 border border-white/20 hover:border-white bg-black/60 rounded text-xs text-white transition-all items-center gap-1 active:scale-90 whitespace-nowrap"
          title="Change playback speed"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[11px] font-bold">{playbackRate}x</span>
        </button>
      </div>

      {/* Secondary Utility Controls (Hidden on Mobile) */}
      <div className="hidden sm:flex items-center justify-between w-full px-1 text-xs text-neutral-400 pt-1">
        {/* Loop Toggle */}
        <button
          type="button"
          onClick={onToggleLoop}
          className={`flex items-center gap-1 px-1.5 py-1 rounded transition-colors whitespace-nowrap ${
            isLoop
              ? "text-white border border-white/50 bg-white/10"
              : "hover:text-white border border-transparent"
          }`}
          title="Toggle Repeat"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span className="text-[11px]">LOOP</span>
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleMute}
            className="hover:text-white transition-colors shrink-0"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-14 sm:w-20 h-1 bg-neutral-700 accent-white rounded cursor-pointer shrink-0"
            title="Volume"
          />
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="flex items-center gap-1 px-1.5 py-1 hover:text-white transition-colors whitespace-nowrap"
          title="Fullscreen OLED Mode"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
          <span className="text-[11px]">OLED FULL</span>
        </button>
      </div>
    </div>
  );
};
