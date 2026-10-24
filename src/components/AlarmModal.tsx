import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, Trash2, Bell, X, Play, Pause } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface Alarm {
  id: string;
  time: string;
  label: string;
  active: boolean;
}

interface AlarmModalProps {
  onClose: () => void;
  newAlarmTime?: string;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({ onClose, newAlarmTime }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00 AM', label: 'সকালে ঘুম থেকে ওঠা', active: true },
    { id: '2', time: '02:30 PM', label: 'মিটিং শিডিউল', active: false },
    { id: '3', time: '11:00 PM', label: 'ঘুমানোর সময়', active: true },
  ]);

  const [inputTime, setInputTime] = useState(newAlarmTime || '08:00');
  const [inputLabel, setInputLabel] = useState('নতুন কাজ');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const addAlarm = () => {
    if (!inputTime) return;
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: inputTime,
      label: inputLabel || 'অ্যালার্ম',
      active: true,
    };
    setAlarms([newAlarm, ...alarms]);
    playChimeSound('done');
  };

  const toggleAlarm = (id: string) => {
    setAlarms(
      alarms.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((a) => a.id !== id));
  };

  const testAlarmSound = () => {
    playChimeSound('activate');
    setTimeout(() => playChimeSound('done'), 400);
  };

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
          <div className="flex items-center gap-2 text-amber-400">
            <Clock size={20} />
            <span className="text-sm font-bold text-white">ঘড়ি ও অ্যালার্ম</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Live Clock */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/20 text-center">
          <span className="text-xs text-amber-400/80 font-medium">বর্তমান সময়</span>
          <div className="text-3xl font-bold font-mono text-white mt-1 tracking-wider">
            {currentTime || '08:30:00 AM'}
          </div>
        </div>

        {/* Add alarm row */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-amber-400"
          />
          <input
            type="text"
            value={inputLabel}
            onChange={(e) => setInputLabel(e.target.value)}
            placeholder="লেবেল..."
            className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={addAlarm}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            title="যুক্ত করুন"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Alarm List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                alarm.active
                  ? 'bg-slate-800/80 border-slate-700 text-white'
                  : 'bg-slate-950/50 border-slate-800/60 text-slate-500'
              }`}
            >
              <div>
                <span className="text-lg font-bold font-mono tracking-wide">{alarm.time}</span>
                <p className="text-xs text-slate-400">{alarm.label}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    alarm.active ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <motion.div
                    animate={{ x: alarm.active ? 20 : 2 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Test alarm tone */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>শব্দ পরীক্ষা করুন:</span>
          <button
            onClick={testAlarmSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700"
          >
            <Bell size={13} />
            <span>টোন বাজান</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
