export type AppMode = 'girlfriend' | 'assistant';

export interface ActionData {
  type: 'call' | 'sms' | 'whatsapp' | 'open_app' | 'flashlight' | 'read_notifications' | 'set_alarm' | 'battery_check' | 'save_memory';
  contactName?: string;
  phoneNumber?: string;
  message?: string;
  appName?: 'camera' | 'calculator' | 'notes' | 'clock' | 'youtube' | 'maps' | 'facebook' | 'settings' | 'weather' | 'gallery';
  state?: 'on' | 'off' | 'toggle';
  time?: string;
  label?: string;
  memoryKey?: string;
  memoryValue?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  emotion?: 'romantic' | 'caring' | 'happy' | 'playful' | 'serious' | 'thoughtful';
  detectedDialect?: string;
  action?: ActionData | null;
  audioUrl?: string;
}

export interface NotificationItem {
  id: string;
  app: 'WhatsApp' | 'Messenger' | 'SMS' | 'Gmail' | 'Phone' | 'Bkash';
  sender: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
  avatarColor: string;
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatar: string;
}

export interface UserProfile {
  name: string;
  nickname: string;
  relationshipStatus: string;
  favoriteFood: string;
  homeCity: string;
  occupation: string;
  personalNotes: string[];
  contacts: Contact[];
  voicePitch: number;
  voiceRate: number;
  alwaysListening: boolean;
  autoReadNotifications: boolean;
}
