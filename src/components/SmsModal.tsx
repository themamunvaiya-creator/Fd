import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, X, ExternalLink, CheckCircle } from 'lucide-react';

interface SmsModalProps {
  contactName: string;
  phoneNumber?: string;
  initialMessage?: string;
  isWhatsApp?: boolean;
  onClose: () => void;
}

export const SmsModal: React.FC<SmsModalProps> = ({
  contactName,
  phoneNumber = '01712-345678',
  initialMessage = '',
  isWhatsApp = false,
  onClose,
}) => {
  const [msgText, setMsgText] = useState(initialMessage);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msgText)}`;
  const smsLink = `sms:${phoneNumber.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(msgText)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isWhatsApp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isWhatsApp ? 'WhatsApp মেসেজ' : 'এসএমএস বার্তা'}</h3>
              <p className="text-xs text-slate-400">প্রাপক: {contactName} ({phoneNumber})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3"
            >
              <CheckCircle size={36} />
            </motion.div>
            <p className="text-base font-semibold text-white">মেসেজ সফলভাবে পাঠানো হয়েছে!</p>
            <p className="text-xs text-slate-400 mt-1">মিতা আপনার কাজটি সম্পন্ন করেছে</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              rows={4}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-2xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSend}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
              >
                <Send size={14} />
                <span>সিমুলেট পাঠান</span>
              </button>

              <a
                href={isWhatsApp ? whatsappLink : smsLink}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
                title="অ্যাপে ওপেন করুন"
              >
                <span>আসল অ্যাপ</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
