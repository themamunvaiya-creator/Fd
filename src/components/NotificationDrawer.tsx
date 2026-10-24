import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Volume2, X, MessageSquare, Mail, PhoneCall, DollarSign, Check, Plus } from 'lucide-react';
import { NotificationItem, AppMode } from '../types';

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  mode: AppMode;
  onClose: () => void;
  onReadAloud: () => void;
  onDismiss: (id: string) => void;
  onAddSample: (item: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  mode,
  onClose,
  onReadAloud,
  onDismiss,
  onAddSample,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSender, setNewSender] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newApp, setNewApp] = useState<'WhatsApp' | 'Messenger' | 'SMS' | 'Gmail' | 'Bkash'>('WhatsApp');

  const isGirlfriend = mode === 'girlfriend';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleAddCustom = () => {
    if (!newSender || !newContent) return;
    onAddSample({
      id: Date.now().toString(),
      app: newApp,
      sender: newSender,
      title: `${newApp} থেকে বার্তা`,
      content: newContent,
      time: 'এখনই',
      read: false,
      avatarColor: 'from-emerald-500 to-teal-600',
    });
    setNewSender('');
    setNewContent('');
    setShowAddForm(false);
  };

  const getAppIcon = (app: string) => {
    switch (app) {
      case 'WhatsApp':
      case 'Messenger':
        return <MessageSquare size={16} />;
      case 'Gmail':
        return <Mail size={16} />;
      case 'Phone':
        return <PhoneCall size={16} />;
      case 'Bkash':
        return <DollarSign size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isGirlfriend ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">নোটিফিকেশন সেন্টার</h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} টি না পড়া নোটিফিকেশন` : 'কোনো নতুন নোটিফিকেশন নেই'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Read aloud banner */}
        <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-950 border border-pink-500/20 flex items-center justify-between">
          <div className="text-xs text-slate-200">
            <p className="font-semibold text-pink-300">হ্যান্ডস-ফ্রি ভয়েস রিডার</p>
            <p className="text-[11px] text-slate-400">মিতা সব মেসেজ পড়ে শোনাবে</p>
          </div>
          <button
            onClick={onReadAloud}
            className={`px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg active:scale-95 transition-all ${
              isGirlfriend
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 shadow-pink-600/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-600/30'
            }`}
          >
            <Volume2 size={14} />
            <span>পড়ে শোনাও</span>
          </button>
        </div>

        {/* Add sample notification toggle */}
        <div className="mb-3 flex justify-between items-center text-xs">
          <span className="text-slate-400">ইনকামিং নোটিফিকেশন লিস্ট</span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
          >
            <Plus size={13} />
            <span>টেস্ট নোটিফিকেশন পাঠান</span>
          </button>
        </div>

        {/* Test form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs"
          >
            <div className="flex gap-2">
              <select
                value={newApp}
                onChange={(e: any) => setNewApp(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Messenger">Messenger</option>
                <option value="SMS">SMS</option>
                <option value="Gmail">Gmail</option>
                <option value="Bkash">Bkash</option>
              </select>
              <input
                type="text"
                value={newSender}
                onChange={(e) => setNewSender(e.target.value)}
                placeholder="প্রেরক (যেমন: আম্মু / তন্ময়)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5"
              />
            </div>
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="মেসেজ কন্টেন্ট..."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5"
            />
            <button
              onClick={handleAddCustom}
              className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500"
            >
              তৈরি করুন
            </button>
          </motion.div>
        )}

        {/* Notification items */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              কোনো নোটিফিকেশন নেই
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  item.read
                    ? 'bg-slate-950/40 border-slate-800/50 text-slate-400'
                    : 'bg-slate-800/90 border-slate-700 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${item.avatarColor} text-white flex items-center justify-center`}
                    >
                      {getAppIcon(item.app)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{item.sender}</span>
                      <span className="text-[10px] text-slate-400">{item.app} • {item.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDismiss(item.id)}
                    className="text-slate-500 hover:text-slate-300 p-1"
                    title="মুছে ফেলুন"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-2 pl-9 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
