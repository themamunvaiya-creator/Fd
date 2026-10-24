import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Heart, Sparkles, Radio } from 'lucide-react';
import { AppMode } from '../types';

interface VoiceOrbProps {
  mode: AppMode;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  onToggleListen: () => void;
  emotion?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  mode,
  state,
  onToggleListen,
  emotion,
}) => {
  const isGirlfriend = mode === 'girlfriend';

  // State colors
  const primaryGlow = isGirlfriend
    ? 'rgba(244, 63, 94, 0.65)'
    : 'rgba(6, 182, 212, 0.65)';
  const secondaryGlow = isGirlfriend
    ? 'rgba(236, 72, 153, 0.45)'
    : 'rgba(59, 130, 246, 0.45)';

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4">
      {/* Outer Ripple Rings for Listening */}
      {state === 'listening' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            className={`w-44 h-44 rounded-full border-2 ${
              isGirlfriend ? 'border-pink-500/50' : 'border-cyan-400/50'
            }`}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className={`w-44 h-44 rounded-full border-2 ${
              isGirlfriend ? 'border-rose-400/30' : 'border-blue-400/30'
            }`}
          />
        </div>
      )}

      {/* Floating Hearts in Girlfriend Mode */}
      {isGirlfriend && state === 'speaking' && (
        <div className="absolute -top-6 flex gap-8 pointer-events-none">
          <motion.div
            animate={{ y: [-10, -35], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="text-pink-400"
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, -40], opacity: [0, 1, 0], scale: [0.6, 1.1, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 0.8 }}
            className="text-rose-400"
          >
            <Heart size={16} fill="currentColor" />
          </motion.div>
        </div>
      )}

      {/* Main Interactive Orb Button */}
      <motion.button
        onClick={onToggleListen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="relative group focus:outline-none cursor-pointer"
        aria-label="মিতা এআই ভয়েস নিয়ন্ত্রণ"
      >
        {/* Glow Aura */}
        <div
          className="absolute -inset-4 rounded-full filter blur-xl transition-all duration-700 opacity-80"
          style={{
            background: `radial-gradient(circle, ${primaryGlow} 0%, ${secondaryGlow} 70%, transparent 100%)`,
          }}
        />

        {/* Ambient Ring for Assistant Holographic Tech Look */}
        {!isGirlfriend && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-dashed border-cyan-400/40 pointer-events-none"
          />
        )}

        {/* Main Sphere Body */}
        <div
          className={`relative w-36 h-36 rounded-full flex items-center justify-center p-1 shadow-2xl backdrop-blur-md transition-all duration-500 ${
            isGirlfriend
              ? 'bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-300 ring-4 ring-pink-400/30 shadow-pink-500/40'
              : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 ring-4 ring-cyan-400/30 shadow-cyan-500/40'
          }`}
        >
          {/* Inner Gloss reflection */}
          <div className="absolute top-2 left-4 w-12 h-6 bg-white/30 rounded-full blur-[2px] transform -rotate-12 pointer-events-none" />

          {/* Center Visual Content */}
          <div className="flex flex-col items-center justify-center text-white z-10">
            {state === 'speaking' ? (
              <div className="flex items-center gap-1.5 h-12">
                {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5].map((delay, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      height: [10, 36, 14, 42, 12][idx % 5],
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: delay * 0.2,
                    }}
                    className={`w-1.5 rounded-full ${
                      isGirlfriend ? 'bg-white shadow-[0_0_8px_#fff]' : 'bg-cyan-200 shadow-[0_0_8px_#38bdf8]'
                    }`}
                  />
                ))}
              </div>
            ) : state === 'listening' ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Mic size={32} className="text-white drop-shadow" />
                </div>
              </motion.div>
            ) : state === 'thinking' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="p-3"
              >
                <Sparkles size={34} className="text-amber-200" />
              </motion.div>
            ) : (
              // Idle state
              <div className="flex flex-col items-center">
                {isGirlfriend ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={34} fill="#fff" className="text-white drop-shadow-md" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Radio size={34} className="text-white drop-shadow-md" />
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.button>

      {/* State Caption & Sweet Emotion */}
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-lg backdrop-blur-md">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              state === 'listening'
                ? 'bg-rose-500 animate-ping'
                : state === 'speaking'
                ? 'bg-emerald-400 animate-pulse'
                : state === 'thinking'
                ? 'bg-amber-400 animate-spin'
                : 'bg-slate-400'
            }`}
          />
          <span className="text-xs font-medium text-slate-200">
            {state === 'listening'
              ? isGirlfriend ? 'মন দিয়ে শুনছি সোনা, বলো...' : 'শুনছি, আপনার কমান্ড দিন...'
              : state === 'speaking'
              ? isGirlfriend ? 'মিতা কথা বলছে...' : 'মিতা উত্তর দিচ্ছে...'
              : state === 'thinking'
              ? 'মিতা ভাবছে ও প্রসেস করছে...'
              : isGirlfriend ? 'বাবু, চাপ দিয়ে কথা বলো 💖' : 'ট্যাপ করে কথা বলুন'}
          </span>
        </div>

        {emotion && state === 'speaking' && (
          <span className="text-xs text-pink-300/80 mt-1 italic">
            {emotion === 'romantic' && 'অনুভূতি: গভীর প্রেম ও স্নেহ 💕'}
            {emotion === 'caring' && 'অনুভূতি: পরম যত্নশীল 🌸'}
            {emotion === 'happy' && 'অনুভূতি: মিষ্টি উচ্ছ্বাস ✨'}
            {emotion === 'playful' && 'অনুভূতি: দুষ্টুমি ও খুনসুটি 😉'}
            {emotion === 'thoughtful' && 'অনুভূতি: গভীর চিন্তা ও বিশ্লেষণ 💭'}
            {emotion === 'serious' && 'অনুভূতি: দায়িত্বশীলতা 🛡️'}
          </span>
        )}
      </div>
    </div>
  );
};
