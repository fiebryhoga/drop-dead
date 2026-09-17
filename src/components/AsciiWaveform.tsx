"use client";

import React, { useEffect, useRef } from "react";

interface AsciiWaveformProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  height?: number;
  className?: string;
  color?: string;
}

export const AsciiWaveform: React.FC<AsciiWaveformProps> = ({
  analyserNode,
  isPlaying,
  barCount = 48,
  barWidth = 4,
  barGap = 3,
  height = 70,
  className = "",
  color = "#FFFFFF",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const idlePhaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const totalWidth = barCount * (barWidth + barGap);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = totalWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${height}px`;

    let dataArray: Uint8Array | null = null;
    if (analyserNode) {
      dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    }

    const render = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, totalWidth, height);

      const centerY = height / 2;

      // Draw Center Baseline Dot-Line
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(0, centerY - 0.5, totalWidth, 1);

      if (isPlaying && analyserNode && dataArray) {
        analyserNode.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);
      }

      idlePhaseRef.current += 0.04;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + barGap);
        let amplitude = 0;

        if (isPlaying && analyserNode && dataArray) {
          // Sample frequency bin with bell curve weighting for aesthetic display
          const binIndex = Math.floor((i / barCount) * (dataArray.length * 0.45));
          const rawVal = dataArray[binIndex] || 0;
          // Normalized 0 to 1 with noise
          amplitude = Math.min(1, Math.max(0.08, rawVal / 255));
        } else {
          // Idle gentle breathing sine wave animation
          const wave = Math.sin(idlePhaseRef.current + i * 0.25) * 0.5 + 0.5;
          const centerDist = Math.abs(i - barCount / 2) / (barCount / 2);
          const bell = Math.cos(centerDist * Math.PI * 0.45);
          amplitude = (0.1 + wave * 0.25) * bell;
        }

        const barHeight = Math.max(4, amplitude * (height * 0.85));
        const topY = centerY - barHeight / 2;

        // Draw segmented / dot-matrix blocks for each bar
        const segmentHeight = 3;
        const segmentGap = 1.5;
        const totalSegments = Math.floor(barHeight / (segmentHeight + segmentGap));

        for (let s = 0; s < totalSegments; s++) {
          const segY = topY + s * (segmentHeight + segmentGap);

          // Top/bottom edge alpha gradient
          const distFromCenter = Math.abs(segY - centerY) / (height / 2);
          const alpha = 1 - distFromCenter * 0.3;

          ctx.fillStyle = isPlaying
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(180, 195, 215, ${alpha * 0.6})`;
          
          ctx.fillRect(x, segY, barWidth, segmentHeight);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [analyserNode, isPlaying, barCount, barWidth, barGap, height, color]);

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
      />
    </div>
  );
};
