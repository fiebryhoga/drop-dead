"use client";

import React, { useEffect, useRef } from "react";

interface AsciiVideoBackgroundProps {
  currentTime: number;
  isPlaying: boolean;
  videoStartTime?: number; // 19.0s
  className?: string;
}

// ASCII character luminance ramp matching the screenshot (dots, dashes, letters, dense 8s and bs)
const ASCII_CHARS = "   ..::--++==iissbb88@@";

export const AsciiVideoBackground: React.FC<AsciiVideoBackgroundProps> = ({
  currentTime,
  isPlaying,
  videoStartTime = 19.0,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isVideoActive = currentTime >= videoStartTime;

  // Sync video play/pause and time with audio
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoActive) {
      const targetVideoTime = (currentTime - videoStartTime) % (video.duration || 10);
      if (Math.abs(video.currentTime - targetVideoTime) > 0.3) {
        video.currentTime = targetVideoTime;
      }

      if (isPlaying && video.paused) {
        video.play().catch(() => {});
      } else if (!isPlaying && !video.paused) {
        video.pause();
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
      video.currentTime = 0;
    }
  }, [currentTime, isPlaying, isVideoActive, videoStartTime]);

  // Real-time Fullscreen ASCII Video Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
    const offscreen = offscreenCanvasRef.current;
    const offscreenCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offscreenCtx) return;

    const cellWidth = 7;
    const cellHeight = 10;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const cols = Math.ceil(width / cellWidth);
      const rows = Math.ceil(height / cellHeight);

      offscreen.width = cols;
      offscreen.height = rows;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cols = offscreen.width;
      const rows = offscreen.height;

      if (isVideoActive && video.readyState >= 2) {
        // Draw video to offscreen canvas covering full screen aspect ratio
        const vWidth = video.videoWidth || 640;
        const vHeight = video.videoHeight || 360;
        const vAspect = vWidth / vHeight;
        const sAspect = width / height;

        let drawW = cols;
        let drawH = rows;
        let startX = 0;
        let startY = 0;

        if (sAspect > vAspect) {
          drawH = Math.round(cols / vAspect);
          startY = Math.round((rows - drawH) / 2);
        } else {
          drawW = Math.round(rows * vAspect);
          startX = Math.round((cols - drawW) / 2);
        }

        offscreenCtx.fillStyle = "#000000";
        offscreenCtx.fillRect(0, 0, cols, rows);
        offscreenCtx.drawImage(video, startX, startY, drawW, drawH);

        const imgData = offscreenCtx.getImageData(0, 0, cols, rows).data;

        // Clear display canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${cellHeight}px monospace`;
        ctx.textBaseline = "top";

        const rampLen = ASCII_CHARS.length;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const red = imgData[idx];
            const green = imgData[idx + 1];
            const blue = imgData[idx + 2];

            const lum = 0.299 * red + 0.587 * green + 0.114 * blue;

            // Threshold out dark hair / deep background shadows
            if (lum > 18) {
              // Gamma curve boost for skin tones and midtones (makes face luminous white)
              const normalized = Math.max(0, Math.min(1, (lum - 12) / 220));
              const boosted = Math.pow(normalized, 0.5) * 255;

              const charIdx = Math.min(
                rampLen - 1,
                Math.floor((boosted / 255) * rampLen)
              );
              const char = ASCII_CHARS[charIdx];

              if (char !== " ") {
                // Bright, crisp white phosphor glow for skin and face
                const alpha = Math.min(1, Math.max(0.6, boosted / 180));
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

                ctx.fillText(char, c * cellWidth, r * cellHeight);
              }
            }
          }
        }
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVideoActive]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none select-none z-0 transition-opacity duration-700 overflow-hidden flex items-center justify-center ${
        isVideoActive ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {/* Hidden Video Source */}
      <video
        ref={videoRef}
        src="/video/vd.mp4"
        muted
        playsInline
        loop
        preload="auto"
        className="hidden"
      />

      {/* Fullscreen ASCII Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover"
      />
    </div>
  );
};
