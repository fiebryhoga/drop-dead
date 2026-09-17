"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SONG_METADATA, DROP_DEAD_LYRICS } from "@/data/lyrics";
import { AsciiTextCanvas } from "@/components/AsciiTextCanvas";
import { AsciiWaveform } from "@/components/AsciiWaveform";
import { RetroProgressBar } from "@/components/RetroProgressBar";
import { RetroControls } from "@/components/RetroControls";
import { SyncedLyrics } from "@/components/SyncedLyrics";
import { CRTOverlay } from "@/components/CRTOverlay";
import { Sparkles, Tv, Upload, Radio, FileMusic } from "lucide-react";

export const AudioVisualizerPlayer: React.FC = () => {
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(SONG_METADATA.defaultStartTime); // 109s (01:49)
  const [duration, setDuration] = useState(210); // fallback duration until metadata loads
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
  const [isInitialReady, setIsInitialReady] = useState(false);

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
        // If currentTime was initial 109s, ensure audio element starts at 109s
        if (!isInitialReady && audioRef.current.currentTime === 0) {
          audioRef.current.currentTime = SONG_METADATA.defaultStartTime;
          setIsInitialReady(true);
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  // Jump directly to the 01:49 Highlight
  const jumpToHighlight = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = SONG_METADATA.defaultStartTime;
    setCurrentTime(SONG_METADATA.defaultStartTime);
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
      setIsInitialReady(true);
    }
  };

  // Find currently active lyric
  const currentLyric = DROP_DEAD_LYRICS.find((l, idx) => {
    const next = DROP_DEAD_LYRICS[idx + 1];
    const endTime = l.endTime || (next ? next.time : l.time + 6);
    return currentTime >= l.time && currentTime < endTime;
  });

  // Calculate the ASCII Banner title to show:
  // If playing near or after 01:49, show the punchy lyric banner keyword; otherwise show Song Title
  const activeBannerText = currentLyric?.asciiBanner || "DROP DEAD";
  const activeSubText = currentLyric ? currentLyric.text : artistName;

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
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-between p-4 sm:p-8 font-mono select-none overflow-x-hidden">
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
            setDuration(audioRef.current.duration || 210);
            // Default initial cue to 01:49 as requested
            if (!isInitialReady) {
              audioRef.current.currentTime = SONG_METADATA.defaultStartTime;
              setCurrentTime(SONG_METADATA.defaultStartTime);
            }
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

      {/* Main Display Section */}
      <main className="w-full max-w-3xl my-auto flex flex-col items-center justify-center py-6 sm:py-10 z-20 gap-6">
        {/* Big ASCII Text Display (Matching screenshot) */}
        <div className="w-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[180px]">
          <AsciiTextCanvas
            text={activeBannerText}
            subText={activeSubText}
            dotSize={6}
            gap={2}
            glow={true}
            color="#FFFFFF"
            scanlines={true}
          />
        </div>

        {/* Center Mode Switching (Visualizer vs Full Synced Lyrics) */}
        {activeTab === "visualizer" ? (
          <div className="w-full flex flex-col items-center gap-5 my-2">
            {/* Live Synchronized Current Line Subtitle */}
            <div className="min-h-[36px] flex items-center justify-center text-center px-4">
              <p className="text-sm sm:text-base text-neutral-300 font-medium tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] animate-fade-in">
                {currentLyric ? (
                  <>
                    <span className="text-yellow-400 mr-2">&bull;</span>
                    {currentLyric.text}
                  </>
                ) : (
                  <span className="text-neutral-500 italic">
                    Press Space or Play to start listening from 01:49
                  </span>
                )}
              </p>
            </div>

            {/* Audio Waveform Spectrum Analyzer */}
            <AsciiWaveform
              analyserNode={analyserRef.current}
              isPlaying={isPlaying}
              barCount={42}
              barWidth={5}
              barGap={3}
              height={76}
              className="w-full"
            />
          </div>
        ) : (
          <div className="w-full my-2">
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

        {/* Retro Progress Bar */}
        <RetroProgressBar
          currentTime={currentTime}
          duration={duration}
          highlightTime={SONG_METADATA.defaultStartTime} // 109s (01:49)
          onSeek={handleSeek}
        />

        {/* Retro Player Controls */}
        <RetroControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onSeekRelative={seekRelative}
          onJumpHighlight={jumpToHighlight}
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
      </main>
    </div>
  );
};
