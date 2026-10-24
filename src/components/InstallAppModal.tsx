import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Smartphone, Check, Copy, ExternalLink, X, ShieldCheck, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  const appUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">মোবাইলে Mita AI ইনস্টল</h3>
              <p className="text-xs text-slate-400">অ্যান্ড্রয়েড ফোন অ্যাপ গাইড</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5 py-3 pr-1 text-xs">
          {/* Direct PWA Install Button if available */}
          {isInstallable && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-rose-950/60 border border-pink-500/30 text-center">
              <p className="font-semibold text-white mb-2">১-ক্লিকে ফোনে ইনস্টল করুন</p>
              <button
                onClick={install}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
              >
                <Download size={16} />
                <span>অ্যান্ড্রয়েড ফোনে ইনস্টল করুন</span>
              </button>
              <p className="text-[10px] text-pink-300 mt-1.5">
                এটি সরাসরি আপনার ফোনের হোম স্ক্রিনে অ্যাপ আইকন যুক্ত করবে
              </p>
            </div>
          )}

          {isInstalled && (
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-center text-emerald-300">
              <ShieldCheck size={24} className="mx-auto mb-1 text-emerald-400" />
              <p className="font-bold">Mita AI ইতিমধ্যে ফোনে ইনস্টল করা আছে!</p>
            </div>
          )}

          {/* Android Mobile Install Instructions */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Sparkles size={14} className="text-cyan-400" />
              <span>মোবাইলে চালানোর নিয়ম:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>
                নিচের লিঙ্কটি কপি করে আপনার মোবাইলের <strong>Chrome ব্রাউজারে</strong> ওপেন করুন।
              </li>
              <li>
                ক্রোম ব্রাউজারের উপরে ডানদিকের <strong>তিনটি ডট (⋮)</strong> মেনুতে ক্লিক করুন।
              </li>
              <li>
                <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) চাপুন।
              </li>
              <li>
                আপনার ফোনে <strong>Mita AI</strong>-এর একটি অ্যাপ আইকন তৈরি হয়ে যাবে এবং ফুল-স্ক্রিন চলবে!
              </li>
            </ol>
          </div>

          {/* Copy Mobile Link Box */}
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 block">মোবাইলে ওপেন করার লিঙ্ক:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                title="কপি করুন"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            {copied && <p className="text-[10px] text-emerald-400 font-medium">লিঙ্ক কপি হয়েছে!</p>}
          </div>

          {/* APK Note */}
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">💡 APK প্যাকেজিং সম্পর্কিত তথ্য:</strong>
            এটি একটি ক্লাউড-হোস্টেড আধুনিক ফুল-স্ট্যাক এআই অ্যাপ (React + Node)। এটি চালানোর জন্য কোনো ভারী .apk ডাউনলোডের প্রয়োজন নেই—মোবাইল ক্রোম থেকে "Install" দিলেই সরাসরি নেটিভ অ্যাপের মতো কাজ করে।
            <div className="mt-2 pt-2 border-t border-slate-800">
              আপনি যদি গুগল প্লে স্টোরের জন্য খাঁটি APK বা AAB ফাইল তৈরি করতে চান, তবে <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">PWABuilder <ExternalLink size={10} /></a>-এ এই লিঙ্কটি দিলে নিমিষেই ১-ক্লিকে Signed APK তৈরি করে দেবে।
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          বুঝেছি
        </button>
      </div>
    </motion.div>
  );
};
