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

    const subWidth = subMatrix ? subMatrix[0].length * (dotSize * 0.7 + gap) : 0;
    const subHeight = subMatrix ? subMatrix.length * (dotSize * 0.7 + gap) : 0;

    const padding = 20;
    const totalWidth = Math.max(mainWidth, subWidth) + padding * 2;
    const totalHeight = mainHeight + (subMatrix ? subHeight + 16 : 0) + padding * 2;

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

    // Draw Subtext (if any, e.g. "Olivia Rodrigo")
    if (subMatrix) {
      const sDotSize = Math.max(2, Math.round(dotSize * 0.6));
      const sCharStep = sDotSize + gap;
      const sActualWidth = subMatrix[0].length * sCharStep;
      const sStartX = (totalWidth - sActualWidth) / 2;
      const sStartY = startY + mainHeight + 14;

      for (let r = 0; r < subMatrix.length; r++) {
        for (let c = 0; c < subMatrix[r].length; c++) {
          if (subMatrix[r][c]) {
            const x = sStartX + c * sCharStep;
            const y = sStartY + r * sCharStep;

            if (glow) {
              ctx.shadowColor = "rgba(220, 220, 255, 0.8)";
              ctx.shadowBlur = 4;
            }

            ctx.fillStyle = "rgba(220, 230, 245, 0.9)";
            ctx.fillRect(x, y, sDotSize, sDotSize);
          }
        }
      }
    }
  }, [text, subText, dotSize, gap, glow, color, scanlines]);

  return (
    <div className={`flex items-center justify-center overflow-x-auto select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="max-w-full drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-300"
      />
    </div>
  );
};
