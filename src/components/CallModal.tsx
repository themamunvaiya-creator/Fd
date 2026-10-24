import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Hash } from 'lucide-react';
import { startRingtoneSound, stopRingtoneSound } from '../utils/audio';

interface CallModalProps {
  contactName: string;
  phoneNumber?: string;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  contactName,
  phoneNumber = '01712-345678',
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    // Start synthetic ringtone
    startRingtoneSound();

    // Auto-connect after 3.5 seconds to simulate picking up
    const timer = setTimeout(() => {
      stopRingtoneSound();
      setCallStatus('connected');
    }, 3800);

    return () => {
      stopRingtoneSound();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    stopRingtoneSound();
    onEndCall();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 flex flex-col items-center justify-between min-h-[520px]">
        {/* Caller Info */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-slate-800">
              {contactName ? contactName.slice(0, 1) : <User size={48} />}
            </div>
            {callStatus === 'ringing' && (
              <span className="absolute -inset-2 rounded-full border-2 border-cyan-400/50 animate-ping pointer-events-none" />
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{contactName || 'অপরিচিত'}</h3>
          <p className="text-sm text-slate-400">{phoneNumber}</p>

          <div className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-medium text-cyan-300">
            {callStatus === 'ringing' ? 'কল বাজছে...' : `সংযুক্ত • ${formatTime(seconds)}`}
          </div>
        </div>

        {/* Call In-progress Controls */}
        <div className="w-full grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
              isMuted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            <span className="text-[11px]">মিউট</span>
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
              isSpeaker ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Volume2 size={22} />
            <span className="text-[11px]">স্পিকার</span>
          </button>

          <a
            href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all"
            title="মোবাইল ডায়ালারে কল করুন"
          >
            <Phone size={22} />
            <span className="text-[11px]">আসল ডায়াল</span>
          </a>
        </div>

        {/* End Call Button */}
        <div className="w-full flex items-center justify-center pb-4">
          <button
            onClick={handleEnd}
            className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-transform"
          >
            <PhoneOff size={30} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
