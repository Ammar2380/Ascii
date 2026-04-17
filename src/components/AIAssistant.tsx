import React, { useState } from 'react';
import { describeScene } from '../lib/gemini';
import { Brain, Loader2, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  getFrame: () => string | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ getFrame }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ description: string; caption: string } | null>(null);

  const analyze = async () => {
    const frame = getFrame();
    if (!frame) return;
    
    setLoading(true);
    const base64 = frame.split(',')[1];
    const data = await describeScene(base64);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="label-micro">AI Prompt Generator</span>
        <div className="prompt-box min-h-[120px] flex items-center justify-center text-center">
          {result ? `"${result.description}"` : '"Analyze the binary stream to decode the visual essence of the subject."'}
        </div>
        <button 
          onClick={analyze}
          disabled={loading}
          className="cyber-button w-full py-3 bg-white text-black border-none font-bold text-xs"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            'Generate Neural Prompt'
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <span className="label-micro">Suggested Caption</span>
              <div className="bg-soph-surface border border-soph-border p-4 font-mono text-[11px] text-soph-text-main leading-relaxed">
                {result.caption}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(result.caption)}
                className="text-[10px] text-soph-text-dim uppercase tracking-wider self-end hover:text-white transition-colors"
              >
                Copy String
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
