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

// Text to Speech using Web Speech API (with sweet girl tuning)
export function speakWithBrowserSynthesis(
  text: string,
  mode: 'girlfriend' | 'assistant',
  customPitch = 1.25,
  customRate = 0.95,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    onEnd?.();
    return null;
  }

  window.speechSynthesis.cancel();

  // Strip JSON codeblocks or awkward markdown for clear speech
  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) {
    onEnd?.();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Pre-fetch and find preferred Bengali female voice
  let voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
    };
  }

  const banglaVoice = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.includes('Bangla') || v.name.includes('Bengali'))
  ) || voices.find((v) => v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben'))
    || voices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('samantha'))
    || voices[0];

  if (banglaVoice) {
    utterance.voice = banglaVoice;
  }

  utterance.lang = banglaVoice?.lang || 'bn-BD';

  // Sweet girl emotional cadence:
  // Girlfriend mode: higher sweet pitch (1.25 - 1.35), gentle warmth
  // Assistant mode: balanced polite pitch (1.1)
  if (mode === 'girlfriend') {
    utterance.pitch = Math.max(1.1, Math.min(customPitch, 1.45));
    utterance.rate = Math.max(0.85, Math.min(customRate, 1.05));
  } else {
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
