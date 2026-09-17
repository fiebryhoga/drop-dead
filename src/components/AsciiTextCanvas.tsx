"use client";

import React, { useEffect, useRef } from "react";
import { stringToMatrix } from "@/utils/asciiFont";

interface AsciiTextCanvasProps {
  text: string;
  subText?: string;
  dotSize?: number;
  gap?: number;
  glow?: boolean;
  color?: string;
  scanlines?: boolean;
  className?: string;
}

export const AsciiTextCanvas: React.FC<AsciiTextCanvasProps> = ({
  text,
  subText,
  dotSize = 5,
  gap = 2,
  glow = true,
  color = "#FFFFFF",
  scanlines = true,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mainMatrix = stringToMatrix(text || " ");
    const subMatrix = subText ? stringToMatrix(subText) : null;

    const charPixelStep = dotSize + gap;
    const mainWidth = mainMatrix[0].length * charPixelStep;
    const mainHeight = mainMatrix.length * charPixelStep;

    const sDotSize = Math.max(2, Math.round(dotSize * 0.42));
    const sGap = Math.max(1, gap * 0.7);
    const sCharStep = sDotSize + sGap;
    const subWidth = subMatrix ? subMatrix[0].length * sCharStep : 0;
    const subHeight = subMatrix ? subMatrix.length * sCharStep : 0;

    const padding = 20;
    const totalWidth = Math.max(mainWidth, subWidth) + padding * 2;
    const totalHeight = mainHeight + (subMatrix ? subHeight + 12 : 0) + padding * 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${totalHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, totalWidth, totalHeight);

    // Draw Main Text Matrix
    const startX = (totalWidth - mainWidth) / 2;
    const startY = padding;

    for (let r = 0; r < mainMatrix.length; r++) {
      for (let c = 0; c < mainMatrix[r].length; c++) {
        if (mainMatrix[r][c]) {
          const x = startX + c * charPixelStep;
          const y = startY + r * charPixelStep;

          // Glow effect
          if (glow) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
          }

          ctx.fillStyle = color;
          // Render rounded rect / pill dot matrix
          ctx.fillRect(x, y, dotSize, dotSize);

          // Horizontal scanlines through each dot
          if (scanlines) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.fillRect(x, y + Math.floor(dotSize / 2), dotSize, 1);
          }
        }
      }
    }

    // Draw Subtext (e.g. "Olivia Rodrigo" scaled smaller)
    if (subMatrix) {
      const sActualWidth = subMatrix[0].length * sCharStep;
      const sStartX = (totalWidth - sActualWidth) / 2;
      const sStartY = startY + mainHeight + 12;

      for (let r = 0; r < subMatrix.length; r++) {
        for (let c = 0; c < subMatrix[r].length; c++) {
          if (subMatrix[r][c]) {
            const x = sStartX + c * sCharStep;
            const y = sStartY + r * sCharStep;

            if (glow) {
              ctx.shadowColor = "rgba(200, 215, 240, 0.6)";
              ctx.shadowBlur = 3;
            }

            ctx.fillStyle = "rgba(200, 215, 235, 0.8)";
            ctx.fillRect(x, y, sDotSize, sDotSize);
          }
        }
      }
    }
  }, [text, subText, dotSize, gap, glow, color, scanlines]);

  return (
    <div
      key={`${text}-${subText || ""}`}
      className={`flex items-center justify-center overflow-x-auto select-none animate-lyric-smooth ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="max-w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
      />
    </div>
  );
};
