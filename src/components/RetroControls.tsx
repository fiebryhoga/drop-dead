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
    <div className="flex flex-col items-center gap-4 w-full max-w-xl font-mono select-none">
      {/* Primary Retro Controls (Matching Screenshot Aesthetic) */}
      <div className="flex items-center justify-center gap-5 sm:gap-8">
        {/* Restart 0:00 Button */}
        <button
          type="button"
          onClick={onJumpHighlight}
          className="group px-2.5 py-1.5 border border-white/30 hover:border-white bg-black/60 rounded text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-1 active:scale-90"
          title="Restart from 00:00"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
          <span className="hidden sm:inline font-bold">0:00</span>
        </button>

        {/* Previous / -5s */}
        <button
          type="button"
          onClick={() => onSeekRelative(-5)}
          className="text-white hover:text-neutral-300 text-lg font-bold tracking-tighter px-3 py-2 border border-transparent hover:border-white/20 active:scale-90 transition-all rounded"
          title="Seek -5s"
        >
          |&lt;&lt;
        </button>

        {/* Central Play/Pause Button */}
        <button
          type="button"
          onClick={onPlayPause}
          className="relative px-6 py-2 bg-white text-black font-extrabold text-xl tracking-widest rounded-sm hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.7)] flex items-center justify-center min-w-[70px]"
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <span className="tracking-tight text-xl">| |</span>
          ) : (
            <span className="text-xl">▶</span>
          )}
        </button>

        {/* Next / +5s */}
        <button
          type="button"
          onClick={() => onSeekRelative(5)}
          className="text-white hover:text-neutral-300 text-lg font-bold tracking-tighter px-3 py-2 border border-transparent hover:border-white/20 active:scale-90 transition-all rounded"
          title="Seek +5s"
        >
          &gt;&gt;|
        </button>

        {/* Speed Multiplier Button */}
        <button
          type="button"
          onClick={onCycleSpeed}
          className="px-2.5 py-1.5 border border-white/30 hover:border-white bg-black/60 rounded text-xs text-white transition-all flex items-center gap-1 active:scale-90"
          title="Change playback speed"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-bold">{playbackRate}x</span>
        </button>
      </div>

      {/* Secondary Utility Controls */}
      <div className="flex items-center justify-between w-full px-2 text-xs text-neutral-400">
        {/* Loop Toggle */}
        <button
          type="button"
          onClick={onToggleLoop}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
            isLoop
              ? "text-white border border-white/50 bg-white/10"
              : "hover:text-white border border-transparent"
          }`}
          title="Toggle Repeat"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LOOP</span>
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 sm:w-24 h-1 bg-neutral-700 accent-white rounded cursor-pointer"
            title="Volume"
          />
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="flex items-center gap-1.5 px-2 py-1 hover:text-white transition-colors"
          title="Fullscreen OLED Mode"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">OLED FULL</span>
        </button>
      </div>
    </div>
  );
};
