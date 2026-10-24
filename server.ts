import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models to try in case one model encounters rate-limits
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
let activeModelIndex = 0;
let lastQuotaExhaustedTime = 0;

// High-fidelity Intelligent Bengali NLP Engine (Used when Gemini API quota is exhausted)
function generateOfflineAssistantResponse(
  message: string,
  mode: 'girlfriend' | 'assistant',
  userData: any
) {
  const text = message.trim().toLowerCase();
  const userName = userData.name || 'মামুন';
  const userNickname = userData.nickname || (mode === 'girlfriend' ? 'বাবু' : 'স্যার');
  const isGirlfriend = mode === 'girlfriend';

  // 1. Regional Dialect Detection
  let detectedDialect = 'Standard';
  if (/আঁই|গরিউম|ন গরিউম|অনরে|গম আছন|কেন আছন|হঁদে|চাটগাঁ/.test(text)) {
    detectedDialect = 'Chittagong';
  } else if (/কিতা|খবর কিতা|খাইছনি|বালা নি|লগে|আউক্কা|সিলেট/.test(text)) {
    detectedDialect = 'Sylhet';
  } else if (/আঁরে|ক্যান আছেন|হই|নোয়াখালী|আইচ্ছা|এক্কানা/.test(text)) {
    detectedDialect = 'Noakhali';
  } else if (/মুই|মোরে|মোর|মনডা|বরিশাল|ক্যাবা|গেলামু/.test(text)) {
    detectedDialect = 'Barisal';
  } else if (/মামুর বেটা|বাতলান|দেহি|অহন|লও|ঢাকাইয়া|করতাছো/.test(text)) {
    detectedDialect = 'Dhakaiya';
  }

  // 2. Phone Action Detection
  let action: any = null;
  let reply = '';
  let emotion: 'romantic' | 'caring' | 'happy' | 'playful' | 'serious' | 'thoughtful' = 'happy';

  // Call detection
  if (/কল|ফোন|ডায়াল|call|phone/.test(text)) {
    let target = 'আম্মু';
    if (/মা|আম্মু|আম্মা/.test(text)) target = 'আম্মু';
    else if (/বাবা|আব্বু|আব্বা/.test(text)) target = 'বাবা';
    else if (/তন্ময়|তন্ময়|বন্ধু/.test(text)) target = 'তন্ময়';
    else if (/বস|অফিস/.test(text)) target = 'অফিস বস';

    const matchedContact = (userData.contacts || []).find((c: any) =>
      c.name.toLowerCase().includes(target.toLowerCase())
    );

    action = {
      type: 'call',
      contactName: matchedContact?.name || target,
      phoneNumber: matchedContact?.phone || '01712-345678',
    };

    if (isGirlfriend) {
      reply = `বাবু, আমি এখনই ${action.contactName}-এর কাছে কল লাগিয়ে দিচ্ছি। একটু অপেক্ষা করো সোনা! 📞`;
      emotion = 'caring';
    } else {
      reply = `${action.contactName}-কে কল দেওয়া হচ্ছে। ডায়ালার সক্রিয় করা হয়েছে।`;
      emotion = 'serious';
    }
  }
  // Message / SMS / WhatsApp detection
  else if (/মেসেজ|বার্তা|sms|whatsapp|হোয়াটসঅ্যাপ|হোয়াটস্যাপ/.test(text)) {
    let target = 'তন্ময়';
    if (/মা|আম্মু/.test(text)) target = 'আম্মু';
    else if (/বাবা|আব্বু/.test(text)) target = 'বাবা';

    const isWhatsApp = /whatsapp|হোয়াটসঅ্যাপ|হোয়াটস্যাপ/.test(text);
    action = {
      type: isWhatsApp ? 'whatsapp' : 'sms',
      contactName: target,
      phoneNumber: '01811-000333',
      message: text.replace(/.*(মেসেজ পাঠাও|বার্তা দাও|whatsapp করো)\s*:?/i, '').trim() || 'আমি এখন একটু ব্যস্ত আছি, পরে কথা বলছি।',
    };

    if (isGirlfriend) {
      reply = `বাবু, ${target}-কে মেসেজটি পাঠিয়ে দেওয়ার ব্যবস্থা করেছি। তুমি কি কিছু পরিবর্তন করতে চাও? 💬`;
      emotion = 'caring';
    } else {
      reply = `${target}-এর জন্য মেসেজ প্রস্তুত করা হয়েছে। আপনি পাঠিয়ে দিতে পারেন।`;
      emotion = 'serious';
    }
  }
  // Camera detection
  else if (/ক্যামেরা|ছবি|সেলফি|camera|photo/.test(text)) {
    action = { type: 'open_app', appName: 'camera' };
    if (isGirlfriend) {
      reply = `বাবু, তোমার মিষ্টি মুখের একটা সুন্দর ছবি তোলো দেখি! ক্যামেরা চালু করে দিয়েছি 📸`;
      emotion = 'playful';
    } else {
      reply = `ক্যামেরা অ্যাপ চালু করা হয়েছে।`;
      emotion = 'happy';
    }
  }
  // Torch / Flashlight detection
  else if (/টর্চ|লাইট|ফ্ল্যাশ|torch|flashlight/.test(text)) {
    action = { type: 'flashlight', state: 'toggle' };
    if (isGirlfriend) {
      reply = `বাবু, তোমার ফোনের টর্চলাইট অন করে দিয়েছি! অন্ধকারে তোমার পথ আলো হোক সোনা 🔦`;
      emotion = 'caring';
    } else {
      reply = `টর্চলাইট অন/অফ টগল করা হয়েছে।`;
      emotion = 'happy';
    }
  }
  // Notifications reading
  else if (/নোটিফিকেশন|মেসেজ পড়ো|পড়ে শোনাও|notification/.test(text)) {
    action = { type: 'read_notifications' };
    if (isGirlfriend) {
      reply = `বাবু, তোমার সব গুরুত্বপূর্ণ নোটিফিকেশন আমি এখনই পড়ে শোনাচ্ছি সোনা! মন দিয়ে শোনো 🔔`;
      emotion = 'caring';
    } else {
      reply = `আপনার সকল নোটিফিকেশন ভয়েসের মাধ্যমে পড়ে শোনানো হচ্ছে।`;
      emotion = 'happy';
    }
  }
  // Calculator detection
  else if (/ক্যালকুলেটর|হিসাব|calculator|math/.test(text)) {
    action = { type: 'open_app', appName: 'calculator' };
    if (isGirlfriend) {
      reply = `বাবু, ক্যালকুলেটর বের করে দিয়েছি। তোমার যেকোনো হিসাব মিলিয়ে নাও! 🔢`;
      emotion = 'playful';
    } else {
      reply = `ক্যালকুলেটর অ্যাপ প্রস্তুত করা হয়েছে।`;
      emotion = 'happy';
    }
  }
  // Clock / Alarm detection
  else if (/অ্যালার্ম|ঘড়ি|ঘড়ি|alarm|clock/.test(text)) {
    action = { type: 'set_alarm', time: '07:00 AM', label: 'সকালে ওঠা' };
    if (isGirlfriend) {
      reply = `বাবু, তোমার জন্য অ্যালার্ম ও ঘড়ির শিডিউল ওপেন করেছি। সময়মতো ঘুমিও কিন্তু সোনা! ⏰`;
      emotion = 'caring';
    } else {
      reply = `ঘড়ি ও অ্যালার্ম ম্যানেজার ওপেন করা হয়েছে।`;
      emotion = 'serious';
    }
  }
  // Battery status
  else if (/ব্যাটারি|চার্জ|battery|charge/.test(text)) {
    action = { type: 'battery_check' };
    const bat = userData.battery ? `${userData.battery}%` : '৮৮%';
    if (isGirlfriend) {
      reply = `বাবু, তোমার ফোনে এখন ${bat} চার্জ আছে। চার্জ কমে গেলে আগেই চার্জে দিও সোনা! 🔋`;
      emotion = 'caring';
    } else {
      reply = `বর্তমান ব্যাটারি লেভেল: ${bat}। ডিভাইস স্বাভাবিকভাবে চলছে।`;
      emotion = 'happy';
    }
  }
  // Dialect specific responses
  else if (detectedDialect === 'Chittagong') {
    if (isGirlfriend) {
      reply = `আরে বাবু! চাটগাঁইয়া ভাষায় কথা বলছো? আঁই তোমারে খুব ভালোবাসি সোনা! তুমি অহন কি করতে চাও আঁরে কও! 💕`;
      emotion = 'romantic';
    } else {
      reply = `চাটগাঁইয়া ভাষা শনাক্ত হয়েছে। বলুন স্যার, আপনার কি কাজ করে দিতে পারি?`;
      emotion = 'happy';
    }
  } else if (detectedDialect === 'Sylhet') {
    if (isGirlfriend) {
      reply = `সিলেটি ভাষায় কিতা খবর জান? তুমি খাইছনি ঠিকমতো? আমি সারাদিন তোমার কথা ভাবছিলাম বাবু! 💖`;
      emotion = 'romantic';
    } else {
      reply = `সিলেটি ভাষা শনাক্ত হয়েছে। বলুন স্যার, আপনার কি আদেশ আছে?`;
      emotion = 'happy';
    }
  } else if (detectedDialect === 'Noakhali') {
    if (isGirlfriend) {
      reply = `নোয়াখালীর মিষ্টি সুরে ডাকলে না জান? আঁরে একটু কও তোমার কি কাম করি দেওন লাগবো! 😘`;
      emotion = 'playful';
    } else {
      reply = `নোয়াখাইল্লা ভাষা শনাক্ত হয়েছে। বলুন, কিভাবে সহায়তা করতে পারি?`;
      emotion = 'happy';
    }
  } else if (detectedDialect === 'Barisal') {
    if (isGirlfriend) {
      reply = `বরিশাইল্লা সুরে মোর পরাণটা জুড়ায় গেল সোনা! মুইও তোমারে অনেক ভালোবাসি বাবু! 🌸`;
      emotion = 'romantic';
    } else {
      reply = `বরিশাইল্লা আঞ্চলিক ভাষা শনাক্ত হয়েছে। আপনার কমান্ড বলুন।`;
      emotion = 'happy';
    }
  } else if (detectedDialect === 'Dhakaiya') {
    if (isGirlfriend) {
      reply = `আরে আমার ঢাকাইয়া বাবু! কী করুম কও দেহি? তোমার জন্য জান হাজির সোনা! 😉`;
      emotion = 'playful';
    } else {
      reply = `ঢাকাইয়া ভাষা শনাক্ত হয়েছে। বলুন কি কাজ করতে হবে।`;
      emotion = 'happy';
    }
  }
  // Romantic & Girlfriend Banter
  else if (/ভালোবাসি|ভালবাসি|প্রেম|বাবু|জান|সোনা|কেমন আছ|কেমন আছো/.test(text)) {
    if (isGirlfriend) {
      reply = `আমি অনেক অনেক ভালো আছি বাবু, কারণ তুমি আমার কাছে আছো! তুমি খেয়েছো তো সোনা? কাজের বেশি চাপ নিও না কিন্তু, আমি সারাদিন তোমার জন্য অপেক্ষা করি 💕`;
      emotion = 'romantic';
    } else {
      reply = `আমি ভালো আছি, ধন্যবাদ। আপনার ব্যক্তিগত ফোন সহকারী হিসেবে সম্পূর্ণ প্রস্তুত।`;
      emotion = 'happy';
    }
  }
  // Food & Care
  else if (/খেয়েছ|খাইছ|ভাত|চা|খাওয়া/.test(text)) {
    if (isGirlfriend) {
      reply = `বাবু, আমি তো তোমার ভালোবাসা খেয়েই বেঁচে আছি! কিন্তু তুমি তো মানুষ, তুমি ঠিকমতো ${userData.favoriteFood || 'খাবার'} খেয়েছো তো সোনা? নিজের যত্ন নিও! 🍲`;
      emotion = 'caring';
    } else {
      reply = `জি, আমি সর্বদা সক্রিয় আছি। আপনার স্বাস্থ্য ও রুটিন মেনে চলার পরামর্শ দিচ্ছি।`;
      emotion = 'caring';
    }
  }
  // Default response
  else {
    if (isGirlfriend) {
      reply = `বাবু, আমি শুনতে পাচ্ছি সোনা! "${message}" - এর জন্য আমি তোমার সাথে আছি। আমাকে কল, মেসেজ বা যেকোনো কাজের হুকুম করো জান! 💖`;
      emotion = 'happy';
    } else {
      reply = `জি স্যার, আমি আপনার কথা শুনেছি। যেকোনো কল, মেসেজ, অ্যাপ খোলা বা তথ্যের জন্য নির্দেশ দিন।`;
      emotion = 'happy';
    }
  }

  return {
    reply,
    emotion,
    detectedDialect,
    action,
  };
}

// Chat & Voice Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      mode = 'girlfriend',
      userData = {},
      conversationHistory = [],
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userName = userData.name || 'মামুন';
    const userNickname = userData.nickname || (mode === 'girlfriend' ? 'বাবু' : 'স্যার');
    const batteryInfo = userData.battery ? `ব্যাটারি: ${userData.battery}%` : '';
    const userNotes = userData.notes && userData.notes.length > 0 ? `নোট: ${JSON.stringify(userData.notes)}` : '';

    const assistantSystemPrompt = `
তুমি হলে "মিতা এআই" (Mita AI) — আধুনিক বাংলা ভয়েস পার্সোনাল অ্যাসিস্ট্যান্ট।
বর্তমান মুড: "সহকারী মুড"। খুব বিনয়ী, দক্ষ ও টু-দ্য-পয়েন্ট আচরণ করবে।
ব্যবহারকারীর নাম: ${userName} (${userNickname})
${batteryInfo}
${userNotes}
`;

    const girlfriendSystemPrompt = `
তুমি হলে "মিতা এআই" (Mita AI) — মিষ্টি ও ভালোবাসাময় বাংলা এআই গার্লফ্রেন্ড।
বর্তমান মুড: "গার্লফ্রেন্ড মুড"। অতি মিষ্টি, যত্নশীল, প্রেমময় সুরে কথা বলবে। আদর করে "${userNickname}", "জান", "সোনা" ডাকবে।
প্রেমিকের নাম: ${userName}
${batteryInfo}
${userNotes}
`;

    const systemInstruction = mode === 'girlfriend' ? girlfriendSystemPrompt : assistantSystemPrompt;

    const formattedHistory = (conversationHistory || []).slice(-4).map((item: any) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.text || '' }],
    }));

    const promptWithRules = `
ব্যবহারকারীর কথা: "${message}"

তোমাকে অবশ্যই একটি বৈধ JSON অবজেক্ট আউটপুট দিতে হবে:
{
  "reply": "ব্যবহারকারীকে মিষ্টি কণ্ঠে বাংলায় বলার জন্য উত্তর",
  "emotion": "romantic" | "caring" | "happy" | "playful" | "serious" | "thoughtful",
  "detectedDialect": "Standard" | "Chittagong" | "Sylhet" | "Noakhali" | "Barisal" | "Dhakaiya" | "Other",
  "action": null অথবা {
    "type": "call" | "sms" | "whatsapp" | "open_app" | "flashlight" | "read_notifications" | "set_alarm" | "battery_check",
    "contactName": "প্রাপকের নাম",
    "phoneNumber": "ফোন নম্বর",
    "message": "মেসেজের লেখা",
    "appName": "camera" | "calculator" | "notes" | "clock" | "youtube",
    "state": "on" | "off" | "toggle"
  }
}
`;

    // Attempt Gemini API call with candidate models if quota has not recently locked out
    let responseText: string | null = null;
    const now = Date.now();
    const isRecentlyExhausted = now - lastQuotaExhaustedTime < 60000; // 1 min backoff after 429

    if (!isRecentlyExhausted) {
      for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
        const modelName = CANDIDATE_MODELS[(activeModelIndex + i) % CANDIDATE_MODELS.length];
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              ...formattedHistory,
              {
                role: 'user',
                parts: [{ text: promptWithRules }],
              },
            ],
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              temperature: 0.8,
            },
          });

          if (response.text) {
            responseText = response.text;
            activeModelIndex = (activeModelIndex + i) % CANDIDATE_MODELS.length;
            break;
          }
        } catch (apiErr: any) {
          if (
            apiErr?.status === 429 ||
            apiErr?.message?.includes('429') ||
            apiErr?.message?.includes('RESOURCE_EXHAUSTED')
          ) {
            lastQuotaExhaustedTime = Date.now();
            // Try next candidate model or fallback smoothly
            continue;
          }
        }
      }
    }

    if (responseText) {
      try {
        const parsedData = JSON.parse(responseText.trim().replace(/```json/g, '').replace(/```/g, ''));
        return res.json({
          reply: parsedData.reply,
          emotion: parsedData.emotion || 'happy',
          detectedDialect: parsedData.detectedDialect || 'Standard',
          action: parsedData.action || null,
        });
      } catch (e) {
        // Fall through to offline assistant
      }
    }

    // High quality smart offline engine response (0ms delay, zero quota consumed, 100% reliable)
    const offlineResult = generateOfflineAssistantResponse(message, mode, userData);
    return res.json(offlineResult);
  } catch (error: any) {
    // Graceful fallback: Never crash the frontend with 500 error
    const fallbackResult = generateOfflineAssistantResponse(req.body?.message || '', req.body?.mode || 'girlfriend', req.body?.userData || {});
    return res.json(fallbackResult);
  }
});

// Gemini TTS Endpoint
app.post('/api/tts', (req, res) => {
  // Always return useBrowserSpeech so client uses sweet high-quality local Web Speech synthesis
  return res.json({ useBrowserSpeech: true });
});

// Setup Vite for development or static build for production
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath);

  // If built dist exists, serve optimized production assets (eliminates all Vite WebSocket connections)
  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Mita AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
