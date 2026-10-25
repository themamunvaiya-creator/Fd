import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Smartphone, Check, Copy, ExternalLink, X, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'qr'>('pwa');

  const appUrl =
    window.location.hostname.includes('ais-dev') || window.location.hostname.includes('localhost')
      ? 'https://ais-pre-iio4c7nnfzs5aijrsh3fly-684921869017.asia-northeast1.run.app'
      : window.location.origin;
  const pwabuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(appUrl)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(appUrl)}`;

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
              <h3 className="text-sm font-bold text-white">মোবাইলে Mita AI অ্যাপ</h3>
              <p className="text-xs text-slate-400">সরাসরি অ্যাপে রূপান্তর করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 my-3 text-xs">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'pwa'
                ? 'bg-pink-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ১-ক্লিক ইনস্টল
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'apk'
                ? 'bg-cyan-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            APK ফাইল
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-1.5 rounded-xl font-medium transition-all ${
              activeTab === 'qr'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            QR কোড
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 py-1 pr-1 text-xs">
          {activeTab === 'pwa' && (
            <>
              {isInstallable && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-rose-950/60 border border-pink-500/30 text-center">
                  <p className="font-semibold text-white mb-2">আপনার ফোনে সরাসরি ইনস্টল করুন</p>
                  <button
                    onClick={install}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30"
                  >
                    <Download size={16} />
                    <span>অ্যান্ড্রয়েড ফোনে ইনস্টল করুন</span>
                  </button>
                  <p className="text-[10px] text-pink-300 mt-1.5">
                    এটি সরাসরি হোম স্ক্রিনে অ্যাপ আইকন তৈরি করবে
                  </p>
                </div>
              )}

              {isInstalled && (
                <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-center text-emerald-300">
                  <ShieldCheck size={24} className="mx-auto mb-1 text-emerald-400" />
                  <p className="font-bold">Mita AI ইতিমধ্যে অ্যাপ হিসেবে ইনস্টল করা আছে!</p>
                </div>
              )}

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>মোবাইলে চালানোর নিয়ম:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    আপনার মোবাইলের <strong>Google Chrome</strong> ব্রাউজারে লিঙ্কটি ওপেন করুন।
                  </li>
                  <li>
                    ব্রাউজারের উপরে ডানদিকের তিনটি ডট (<strong>⋮</strong>) মেনু চাপুন।
                  </li>
                  <li>
                    <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> সিলেক্ট করুন।
                  </li>
                  <li>
                    আপনার মোবাইলে <strong>Mita AI</strong>-এর অ্যাপ আইকন চলে আসবে এবং ফুলস্ক্রিন চলবে।
                  </li>
                </ol>
              </div>

              {/* Link copy */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 block">মোবাইলের জন্য লিঙ্ক:</span>
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
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                {copied && <p className="text-[10px] text-emerald-400 font-medium">লিঙ্ক কপি হয়েছে!</p>}
              </div>
            </>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 text-center">
                <p className="font-semibold text-white mb-1.5">সরাসরি .apk ফাইল তৈরি করুন</p>
                <p className="text-[11px] text-slate-300 mb-3">
                  মাইক্রোসফটের অফিশিয়াল <strong>PWABuilder</strong> দিয়ে কোনো কোড না লিখেই সরাসরি অ্যান্ড্রয়েড প্যাকেজ (.apk) ডাউনলোড করুন।
                </p>
                <a
                  href={pwabuilderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <Download size={15} />
                  <span>PWABuilder-এ APK জেনারেট করুন</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2 text-[11px] text-slate-300 leading-relaxed">
                <p className="font-bold text-cyan-300">APK বানানোর ৩টি সহজ ধাপ:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>উপরের বাটনে চাপ দিয়ে PWABuilder খুলুন।</li>
                  <li>এটি স্বয়ংক্রিয়ভাবে Mita AI এর ম্যানিফেস্ট ও আইকন স্ক্যান করবে।</li>
                  <li><strong>"Package for Android"</strong> চাপুন এবং সাথে সাথে <code>.apk</code> ফাইল ডাউনলোড হয়ে যাবে!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-3">
              <p className="font-semibold text-white text-xs">
                ফোনের ক্যামেরা দিয়ে স্ক্যান করুন
              </p>
              <div className="p-2 bg-white rounded-2xl shadow-xl">
                <img
                  src={qrCodeUrl}
                  alt="Mita AI QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                ক্যামেরা বা যেকোনো কিউআর স্ক্যানার দিয়ে স্ক্যান করলেই সরাসরি আপনার ফোনে Mita AI চালু হয়ে যাবে!
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
        >
          বন্ধ করুন
        </button>
      </div>
    </motion.div>
  );
};
