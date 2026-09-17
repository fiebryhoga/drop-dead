"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SONG_METADATA, DROP_DEAD_LYRICS } from "@/data/lyrics";
import { AsciiTextCanvas } from "@/components/AsciiTextCanvas";
import { AsciiWaveform } from "@/components/AsciiWaveform";
import { RetroProgressBar } from "@/components/RetroProgressBar";
import { RetroControls } from "@/components/RetroControls";
import { SyncedLyrics } from "@/components/SyncedLyrics";
import { CRTOverlay } from "@/components/CRTOverlay";
import { AsciiVideoBackground } from "@/components/AsciiVideoBackground";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";

export const AudioVisualizerPlayer: React.FC = () => {
  // 3D Parallax Tilt Hook (Gyroscope & Mouse)
  const { x, y, rotateX, rotateY } = useDeviceTilt(14);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(48); // 48s trimmed audio
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"visualizer" | "lyrics">("visualizer");
  const [audioSource, setAudioSource] = useState<string>(SONG_METADATA.audioSrc);
  const [songTitle, setSongTitle] = useState(SONG_METADATA.title);
  const [artistName, setArtistName] = useState(SONG_METADATA.artist);

  // Initialize Web Audio API Analyser
  const setupAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch (e) {
      console.warn("Web Audio API not yet initialized or CORS restricted:", e);
    }
  }, []);

  // Handle Play / Pause
  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    // Resume AudioContext if suspended
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    } else if (!audioContextRef.current) {
      setupAudioContext();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  // Restart from 00:00
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      togglePlayPause();
    }
  };

  // Seek relative (+/- seconds)
  const seekRelative = (offsetSeconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + offsetSeconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek absolute
  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Cycle speed (0.75x -> 1.0x -> 1.25x -> 1.5x -> 2.0x)
  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Custom audio file upload
  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSource(url);
      setSongTitle(file.name.replace(/\.[^/.]+$/, ""));
      setArtistName("Custom Audio");
      setIsPlaying(false);
    }
  };

  // Find currently active lyric
  const currentLyric = DROP_DEAD_LYRICS.find((l, idx) => {
    const next = DROP_DEAD_LYRICS[idx + 1];
    const endTime = l.endTime || (next ? next.time : l.time + 6);
    return currentTime >= l.time && currentTime < endTime;
  });

  // Current active text to render on ASCII Canvas
  const activeBannerText = currentLyric?.text || songTitle;
  const activeSubText = currentLyric?.subText || "";

  // Keyboard shortcut (Space = Play/Pause, ArrowLeft/Right = Seek)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seekRelative(5);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, duration, currentTime]);

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-between sm:justify-end pb-8 sm:pb-16 pt-6 sm:pt-0 px-4 sm:px-8 font-mono select-none overflow-hidden touch-none"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Real-time Fullscreen ASCII Video Background with 3D Parallax Depth (Overscaled so edges never cut off) */}
      <div
        className="fixed -inset-16 sm:-inset-24 pointer-events-none transition-transform duration-75 ease-out overflow-hidden flex items-center justify-center"
        style={{
          transform: `scale(1.18) translate3d(${-x * 22}px, ${-y * 18}px, -40px) rotateX(${rotateX * 0.22}deg) rotateY(${rotateY * 0.22}deg)`,
          transformOrigin: "center center",
        }}
      >
        <AsciiVideoBackground
          currentTime={currentTime}
          isPlaying={isPlaying}
          videoStartTime={19.0}
        />
      </div>

      {/* CRT Overlay Effect */}
      <CRTOverlay enabled={crtEnabled} />

      {/* Hidden HTML5 Audio element */}
      <audio
        ref={audioRef}
        src={audioSource}
        preload="auto"
        loop={isLoop}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 48);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={() => {
          if (!isLoop) setIsPlaying(false);
        }}
      />

      {/* Main Display Section with Holographic 3D Floating Transform */}
      <main className="w-full max-w-3xl flex-1 sm:flex-initial flex flex-col items-center justify-center sm:justify-end z-20 gap-3 sm:gap-6 relative">
        {/* Big ASCII Text Display (3D Floating Foreground) */}
        <div
          className="w-full flex flex-col items-center justify-center min-h-[110px] sm:min-h-[180px] z-20 transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${x * 26}px, ${y * 20}px, 60px) rotateX(${rotateX * 1.15}deg) rotateY(${rotateY * 1.15}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <AsciiTextCanvas
            text={activeBannerText}
            subText={activeSubText}
            dotSize={4.5}
            gap={1.6}
            glow={true}
          />
        </div>

        {/* Center Mode Switching (Visualizer vs Full Synced Lyrics) */}
        {activeTab === "visualizer" ? (
          <div
            className="w-full flex flex-col items-center gap-3 sm:gap-5 my-1 sm:my-2 z-20 transition-transform duration-75 ease-out"
            style={{
              transform: `translate3d(${x * 12}px, ${y * 10}px, 25px) rotateX(${rotateX * 0.6}deg) rotateY(${rotateY * 0.6}deg)`,
            }}
          >
            {/* Audio Waveform Spectrum Analyzer */}
            <div className="w-full flex justify-center">
              <AsciiWaveform
                analyserNode={analyserRef.current}
                isPlaying={isPlaying}
                barCount={40}
                barWidth={4}
                barGap={3}
                height={64}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="w-full my-2 z-20">
            <SyncedLyrics
              lyrics={DROP_DEAD_LYRICS}
              currentTime={currentTime}
              onSelectLine={(time) => {
                handleSeek(time);
                if (!isPlaying) togglePlayPause();
              }}
            />
          </div>
        )}

        {/* Player Bottom Control Deck Container with 3D Holographic Tilt */}
        <div
          className="w-full max-w-xl flex flex-col items-center gap-3 px-2 z-20 transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${x * 8}px, ${y * 6}px, 15px) rotateX(${rotateX * 0.4}deg) rotateY(${rotateY * 0.4}deg)`,
          }}
        >
          {/* Retro Progress Bar */}
          <RetroProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          {/* Retro Player Controls */}
          <RetroControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSeekRelative={seekRelative}
            onJumpHighlight={handleRestart}
            playbackRate={playbackRate}
            onCycleSpeed={cycleSpeed}
            isLoop={isLoop}
            onToggleLoop={() => setIsLoop(!isLoop)}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </main>
    </div>
  );
};
