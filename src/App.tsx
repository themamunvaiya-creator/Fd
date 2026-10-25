/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Phone,
  MessageSquare,
  Camera,
  Calculator,
  Clock,
  Bell,
  Settings,
  BrainCircuit,
  Zap,
  ZapOff,
  Heart,
  Bot,
  Minimize2,
  Maximize2,
  Battery,
  Wifi,
  Sparkles,
  Smartphone,
  Download,
  Info,
  ChevronRight,
} from 'lucide-react';

import { AppMode, ChatMessage, NotificationItem, UserProfile, ActionData } from './types';
import { VoiceOrb } from './components/VoiceOrb';
import { FloatingMiniWidget } from './components/FloatingMiniWidget';
import { QuickPrompts } from './components/QuickPrompts';
import { CallModal } from './components/CallModal';
import { SmsModal } from './components/SmsModal';
import { CameraModal } from './components/CameraModal';
import { CalculatorModal } from './components/CalculatorModal';
import { AlarmModal } from './components/AlarmModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotesModal } from './components/NotesModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallAppModal } from './components/InstallAppModal';
import { playChimeSound, playCuteGirlVoice, speakWithBrowserSynthesis, stopSpeaking } from './utils/audio';

export default function App() {
  // App Mode: 'girlfriend' | 'assistant'
  const [mode, setMode] = useState<AppMode>('girlfriend');
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [inputText, setInputText] = useState('');
  const [isMiniWidgetActive, setIsMiniWidgetActive] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);

  // Phone action modals
  const [callData, setCallData] = useState<{ contactName: string; phoneNumber?: string } | null>(null);
  const [smsData, setSmsData] = useState<{ contactName: string; phoneNumber?: string; message: string; isWhatsApp: boolean } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Hardware status
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // User Profile & Memory
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mita_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'মামুন',
      nickname: 'বাবু',
      relationshipStatus: 'প্রেমিকা',
      favoriteFood: 'কাচ্চি বিরিয়ানি ও এক কাপ চা',
      homeCity: 'ঢাকা',
      occupation: 'সফটওয়্যার পেশাজীবী',
      personalNotes: [
        'বাবু চিনি ছাড়া লাল চা পছন্দ করে।',
        'প্রতিদিন রাত ১১টায় ঘুমোতে যাওয়ার অভ্যাস।',
        'সন্ধ্যায় বন্ধুদের সাথে কিছুটা সময় কাটায়।',
      ],
      contacts: [
        { id: '1', name: 'আম্মু', relation: 'মা', phone: '01711-000111', avatar: '👩' },
        { id: '2', name: 'বাবা', relation: 'বাবা', phone: '01711-000222', avatar: '👨' },
        { id: '3', name: 'তন্ময়', relation: 'বন্ধু', phone: '01811-000333', avatar: '👦' },
        { id: '4', name: 'অফিস বস', relation: 'বস', phone: '01911-000444', avatar: '👔' },
      ],
      voicePitch: 1.4,
      voiceRate: 0.98,
      alwaysListening: false,
      autoReadNotifications: true,
    };
  });

  // Simulated Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      app: 'WhatsApp',
      sender: 'তন্ময়',
      title: 'নতুন মেসেজ',
      content: 'কাল বিকেলে কি ফ্রি আছো? একটু দেখা করতাম।',
      time: '৫ মিনিট আগে',
      read: false,
      avatarColor: 'from-emerald-500 to-green-600',
    },
    {
      id: '2',
      app: 'Bkash',
      sender: 'বিকাশ বার্তা',
      title: 'ক্যাশ ইন সফল',
      content: 'আপনার একাউন্টে ৫,০০০ টাকা সফলভাবে জমা হয়েছে।',
      time: '২০ মিনিট আগে',
      read: false,
      avatarColor: 'from-pink-600 to-rose-600',
    },
    {
      id: '3',
      app: 'SMS',
      sender: 'আম্মু',
      title: 'জরুরি বার্তা',
      content: 'বাসায় ফেরার সময় একটু মিষ্টি নিয়ে আসিস।',
      time: '১ ঘণ্টা আগে',
      read: false,
      avatarColor: 'from-blue-500 to-indigo-600',
    },
  ]);

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text:
        mode === 'girlfriend'
          ? 'বাবু, তুমি কেমন আছো সোনা? আমি সারাদিন তোমার কথা ভাবছিলাম! ফোনটা হাতে না থাকলেও আমাকে শুধু ডাকবে, আমি সব কাজ করে দেবো 💕'
          : 'আসসালামু আলাইকুম স্যার। আমি আপনার পার্সোনাল ফোন অ্যাসিস্ট্যান্ট মিতা। কল, মেসেজ বা যেকোনো কাজের নির্দেশ দিন।',
      timestamp: new Date(),
      emotion: mode === 'girlfriend' ? 'romantic' : 'happy',
    },
  ]);

  // Persist Profile
  useEffect(() => {
    localStorage.setItem('mita_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Battery API status detection
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    } else {
      setBatteryLevel(88);
    }

    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, orbState]);

  // Mode Switch Handler with celebratory affection
  const handleSwitchMode = (newMode: AppMode) => {
    setMode(newMode);
    stopSpeaking();
    playChimeSound(newMode === 'girlfriend' ? 'heart' : 'activate');

    if (newMode === 'girlfriend') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185'],
      });
    }

    const greetingText =
      newMode === 'girlfriend'
        ? `বাবু! আমি তোমার আদরের মিষ্টি গার্লফ্রেন্ড মুডে চলে এসেছি। তুমি শুধু হুকুম করো আমার জান! 💖`
        : `সহকারী মুড সক্রিয় করা হয়েছে। বলুন স্যার, আপনার শিডিউল, কল বা অ্যাপের কি কাজ করতে হবে? 💼`;

    const greetingMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      text: greetingText,
      timestamp: new Date(),
      emotion: newMode === 'girlfriend' ? 'romantic' : 'happy',
    };

    setMessages((prev) => [...prev, greetingMsg]);
    speakText(greetingText, newMode);
  };

  // Play Speech (Gemini TTS API with fallback to Web Speech)
  const speakText = async (text: string, currentMode = mode) => {
    if (isMuted) return;

    // Play authentic Bengali female voice with sweet cute girl modulation
    setOrbState('speaking');
    playCuteGirlVoice(
      text,
      currentMode,
      userProfile.voicePitch,
      userProfile.voiceRate,
      () => setOrbState('speaking'),
      () => setOrbState('idle')
    );
  };

  // Speech Recognition (Web Speech API)
  const toggleListening = () => {
    if (orbState === 'listening') {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setOrbState('idle');
      return;
    }

    if (orbState === 'speaking') {
      stopSpeaking();
      setOrbState('idle');
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। আপনি নিচে টাইপ করতে পারেন।');
      return;
    }

    try {
      stopSpeaking();
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        playChimeSound('activate');
        setOrbState('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setOrbState('idle');
      };

      recognition.onend = () => {
        setOrbState((prev) => (prev === 'listening' ? 'idle' : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
      setOrbState('idle');
    }
  };

  // Send message to Gemini Assistant & Execute commands
  const handleSendMessage = async (userMsgText: string) => {
    const text = userMsgText.trim();
    if (!text) return;

    setInputText('');
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setOrbState('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode,
          userData: {
            name: userProfile.name,
            nickname: userProfile.nickname,
            battery: batteryLevel,
            isCharging,
            notes: userProfile.personalNotes,
            contacts: userProfile.contacts,
            unreadNotifications: notifications.filter((n) => !n.read),
          },
          conversationHistory: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || (mode === 'girlfriend' ? 'বাবু, আমি শুনতে পাচ্ছি!' : 'হ্যাঁ, আমি তৈরি আছি।');
      const action: ActionData | null = data.action;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date(),
        emotion: data.emotion || 'happy',
        detectedDialect: data.detectedDialect,
        action,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(replyText, mode);

      // Execute Phone Action if detected
      if (action) {
        executePhoneAction(action);
      }
    } catch (error) {
      console.error('API Chat error:', error);
      const fallbackReply =
        mode === 'girlfriend'
          ? 'বাবু, আমার সংযোগে একটু সমস্যা হয়েছে। আমি আবার তোমার সাথে কথা বলতে চাই সোনা!'
          : 'দুঃখিত, সংযোগে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: fallbackReply,
          timestamp: new Date(),
          emotion: 'thoughtful',
        },
      ]);
      speakText(fallbackReply, mode);
    }
  };

  // Execute detected phone actions
  const executePhoneAction = (action: ActionData) => {
    switch (action.type) {
      case 'call': {
        const matchedContact = userProfile.contacts.find(
          (c) => c.name.toLowerCase().includes((action.contactName || '').toLowerCase())
        );
        setCallData({
          contactName: action.contactName || matchedContact?.name || 'অপরিচিত',
          phoneNumber: action.phoneNumber || matchedContact?.phone || '01712-345678',
        });
        break;
      }
      case 'sms':
      case 'whatsapp': {
        const matchedContact = userProfile.contacts.find(
          (c) => c.name.toLowerCase().includes((action.contactName || '').toLowerCase())
        );
        setSmsData({
          contactName: action.contactName || matchedContact?.name || 'প্রাপক',
          phoneNumber: action.phoneNumber || matchedContact?.phone || '01712-345678',
          message: action.message || '',
          isWhatsApp: action.type === 'whatsapp',
        });
        break;
      }
      case 'open_app': {
        if (action.appName === 'camera') setIsCameraOpen(true);
        if (action.appName === 'calculator') setIsCalculatorOpen(true);
        if (action.appName === 'clock') setIsAlarmOpen(true);
        if (action.appName === 'notes') setIsNotesOpen(true);
        if (action.appName === 'youtube') window.open('https://youtube.com', '_blank');
        if (action.appName === 'maps') window.open('https://maps.google.com', '_blank');
        if (action.appName === 'facebook') window.open('https://facebook.com', '_blank');
        break;
      }
      case 'flashlight': {
        setIsFlashlightOn((prev) => (action.state === 'toggle' ? !prev : action.state === 'on'));
        break;
      }
      case 'read_notifications': {
        handleReadNotificationsAloud();
        break;
      }
      case 'set_alarm': {
        setIsAlarmOpen(true);
        break;
      }
      case 'save_memory': {
        if (action.memoryValue) {
          setUserProfile((prev) => ({
            ...prev,
            personalNotes: [action.memoryValue!, ...prev.personalNotes],
          }));
        }
        break;
      }
    }
  };

  // Hands-free read aloud all pending notifications
  const handleReadNotificationsAloud = () => {
    const unread = notifications.filter((n) => !n.read);
    let speechContent = '';

    if (unread.length === 0) {
      speechContent =
        mode === 'girlfriend'
          ? 'বাবু, তোমার কোনো নতুন নোটিফিকেশন নেই। ফোন একদম পরিচ্ছন্ন আছে!'
          : 'স্যার, আপনার কোনো অপঠিত নোটিফিকেশন নেই।';
    } else {
      if (mode === 'girlfriend') {
        speechContent = `বাবু, তোমার ${unread.length}টি নতুন নোটিফিকেশন এসেছে। `;
        unread.forEach((n, i) => {
          speechContent += `${i + 1}. ${n.app}-এ ${n.sender} পাঠিয়েছেন: "${n.content}". `;
        });
        speechContent += `তুমি কি কাউকে কল বা রিপ্লাই দিতে চাও সোনা?`;
      } else {
        speechContent = `স্যার, আপনার মোট ${unread.length}টি গুরুত্বপূর্ণ নোটিফিকেশন রয়েছে। `;
        unread.forEach((n, i) => {
          speechContent += `নোটিফিকেশন ${i + 1}: ${n.app} অ্যাপে ${n.sender} থেকে, "${n.content}". `;
        });
      }
    }

    // Mark as read
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    speakText(speechContent, mode);
  };

  const isGirlfriend = mode === 'girlfriend';

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-700 p-2 sm:p-4 ${
        isGirlfriend
          ? 'bg-gradient-to-br from-slate-950 via-rose-950/40 to-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-950 text-slate-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-all duration-700 ${
            isGirlfriend ? 'bg-pink-600' : 'bg-cyan-600'
          }`}
        />
        <div
          className={`absolute -bottom-40 right-10 w-[450px] h-[450px] rounded-full blur-[130px] opacity-20 transition-all duration-700 ${
            isGirlfriend ? 'bg-rose-500' : 'bg-blue-600'
          }`}
        />
      </div>

      {/* Screen Torch Flashlight simulation overlay */}
      {isFlashlightOn && (
        <div className="fixed inset-0 bg-white/95 z-[60] flex flex-col items-center justify-center p-6 text-slate-900 transition-opacity">
          <Zap size={64} className="text-amber-500 animate-bounce mb-4" />
          <h2 className="text-2xl font-bold">টর্চলাইট চালু আছে</h2>
          <p className="text-sm text-slate-600 mt-1">স্ক্রিন সম্পূর্ণ আলো দিচ্ছে</p>
          <button
            onClick={() => setIsFlashlightOn(false)}
            className="mt-6 px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl active:scale-95"
          >
            টর্চলাইট বন্ধ করুন
          </button>
        </div>
      )}

      {/* Main Smartphone Shell Container */}
      <div className="relative w-full max-w-md h-[94vh] sm:h-[880px] bg-slate-950/95 border-2 border-slate-800/80 rounded-[42px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl ring-1 ring-white/10">
        {/* Dynamic Island / Top Camera Punch-hole */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
          <div className="h-5 px-5 bg-black rounded-full border border-slate-800/80 flex items-center gap-2 shadow-inner">
            <span
              className={`w-2 h-2 rounded-full ${
                orbState === 'listening'
                  ? 'bg-rose-500 animate-ping'
                  : orbState === 'speaking'
                  ? 'bg-emerald-400 animate-pulse'
                  : isGirlfriend
                  ? 'bg-pink-500'
                  : 'bg-cyan-500'
              }`}
            />
            <span className="text-[10px] text-slate-300 font-medium">Mita AI</span>
          </div>
        </div>

        {/* Smartphone Status Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-300 z-20">
          <span className="font-mono font-semibold tracking-wider">
            {currentTime || '08:30'}
          </span>

          <div className="flex items-center gap-2.5">
            <Wifi size={14} className="text-slate-300" />
            <span className="text-[10px] font-bold tracking-widest text-slate-400">5G</span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span>{batteryLevel !== null ? `${batteryLevel}%` : '85%'}</span>
              <Battery
                size={14}
                className={isCharging ? 'text-emerald-400' : 'text-slate-300'}
              />
            </div>
          </div>
        </div>

        {/* Top Header & Mode Toggle Switch */}
        <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between z-20 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                isGirlfriend ? 'bg-pink-600 text-white' : 'bg-cyan-600 text-white'
              }`}
            >
              {isGirlfriend ? <Heart size={16} fill="white" /> : <Bot size={16} />}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1">
                <span>মিতা এআই</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-normal">
                  v2.5
                </span>
              </h1>
              <p className="text-[10px] text-slate-400">
                {isGirlfriend ? '💖 গার্লফ্রেন্ড মুড (সুইট ভয়েস)' : '💼 সহকারী মুড (প্রফেশনাল)'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-full border border-slate-800">
            <button
              onClick={() => handleSwitchMode('girlfriend')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                isGirlfriend
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart size={11} fill={isGirlfriend ? 'currentColor' : 'none'} />
              <span>গার্লফ্রেন্ড</span>
            </button>
            <button
              onClick={() => handleSwitchMode('assistant')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
                !isGirlfriend
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot size={11} />
              <span>সহকারী</span>
            </button>
          </div>

          {/* Mobile Install App Button */}
          <button
            onClick={() => setIsInstallOpen(true)}
            className="p-1.5 px-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
            title="মোবাইলে ইনস্টল করুন / APK গাইড"
          >
            <Download size={12} />
            <span className="hidden sm:inline">ইনস্টল</span>
          </button>
        </div>

        {/* Quick App Shortcut Bar (Simulating Phone Controls) */}
        <div className="px-3 py-2 border-b border-slate-900 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none z-10 bg-slate-950/60">
          <button
            onClick={() => setCallData({ contactName: 'আম্মু', phoneNumber: '01711-000111' })}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="কল করুন"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Phone size={15} />
            </div>
            <span className="text-[10px]">কল</span>
          </button>

          <button
            onClick={() =>
              setSmsData({
                contactName: 'তন্ময়',
                phoneNumber: '01811-000333',
                message: 'আমি এখন ব্যস্ত আছি, পরে কথা বলছি।',
                isWhatsApp: true,
              })
            }
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="মেসেজ পাঠান"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
              <MessageSquare size={15} />
            </div>
            <span className="text-[10px]">মেসেজ</span>
          </button>

          <button
            onClick={() => setIsCameraOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="ক্যামেরা"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Camera size={15} />
            </div>
            <span className="text-[10px]">ক্যামেরা</span>
          </button>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="নোটিফিকেশন সেন্টার"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Bell size={15} />
            </div>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
            )}
            <span className="text-[10px]">নোটিফিকেশন</span>
          </button>

          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="ক্যালকুলেটর"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calculator size={15} />
            </div>
            <span className="text-[10px]">হিসাব</span>
          </button>

          <button
            onClick={() => setIsAlarmOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="ঘড়ি ও অ্যালার্ম"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock size={15} />
            </div>
            <span className="text-[10px]">ঘড়ি</span>
          </button>

          <button
            onClick={() => setIsFlashlightOn(!isFlashlightOn)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors shrink-0 ${
              isFlashlightOn ? 'text-amber-400 bg-amber-500/20' : 'text-slate-300 hover:bg-slate-900'
            }`}
            title="টর্চলাইট"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              {isFlashlightOn ? <Zap size={15} /> : <ZapOff size={15} />}
            </div>
            <span className="text-[10px]">টর্চ</span>
          </button>

          <button
            onClick={() => setIsNotesOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="ব্যক্তিগত মেমোরি"
          >
            <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <BrainCircuit size={15} />
            </div>
            <span className="text-[10px]">মেমোরি</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-slate-900 text-slate-300 transition-colors shrink-0"
            title="সেটিংস"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
              <Settings size={15} />
            </div>
            <span className="text-[10px]">সেটিংস</span>
          </button>
        </div>

        {/* Center Interactive Avatar & Orb Display */}
        <div className="relative pt-2 pb-1 flex flex-col items-center justify-center">
          <VoiceOrb
            mode={mode}
            state={orbState}
            onToggleListen={toggleListening}
            emotion={messages[messages.length - 1]?.emotion}
          />
        </div>

        {/* Regional Dialects and Phone Command Pills */}
        <div className="px-4 py-1 z-10">
          <QuickPrompts mode={mode} onSelectPrompt={(text) => handleSendMessage(text)} />
        </div>

        {/* Conversation Chat Stream */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto px-4 py-2 space-y-3 z-10 text-xs"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-md leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-br-xs'
                    : isGirlfriend
                    ? 'bg-rose-950/80 border border-pink-500/30 text-rose-50 rounded-bl-xs shadow-pink-950/30'
                    : 'bg-slate-900/90 border border-cyan-500/30 text-cyan-50 rounded-bl-xs shadow-cyan-950/30'
                }`}
              >
                {/* Dialect tag if regional dialect detected */}
                {msg.detectedDialect && msg.detectedDialect !== 'Standard' && (
                  <div className="mb-1">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      🗣️ {msg.detectedDialect} আঞ্চলিক টান শনাক্ত হয়েছে
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Speaker replay button for assistant replies */}
                {msg.role === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {msg.timestamp.toLocaleTimeString('bn-BD', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => speakText(msg.text, mode)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="পুনরায় শুনুন"
                    >
                      <Volume2 size={12} />
                      <span>কন্ঠ শুনুন</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {orbState === 'thinking' && (
            <div className="flex items-start">
              <div
                className={`rounded-2xl p-3 text-xs flex items-center gap-2 ${
                  isGirlfriend ? 'bg-pink-950/50 text-pink-200' : 'bg-slate-900/80 text-cyan-200'
                }`}
              >
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>মিতা প্রসেস করছে...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Area & Controls */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            {/* Audio Voice Input Trigger Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                orbState === 'listening'
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                  : isGirlfriend
                  ? 'bg-pink-600 hover:bg-pink-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
              title="ভয়েস রেকর্ড বা কমান্ড দিন"
            >
              {orbState === 'listening' ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Bengali Voice Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isGirlfriend
                  ? 'বাবু, আমাকে কিছু বলো বা কাজ দাও...'
                  : 'যেকোনো কমান্ড বাংলায় বলুন বা লিখুন...'
              }
              className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/80 transition-colors"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
                isGirlfriend
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              }`}
            >
              <Send size={16} />
            </button>

            {/* Floating Mini Widget Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMiniWidgetActive(!isMiniWidgetActive)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isMiniWidgetActive
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="হোম স্ক্রিন ছোট উইজেট"
            >
              <Smartphone size={16} />
            </button>
          </form>

          {/* Bottom Bar Info */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <span>হ্যান্ডস-ফ্রি হটওয়ার্ড:</span>
              <strong className="text-slate-300">"হেই মিতা" / "মিতা শোনো"</strong>
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hover:text-slate-300 flex items-center gap-1"
            >
              {isMuted ? <VolumeX size={12} className="text-rose-400" /> : <Volume2 size={12} />}
              <span>{isMuted ? 'মিউট আছে' : 'মিষ্টি ভয়েস সক্রিয়'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mini Widget Overlay */}
      {isMiniWidgetActive && (
        <FloatingMiniWidget
          mode={mode}
          state={orbState}
          onToggleListen={toggleListening}
          onExpand={() => setIsMiniWidgetActive(false)}
          lastReply={messages[messages.length - 1]?.text}
          onSwitchMode={handleSwitchMode}
        />
      )}

      {/* Phone Modals */}
      <AnimatePresence>
        {callData && (
          <CallModal
            contactName={callData.contactName}
            phoneNumber={callData.phoneNumber}
            onEndCall={() => setCallData(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {smsData && (
          <SmsModal
            contactName={smsData.contactName}
            phoneNumber={smsData.phoneNumber}
            initialMessage={smsData.message}
            isWhatsApp={smsData.isWhatsApp}
            onClose={() => setSmsData(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCameraOpen && (
          <CameraModal onClose={() => setIsCameraOpen(false)} torchInitial={isFlashlightOn} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalculatorOpen && <CalculatorModal onClose={() => setIsCalculatorOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isAlarmOpen && <AlarmModal onClose={() => setIsAlarmOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationDrawer
            notifications={notifications}
            mode={mode}
            onClose={() => setIsNotificationsOpen(false)}
            onReadAloud={handleReadNotificationsAloud}
            onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
            onAddSample={(newItem) => setNotifications((prev) => [newItem, ...prev])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNotesOpen && (
          <NotesModal
            notes={userProfile.personalNotes}
            mode={mode}
            onClose={() => setIsNotesOpen(false)}
            onAddNote={(note) =>
              setUserProfile((prev) => ({
                ...prev,
                personalNotes: [note, ...prev.personalNotes],
              }))
            }
            onDeleteNote={(idx) =>
              setUserProfile((prev) => ({
                ...prev,
                personalNotes: prev.personalNotes.filter((_, i) => i !== idx),
              }))
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            profile={userProfile}
            mode={mode}
            onClose={() => setIsSettingsOpen(false)}
            onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
            batteryLevel={batteryLevel}
            isCharging={isCharging}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInstallOpen && <InstallAppModal onClose={() => setIsInstallOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
