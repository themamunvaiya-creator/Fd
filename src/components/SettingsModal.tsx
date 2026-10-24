import React from 'react';
import { motion } from 'motion/react';
import { Settings, User, Sliders, Volume2, Mic, X, Battery, Heart, Shield } from 'lucide-react';
import { UserProfile, AppMode } from '../types';

interface SettingsModalProps {
  profile: UserProfile;
  mode: AppMode;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  batteryLevel: number | null;
  isCharging: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  mode,
  onClose,
  onUpdateProfile,
  batteryLevel,
  isCharging,
}) => {
  const isGirlfriend = mode === 'girlfriend';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isGirlfriend ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">সেটিংস ও পার্সোনালাইজেশন</h3>
              <p className="text-xs text-slate-400">মিতার কন্ঠ ও ব্যবহারকারীর তথ্য</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
          {/* User Profile Info */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <User size={15} className="text-pink-400" />
              <span>ব্যবহারকারীর তথ্য</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">আপনার আসল নাম</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                মিতা যে নামে ডাকবে (ডাকনাম / প্রিয় নাম)
              </label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => onUpdateProfile({ nickname: e.target.value })}
                placeholder="যেমন: বাবু / জান / মামুন..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Voice Tuning */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Volume2 size={15} className="text-cyan-400" />
              <span>মিষ্টি মেয়ের কন্ঠের টিউনিং (Voice Pitch)</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                <span>কণ্ঠের সুর (Pitch - মিষ্টি ও মেয়েলি)</span>
                <span className="text-pink-300 font-bold">{profile.voicePitch}x</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.5"
                step="0.05"
                value={profile.voicePitch}
                onChange={(e) => onUpdateProfile({ voicePitch: parseFloat(e.target.value) })}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                <span>কথা বলার গতি (Speed)</span>
                <span className="text-cyan-300 font-bold">{profile.voiceRate}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={profile.voiceRate}
                onChange={(e) => onUpdateProfile({ voiceRate: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Smart Features */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">হ্যান্ডস-ফ্রি নোটিফিকেশন পড়া</p>
                <p className="text-[10px] text-slate-400">নতুন মেসেজ আসলে নিজে থেকে পড়ে শোনাবে</p>
              </div>
              <button
                onClick={() => onUpdateProfile({ autoReadNotifications: !profile.autoReadNotifications })}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  profile.autoReadNotifications ? 'bg-pink-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.autoReadNotifications ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-200">সার্বক্ষণিক লিসেনিং (Wake Word)</p>
                <p className="text-[10px] text-slate-400">"হেই মিতা" বললে সাথে সাথে উত্তর দেবে</p>
              </div>
              <button
                onClick={() => onUpdateProfile({ alwaysListening: !profile.alwaysListening })}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  profile.alwaysListening ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    profile.alwaysListening ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Device Hardware Integration Status */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery size={16} className={isCharging ? 'text-emerald-400' : 'text-amber-400'} />
              <div>
                <p className="font-semibold text-slate-200">রিয়েল-টাইম হার্ডওয়্যার স্ট্যাটাস</p>
                <p className="text-[10px] text-slate-400">
                  ব্যাটারি: {batteryLevel !== null ? `${batteryLevel}%` : '৮৫%'} {isCharging && '(চার্জ হচ্ছে)'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
              কানেক্টেড
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          সম্পন্ন
        </button>
      </div>
    </motion.div>
  );
};
