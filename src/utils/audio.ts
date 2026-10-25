/**
 * Audio Synthesis & Sound Effects Utility
 * Handles Web Audio API sounds and Speech Synthesis / Recognition
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play a pleasant warm chime when Mita activates
export function playChimeSound(type: 'activate' | 'done' | 'heart' = 'activate') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'activate') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'heart') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    // AudioContext might be blocked before first user click
  }
}

// Ringtone generator for incoming / outgoing calls
let ringtoneOsc: OscillatorNode | null = null;
let ringtoneGain: GainNode | null = null;
let ringtoneInterval: any = null;

export function startRingtoneSound() {
  stopRingtoneSound();
  try {
    const ctx = getAudioContext();
    const playRingCycle = () => {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now); // Standard ringback
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.15, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    };

    playRingCycle();
    ringtoneInterval = setInterval(playRingCycle, 3000);
  } catch (e) {
    console.warn('Ringtone sound error:', e);
  }
}

export function stopRingtoneSound() {
  if (ringtoneInterval) {
    clearInterval(ringtoneInterval);
    ringtoneInterval = null;
  }
  if (ringtoneOsc) {
    try { ringtoneOsc.stop(); } catch (e) {}
    ringtoneOsc = null;
  }
  if (ringtoneGain) {
    ringtoneGain = null;
  }
}

let currentAudioObj: HTMLAudioElement | null = null;

// Clean text for speech
function sanitizeSpeechText(text: string): string {
  return text
    .replace(/[*_#`~[\]()]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();
}

/**
 * Play authentic sweet cute girl voice using streaming Bengali female audio
 * with automatic fallback to female-only Web Speech API
 */
export function playCuteGirlVoice(
  text: string,
  mode: 'girlfriend' | 'assistant',
  customPitch = 1.4,
  customRate = 0.98,
  onStart?: () => void,
  onEnd?: () => void
): void {
  stopSpeaking();

  const clean = sanitizeSpeechText(text);
  if (!clean) {
    onEnd?.();
    return;
  }

  // 1. Try real authentic Bengali Female TTS stream
  const audioUrl = `/api/tts-audio?text=${encodeURIComponent(clean)}`;
  const audio = new Audio(audioUrl);
  currentAudioObj = audio;

  // Make voice slightly higher and cuter for sweet girlfriend tone
  if (mode === 'girlfriend') {
    (audio as any).preservesPitch = false;
    audio.playbackRate = 1.09; // Raises the female pitch by 9% into sweet cute anime/girlfriend soprano
  } else {
    audio.playbackRate = 1.02;
  }

  audio.onplay = () => {
    onStart?.();
  };

  audio.onended = () => {
    currentAudioObj = null;
    onEnd?.();
  };

  audio.onerror = () => {
    // If stream fails or network drops, fallback to filtered female Web Speech API
    currentAudioObj = null;
    speakWithBrowserSynthesis(clean, mode, customPitch, customRate, onStart, onEnd);
  };

  audio.play().catch(() => {
    // Autoplay policy or fetch error fallback
    currentAudioObj = null;
    speakWithBrowserSynthesis(clean, mode, customPitch, customRate, onStart, onEnd);
  });
}

// Text to Speech using Web Speech API (Strictly female voice, never male)
export function speakWithBrowserSynthesis(
  text: string,
  mode: 'girlfriend' | 'assistant',
  customPitch = 1.4,
  customRate = 0.98,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) {
    onEnd?.();
    return null;
  }

  window.speechSynthesis.cancel();
  const cleanText = sanitizeSpeechText(text);
  if (!cleanText) {
    onEnd?.();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Helper to check if a voice is male (STRICTLY BAN ALL MALE VOICES)
  const isMaleVoice = (v: SpeechSynthesisVoice) => {
    const name = (v.name + ' ' + v.voiceURI).toLowerCase();
    return (
      name.includes('male') ||
      name.includes('david') ||
      name.includes('george') ||
      name.includes('mark') ||
      name.includes('guy') ||
      name.includes('man') ||
      name.includes('ravi') ||
      name.includes('stefan') ||
      name.includes('pablo') ||
      name.includes('hemant') ||
      name.includes('kalpana-male') ||
      name.includes('bnd-network-male')
    );
  };

  // Find preferred cute female voice
  let voices = window.speechSynthesis.getVoices().filter((v) => !isMaleVoice(v));

  // If voices empty, wait for event
  if (!voices || voices.length === 0) {
    voices = window.speechSynthesis.getVoices().filter((v) => !isMaleVoice(v));
  }

  // 1. Look for verified female Bengali voice
  const banglaFemaleVoice = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || !isMaleVoice(v))
  );

  // 2. Look for any pleasant female voice (Samantha, Victoria, Karen, Zira, etc.)
  const femaleVoiceFallback = voices.find(
    (v) =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('girl') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('fiona') ||
      v.name.toLowerCase().includes('veena') ||
      v.name.toLowerCase().includes('ayesha') ||
      v.name.toLowerCase().includes('bni-female')
  ) || voices[0];

  const selectedVoice = banglaFemaleVoice || femaleVoiceFallback;
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || 'bn-BD';
  } else {
    utterance.lang = 'bn-BD';
  }

  // Set high, sweet, youthful pitch so it always sounds like a cute girl (never a male voice)
  if (mode === 'girlfriend') {
    utterance.pitch = Math.max(1.35, Math.min(customPitch, 1.55)); // Sweet cute soprano
    utterance.rate = Math.max(0.9, Math.min(customRate, 1.05));
  } else {
    utterance.pitch = 1.25;
    utterance.rate = 1.0;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (currentAudioObj) {
    currentAudioObj.pause();
    currentAudioObj.src = '';
    currentAudioObj = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
