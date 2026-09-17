"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface TiltValues {
  x: number; // Normalized -1 to 1 (left to right)
  y: number; // Normalized -1 to 1 (top to bottom)
  rotateX: number; // in degrees
  rotateY: number; // in degrees
  isGyroActive: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
}

export function useDeviceTilt(maxTiltDeg = 15): TiltValues {
  const [tilt, setTilt] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Check iOS permission requirement
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === "function"
    ) {
      setNeedsPermission(true);
    }
  }, []);

  // Auto-request permission on user interaction for iOS Safari
  useEffect(() => {
    const handleFirstInteraction = async () => {
      const DeviceEvent = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DeviceEvent.requestPermission === "function") {
        try {
          const response = await DeviceEvent.requestPermission();
          if (response === "granted") {
            setNeedsPermission(false);
            setIsGyroActive(true);
          }
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  // Request permission for iOS Safari
  const requestPermission = useCallback(async () => {
    const DeviceEvent = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DeviceEvent.requestPermission === "function") {
      try {
        const response = await DeviceEvent.requestPermission();
        if (response === "granted") {
          setNeedsPermission(false);
          setIsGyroActive(true);
        }
      } catch (err) {
        console.warn("DeviceOrientation permission error:", err);
      }
    }
  }, []);

  // Smooth lerp animation loop
  useEffect(() => {
    const updateLoop = () => {
      // Lerp smoothing
      const ease = 0.12;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease;

      const normX = currentRef.current.x;
      const normY = currentRef.current.y;

      setTilt({
        x: normX,
        y: normY,
        rotateX: -normY * maxTiltDeg,
        rotateY: normX * maxTiltDeg,
      });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    updateLoop();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [maxTiltDeg]);

  // Handle Gyroscope / DeviceOrientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      setIsGyroActive(true);
      setNeedsPermission(false);

      // Gamma: roll (-90 to 90), Beta: pitch (-180 to 180)
      // Normal holding position is around beta: 45deg
      const gamma = Math.max(-45, Math.min(45, e.gamma));
      const beta = Math.max(0, Math.min(90, e.beta)) - 45;

      targetRef.current.x = gamma / 45;
      targetRef.current.y = beta / 45;
    };

    // Handle Mouse move for Desktop fallback
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      targetRef.current.x = Math.max(-1, Math.min(1, x));
      targetRef.current.y = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return {
    ...tilt,
    isGyroActive,
    needsPermission,
    requestPermission,
  };
}
