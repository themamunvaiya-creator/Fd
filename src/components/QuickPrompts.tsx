import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Languages, Smartphone, Heart, Sparkles, Phone, MessageSquare, Camera, Zap, Bell, Battery } from 'lucide-react';
import { AppMode } from '../types';

interface QuickPromptsProps {
  mode: AppMode;
  onSelectPrompt: (promptText: string) => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ mode, onSelectPrompt }) => {
  const [activeTab, setActiveTab] = useState<'dialects' | 'actions'>('dialects');
  const isGirlfriend = mode === 'girlfriend';

  const dialects = [
    {
      region: 'চাটগাঁইয়া (Chittagong)',
      tag: 'চাটগাঁইয়া',
      text: 'আঁই অহন কি গরিউম? আঁরে একটু কও না!',
      meaning: 'আমি এখন কী করব? আমাকে একটু বলো না!',
    },
    {
      region: 'সিলেটি (Sylhet)',
      tag: 'সিলেটি',
      text: 'খবর কিতা মিতা? তুমি খাইছনি ঠিকমতো?',
      meaning: 'কী খবর মিতা? তুমি ঠিকমতো খেয়েছো?',
    },
    {
      region: 'নোয়াখাইল্লা (Noakhali)',
      tag: 'নোয়াখাইল্লা',
      text: 'আঁরে একটু সাহায্য করেন, আম্মুরে একটা কল দেন!',
      meaning: 'আমাকে একটু সাহায্য করো, মাকে একটা কল দাও!',
    },
    {
      region: 'বরিশাল্লা (Barisal)',
      tag: 'বরিশাল্লা',
      text: 'মুই তোমারে খুব ভালোবাসি, মোর মনডা ভালো নাই!',
      meaning: 'আমি তোমাকে খুব ভালোবাসি, আমার মন ভালো নেই!',
    },
    {
      region: 'ঢাকাইয়া (Dhakaiya)',
      tag: 'ঢাকাইয়া',
      text: 'মিতা মামুর বেটা, অহন কী করুম একটু বাতলান তো!',
      meaning: 'মিতা, এখন কী করব একটু বুদ্ধি দাও তো!',
    },
  ];

  const phoneActions = [
    { icon: <Phone size={13} />, text: 'মাকে কল করো', label: 'কলিং' },
    { icon: <MessageSquare size={13} />, text: 'রহিমকে মেসেজ পাঠাও: আমি এখন রাস্তায় আছি', label: 'এসএমএস' },
    { icon: <Bell size={13} />, text: 'আমার সব নোটিফিকেশন পড়ে শোনাও', label: 'ভয়েস রিডার' },
    { icon: <Camera size={13} />, text: 'ক্যামেরা চালু করো', label: 'ক্যামেরা' },
    { icon: <Zap size={13} />, text: 'টর্চলাইট অন করো', label: 'টর্চ' },
    { icon: <Battery size={13} />, text: 'আমার ফোনের ব্যাটারি কত পারসেন্ট আছে?', label: 'ব্যাটারি' },
    { icon: <Sparkles size={13} />, text: 'সকাল ৭টায় একটা অ্যালার্ম সেট করো', label: 'অ্যালার্ম' },
    {
      icon: <Heart size={13} />,
      text: isGirlfriend ? 'বাবু, তুমি কি খেয়েছো? সারাদিন তোমার কথা ভাবছিলাম' : 'আজকের আবহাওয়া কেমন থাকবে বলো',
      label: isGirlfriend ? 'ভালোবাসা' : 'তথ্য',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('dialects')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'dialects'
                ? isGirlfriend
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Languages size={13} />
            <span>আঞ্চলিক ভাষা টেস্ট</span>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'actions'
                ? isGirlfriend
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            <span>ফোন কমান্ড</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          ট্যাপ করে কথা বা কমান্ড পাঠান
        </span>
      </div>

      {/* Content List */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
        {activeTab === 'dialects' ? (
          dialects.map((item, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectPrompt(item.text)}
              className="shrink-0 max-w-[220px] p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-semibold">
                  {item.tag}
                </span>
                <span className="text-[10px] text-slate-500 group-hover:text-pink-400 transition-colors">
                  টেস্ট করুন ➜
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium line-clamp-2">
                "{item.text}"
              </p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">
                অর্থ: {item.meaning}
              </p>
            </motion.button>
          ))
        ) : (
          phoneActions.map((action, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectPrompt(action.text)}
              className="shrink-0 p-2.5 px-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center gap-2"
            >
              <div className={`p-1.5 rounded-xl ${isGirlfriend ? 'bg-pink-500/20 text-pink-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                {action.icon}
              </div>
              <div>
                <span className="text-xs text-slate-200 block font-medium">
                  {action.text}
                </span>
                <span className="text-[10px] text-slate-500">{action.label}</span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};
