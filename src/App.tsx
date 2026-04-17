import React, { useState, useRef, useCallback } from 'react';
import { AsciiCanvas } from './components/AsciiCanvas';
import { Controls } from './components/Controls';
import { AIAssistant } from './components/AIAssistant';
import { AsciiSettings, Snapshot, CHAR_PRESETS } from './types';
import { Camera, Download, History, Play, StopCircle, Github, Instagram, Twitter } from 'lucide-react';

const DEFAULT_SETTINGS: AsciiSettings = {
  cols: 100,
  fontSize: 10,
  fps: 20,
  chars: CHAR_PRESETS[0].chars,
  color: '#00ff41',
  invert: false,
  mirror: true,
  colorMode: 'solid',
  edge: false,
  glitch: false,
  noise: false,
  brightness: 0,
  contrast: 1,
  gamma: 1,
  overlayText: '',
  overlayTextSize: 32,
};

export default function App() {
  const [settings, setSettings] = useState<AsciiSettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsRunning(true);
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Neural link failed: Camera access denied.");
    }
  };

  const stopCamera = () => {
    setIsRunning(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const takeSnapshot = useCallback(() => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const newSnap: Snapshot = {
      id: Math.random().toString(36).substr(2, 9),
      dataUrl,
      timestamp: Date.now(),
    };
    
    setSnapshots(prev => [newSnap, ...prev]);
  }, []);

  const getFrameData = useCallback(() => {
    return canvasRef.current ? canvasRef.current.toDataURL('image/jpeg', 0.8) : null;
  }, []);

  return (
    <div className="min-h-screen bg-soph-bg text-soph-text-main flex flex-col selection:bg-white selection:text-black">
      {/* Header HUD */}
      <header className="h-[64px] border-b border-soph-border bg-soph-bg px-6 flex justify-between items-center z-50">
        <div className="flex flex-col">
          <h1 className="font-serif italic text-xl tracking-wider text-white">
            ASCII <span className="text-soph-text-dim">PRO</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-soph-text-dim uppercase">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-white' : 'bg-white/20'}`} />
            <span>{isRunning ? 'LIVE_STREAM' : 'SYSTEM_IDLE'}</span>
          </div>
          <div className="flex items-center gap-3 border-l border-soph-border pl-6">
             <button className="cyber-button">Gallery</button>
             <button onClick={isRunning ? stopCamera : startCamera} className="cyber-button btn-primary">
               {isRunning ? 'Disconnect' : 'Connect Camera'}
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Controls */}
        <aside className="w-full lg:w-[280px] border-r border-soph-border bg-soph-bg overflow-y-auto scrollbar-hide">
          <Controls settings={settings} setSettings={setSettings} />
        </aside>

        {/* Center: Camera Feed */}
        <section className="flex-1 relative bg-black flex flex-col items-center justify-center p-10 overflow-hidden">
          <span className="label-micro text-center mb-6">RENDER PREVIEW (1080x1080)</span>
          
          <div className="relative">
             <div className="border border-soph-border bg-black shadow-[0_0_60px_rgba(255,255,255,0.03)] overflow-hidden">
               {isRunning ? (
                 <AsciiCanvas 
                   settings={settings} 
                   videoRef={videoRef} 
                   onFrame={canvas => { canvasRef.current = canvas; }}
                 />
               ) : (
                 <div className="w-[440px] max-w-full aspect-square flex flex-col items-center justify-center gap-6">
                   <Camera className="w-12 h-12 opacity-10" />
                   <button 
                     onClick={startCamera}
                     className="cyber-button btn-primary px-8"
                   >
                     Initialize Camera
                   </button>
                 </div>
               )}
             </div>

             {/* Export Footer */}
             <div className="flex justify-center gap-3 mt-8">
               <div className="px-3 py-1.5 rounded-full border border-soph-accent text-soph-accent text-[10px] uppercase tracking-wide">Square (1:1)</div>
               <div className="px-3 py-1.5 rounded-full border border-soph-border text-soph-text-dim text-[10px] uppercase tracking-wide">Portrait (4:5)</div>
               <div className="px-3 py-1.5 rounded-full border border-soph-border text-soph-text-dim text-[10px] uppercase tracking-wide">Story (9:16)</div>
             </div>
             
             <div className="font-serif italic text-sm opacity-30 text-center mt-6">
               Crafted for the digital curator.
             </div>
          </div>

          {/* Floaters */}
          <div className="absolute bottom-10 right-10 flex flex-col gap-2 z-40">
            {isRunning && (
              <button 
                onClick={takeSnapshot}
                className="cyber-button flex items-center gap-2 bg-white text-black border-none py-3"
              >
                <Camera className="w-4 h-4" />
                Snapshot
              </button>
            )}
          </div>
        </section>

        {/* Right Side: AI Assistant & Gallery */}
        <aside className="w-full lg:w-[280px] border-l border-soph-border bg-soph-bg flex flex-col">
          <div className="flex-1">
            <AIAssistant getFrame={getFrameData} />
          </div>
          
          <div className="h-64 border-t border-soph-border bg-black/20 flex flex-col">
            <header className="p-3 border-b border-soph-border flex justify-between items-center">
              <span className="label-micro mb-0">Cache</span>
              <History className="w-3.5 h-3.5 text-soph-text-dim" />
            </header>
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex p-4 gap-4 scrollbar-hide">
              {snapshots.map(snap => (
                <div key={snap.id} className="relative group flex-shrink-0">
                  <img 
                    src={snap.dataUrl} 
                    className="h-full border border-soph-border hover:border-soph-accent transition-all cursor-pointer" 
                    alt="Captured"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <a href={snap.dataUrl} download={`ascii-${snap.id}.png`} className="p-2 bg-white text-black rounded-full scale-75 hover:scale-100 transition-transform">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>


      <video ref={videoRef} className="hidden" playsInline muted />
    </div>
  );
}
