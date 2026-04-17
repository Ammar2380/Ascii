import React, { useRef, useEffect, useState } from 'react';
import { AsciiSettings } from '../types';

interface AsciiCanvasProps {
  settings: AsciiSettings;
  videoRef: React.RefObject<HTMLVideoElement>;
  onFrame?: (canvas: HTMLCanvasElement) => void;
}

export const AsciiCanvas: React.FC<AsciiCanvasProps> = ({ settings, videoRef, onFrame }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameTimerRef = useRef<number>(0);

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended || !video.videoWidth) return;

    const offscreen = offscreenRef.current;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    const ctx = canvas.getContext('2d');
    if (!offCtx || !ctx) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const aspect = vh / vw;
    const cols = settings.cols;
    const cellW = settings.fontSize * 0.6;
    const cellH = settings.fontSize;
    const rows = Math.floor(cols * aspect * 0.5);

    offscreen.width = cols;
    offscreen.height = rows;

    offCtx.save();
    if (settings.mirror) {
      offCtx.translate(cols, 0);
      offCtx.scale(-1, 1);
    }
    offCtx.drawImage(video, 0, 0, cols, rows);
    offCtx.restore();

    const imgData = offCtx.getImageData(0, 0, cols, rows);
    const data = imgData.data;

    // Brightness/Contrast/Gamma
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        let v = data[i + c];
        v = Math.pow(v / 255, settings.gamma) * 255;
        v = ((v - 128) * settings.contrast) + 128 + settings.brightness;
        data[i + c] = Math.max(0, Math.min(255, v));
      }
    }

    canvas.width = Math.round(cols * cellW);
    canvas.height = Math.round(rows * cellH);

    // Background
    ctx.fillStyle = settings.invert ? settings.color : '#050a05';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `bold ${settings.fontSize}px 'Share Tech Mono', monospace`;
    ctx.textBaseline = 'top';

    const chars = settings.chars;
    const charLen = chars.length;
    
    // Prepare color components
    const hexC = settings.color;
    const r0 = parseInt(hexC.slice(1, 3), 16);
    const g0 = parseInt(hexC.slice(3, 5), 16);
    const b0 = parseInt(hexC.slice(5, 7), 16);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 4;
        let brightness = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;

        if (settings.noise) {
          brightness = Math.max(0, Math.min(1, brightness + (Math.random() - 0.5) * 0.3));
        }

        let gc = c, gr = r;
        if (settings.glitch && Math.random() < 0.005) {
          gc = Math.floor(Math.random() * cols);
          gr = Math.floor(Math.random() * rows);
        }

        const charIdx = settings.invert
          ? charLen - 1 - Math.floor(brightness * (charLen - 1))
          : Math.floor(brightness * (charLen - 1));
        
        const ch = chars[charIdx];
        if (!ch || ch === ' ') continue;

        if (settings.colorMode === 'source') {
          ctx.fillStyle = `rgb(${data[idx]},${data[idx + 1]},${data[idx + 2]})`;
        } else if (settings.colorMode === 'neon') {
           // Neon gradient based on position
           const hue = (c / cols * 60) + (r / rows * 60) + 180;
           ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${brightness})`;
        } else {
          const alpha = settings.invert ? (1 - brightness) * 0.8 + 0.2 : brightness * 0.8 + 0.2;
          ctx.fillStyle = `rgba(${r0},${g0},${b0},${alpha.toFixed(2)})`;
        }

        ctx.fillText(ch, Math.round(gc * cellW), Math.round(gr * cellH));
      }
    }

    // Overlay Text
    if (settings.overlayText.trim()) {
      ctx.font = `bold ${settings.overlayTextSize}px 'Orbitron', monospace`;
      ctx.fillStyle = settings.color;
      ctx.globalAlpha = 0.8;
      ctx.textBaseline = 'bottom';
      ctx.fillText(settings.overlayText.toUpperCase(), 20, canvas.height - 20);
      ctx.globalAlpha = 1;
    }

    if (onFrame) onFrame(canvas);
  };

  const animate = (time: number) => {
    const fpsInterval = 1000 / settings.fps;
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;
    frameTimerRef.current += dt;

    if (frameTimerRef.current >= fpsInterval) {
      frameTimerRef.current = 0;
      renderFrame();
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [settings]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full h-auto border border-cyber-green/20 shadow-[0_0_30px_rgba(0,255,65,0.05)] rounded-sm"
    />
  );
};
