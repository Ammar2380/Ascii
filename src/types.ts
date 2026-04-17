export type AsciiSettings = {
  cols: number;
  fontSize: number;
  fps: number;
  chars: string;
  color: string;
  invert: boolean;
  mirror: boolean;
  colorMode: 'solid' | 'source' | 'neon';
  edge: boolean;
  glitch: boolean;
  noise: boolean;
  brightness: number;
  contrast: number;
  gamma: number;
  overlayText: string;
  overlayTextSize: number;
};

export type Snapshot = {
  id: string;
  dataUrl: string;
  timestamp: number;
};

export const CHAR_PRESETS = [
  { name: 'DENSE', chars: '@#S%?*+;:,. ' },
  { name: 'BLOCK', chars: '█▓▒░ ' },
  { name: 'ALPHA', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ' },
  { name: 'BINARY', chars: '01 ' },
  { name: 'ARABIC', chars: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي ' },
  { name: 'STARS', chars: '✦✧★☆◆◇●○◉ ' },
];

export const COLOR_PALETTE = [
  { name: 'Matrix', color: '#00ff41' },
  { name: 'Danger', color: '#ff3c3c' },
  { name: 'Cyan', color: '#3cf0ff' },
  { name: 'Gold', color: '#ffcc00' },
  { name: 'Pink', color: '#ff69b4' },
  { name: 'White', color: '#ffffff' },
  { name: 'Teal', color: '#00ffcc' },
  { name: 'Acid', color: '#aaff00' },
];
