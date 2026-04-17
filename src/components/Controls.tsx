import React from 'react';
import { AsciiSettings, CHAR_PRESETS, COLOR_PALETTE } from '../types';
import { Sliders, Zap, Palette, Type, Filter } from 'lucide-react';

interface ControlsProps {
  settings: AsciiSettings;
  setSettings: React.Dispatch<React.SetStateAction<AsciiSettings>>;
}

export const Controls: React.FC<ControlsProps> = ({ settings, setSettings }) => {
  const updateSetting = <K extends keyof AsciiSettings>(key: K, value: AsciiSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-8 p-6 h-full overflow-y-auto pb-20 scrollbar-hide">
      {/* Preset Buttons */}
      <section className="flex flex-col">
        <span className="label-micro">Character Set</span>
        <div className="grid grid-cols-2 gap-2">
          {CHAR_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => updateSetting('chars', preset.chars)}
              className={`flex items-center justify-center h-10 text-[12px] border transition-all font-mono ${
                settings.chars === preset.chars 
                ? 'bg-white/5 border-soph-accent text-white' 
                : 'bg-soph-surface border-soph-border text-soph-text-dim hover:border-soph-text-main'
              }`}
            >
              {preset.chars.substring(0, 4)}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders Section */}
      <section className="flex flex-col gap-2">
        <span className="label-micro">Refinement</span>
        
        <div className="flex flex-col gap-4">
          <Slider label="Density" min={40} max={220} step={10} value={settings.cols} onChange={v => updateSetting('cols', v)} />
          <Slider label="Refresh" min={5} max={60} step={5} value={settings.fps} onChange={v => updateSetting('fps', v)} />
          <Slider label="Scaling" min={6} max={24} step={1} value={settings.fontSize} onChange={v => updateSetting('fontSize', v)} />
          <Slider label="Contrast" min={0.5} max={3} step={0.1} value={settings.contrast} onChange={v => updateSetting('contrast', v)} />
        </div>
      </section>

      {/* Color Section */}
      <section className="flex flex-col gap-4">
        <span className="label-micro">Color Palette</span>
        <div className="flex gap-2">
          {COLOR_PALETTE.slice(0, 4).map(pal => (
            <button
              key={pal.name}
              onClick={() => updateSetting('color', pal.color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                settings.color === pal.color ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: pal.color }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <ToggleButton label="Source" active={settings.colorMode === 'source'} onClick={() => updateSetting('colorMode', settings.colorMode === 'source' ? 'solid' : 'source')} />
          <ToggleButton label="Neon" active={settings.colorMode === 'neon'} onClick={() => updateSetting('colorMode', settings.colorMode === 'neon' ? 'solid' : 'neon')} />
        </div>
      </section>

      {/* Effects Toggles */}
      <section className="flex flex-col gap-2">
        <span className="label-micro">Overrides</span>
        <div className="grid grid-cols-2 gap-2">
          <ToggleButton label="Invert" active={settings.invert} onClick={() => updateSetting('invert', !settings.invert)} />
          <ToggleButton label="Mirror" active={settings.mirror} onClick={() => updateSetting('mirror', !settings.mirror)} />
          <ToggleButton label="Glitch" active={settings.glitch} onClick={() => updateSetting('glitch', !settings.glitch)} />
          <ToggleButton label="Edge" active={settings.edge} onClick={() => updateSetting('edge', !settings.edge)} />
        </div>
      </section>
    </div>
  );
};

const Slider = ({ label, min, max, step, value, onChange }: { label: string, min: number, max: number, step: number, value: number, onChange: (v: number) => void }) => (
  <div className="flex justify-between items-center border-b border-white/5 py-2">
    <span className="text-[12px] text-soph-text-main">{label}</span>
    <div className="flex items-center gap-3">
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-24"
      />
      <span className="text-[12px] font-mono text-soph-text-dim w-8 text-right">
        {label === 'Density' ? `${Math.round((value/220)*100)}%` : value.toFixed(step < 1 ? 1 : 0)}
      </span>
    </div>
  </div>
);

const ToggleButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-2 py-2 text-[10px] tracking-widest border transition-all uppercase ${
      active 
      ? 'border-soph-accent text-white bg-white/5' 
      : 'border-soph-border text-soph-text-dim bg-soph-surface'
    }`}
  >
    {label}
  </button>
);
