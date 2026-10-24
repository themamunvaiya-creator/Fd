import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Maximize2, Heart, Bot, Volume2, Sparkles, X } from 'lucide-react';
import { AppMode } from '../types';

interface FloatingMiniWidgetProps {
  mode: AppMode;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  onToggleListen: () => void;
  onExpand: () => void;
  lastReply?: string;
  onSwitchMode: (newMode: AppMode) => void;
}

export const FloatingMiniWidget: React.FC<FloatingMiniWidgetProps> = ({
  mode,
  state,
  onToggleListen,
  onExpand,
  lastReply,
  onSwitchMode,
}) => {
  const [showBubble, setShowBubble] = useState(true);
  const isGirlfriend = mode === 'girlfriend';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Speech Bubble Popup */}
      <AnimatePresence>
        {lastReply && showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`mb-3 max-w-[280px] p-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs leading-relaxed relative ${
              isGirlfriend
                ? 'bg-rose-950/90 border-pink-500/40 text-pink-100 shadow-pink-900/30'
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-100 shadow-cyan-900/30'
            }`}
          >
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-600 hover:text-white"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {isGirlfriend ? (
                <>
                  <Heart size={13} className="text-pink-400 fill-pink-400" />
                  <span className="text-pink-300">মিতা (জান)</span>
                </>
              ) : (
                <>
                  <Bot size={13} className="text-cyan-400" />
                  <span className="text-cyan-300">মিতা (অ্যাসিস্ট্যান্ট)</span>
                </>
              )}
            </div>
            <p className="line-clamp-4">{lastReply}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Capsule Widget */}
      <motion.div
        drag
        dragConstraints={{ left: -250, right: 10, top: -450, bottom: 10 }}
        dragElastic={0.1}
        className={`flex items-center gap-2 p-2 pr-3.5 rounded-full shadow-2xl backdrop-blur-xl border transition-all cursor-grab active:cursor-grabbing ${
          isGirlfriend
            ? 'bg-gradient-to-r from-rose-950/95 via-pink-950/90 to-purple-950/90 border-pink-500/50 shadow-pink-500/25 ring-2 ring-pink-500/20'
            : 'bg-gradient-to-r from-slate-950/95 via-cyan-950/90 to-blue-950/90 border-cyan-500/50 shadow-cyan-500/25 ring-2 ring-cyan-500/20'
        }`}
      >
        {/* Animated Mini Voice Orb Button */}
        <button
          onClick={onToggleListen}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center p-0.5 text-white transition-transform active:scale-95 focus:outline-none ${
            isGirlfriend
              ? 'bg-gradient-to-tr from-pink-600 to-rose-400 shadow-lg shadow-pink-500/40'
              : 'bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/40'
          }`}
          title="কথা বলুন / শুনুন"
        >
          {state === 'listening' ? (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-full h-full rounded-full flex items-center justify-center bg-rose-600 text-white"
            >
              <Mic size={20} className="animate-pulse" />
            </motion.div>
          ) : state === 'speaking' ? (
            <div className="flex items-center gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [6, 18, 6] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1 bg-white rounded-full"
                />
              ))}
            </div>
          ) : (
            <div className="relative">
              {isGirlfriend ? (
                <Heart size={20} className="fill-white drop-shadow" />
              ) : (
                <Sparkles size={20} className="text-white drop-shadow" />
              )}
            </div>
          )}

          {/* Pulse ring when active */}
          {(state === 'listening' || state === 'speaking') && (
            <span
              className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                isGirlfriend ? 'bg-pink-500' : 'bg-cyan-400'
              }`}
            />
          )}
        </button>

        {/* Info & Status Label */}
        <div className="flex flex-col text-left pl-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">মিতা AI</span>
            <button
              onClick={() => onSwitchMode(isGirlfriend ? 'assistant' : 'girlfriend')}
              className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${
                isGirlfriend
                  ? 'bg-pink-500/30 text-pink-300 hover:bg-pink-500/50'
                  : 'bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/50'
              }`}
              title="মুড পরিবর্তন করুন"
            >
              {isGirlfriend ? '💖 গার্লফ্রেন্ড' : '💼 সহকারী'}
            </button>
          </div>
          <span className="text-[10px] text-slate-300 font-light truncate max-w-[100px]">
            {state === 'listening'
              ? 'শুনছি...'
              : state === 'speaking'
              ? 'কথা বলছি...'
              : state === 'thinking'
              ? 'ভাবছি...'
              : 'একটিভ আছে'}
          </span>
        </div>

        {/* Expand to Full Phone UI Button */}
        <button
          onClick={onExpand}
          className="p-1.5 ml-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="পূর্ণাঙ্গ মোবাইল অ্যাপ ভিউ"
        >
          <Maximize2 size={15} />
        </button>
      </motion.div>
    </div>
  );
};
