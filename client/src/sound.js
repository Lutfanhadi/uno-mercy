// Web Audio API Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmOsc = null;
let bgmGain = null;
let isBgmPlaying = false;

// Increase base volume
const VOL = 1.5;

export const playCardSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(1 * VOL, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

export const drawCardSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.8 * VOL, audioCtx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

export const hoverSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.05 * VOL, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

export const unoSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const freqs = [523.25, 659.25, 783.99, 1046.50]; 
  freqs.forEach((freq, i) => {
    setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.4 * VOL, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    }, i * 50);
  });
};

export const mercySound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 1);
  gain.gain.setValueAtTime(0.8 * VOL, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1);
};

export const toggleBgm = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  if (isBgmPlaying) {
    if (bgmOsc) {
      bgmGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      setTimeout(() => bgmOsc.stop(), 500);
    }
    isBgmPlaying = false;
  } else {
    bgmOsc = audioCtx.createOscillator();
    bgmGain = audioCtx.createGain();
    
    // Create a low ominous drone for "No Mercy" theme
    bgmOsc.type = 'sine';
    bgmOsc.frequency.setValueAtTime(60, audioCtx.currentTime); // Deep bass
    
    // Add an LFO to pulse the volume
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // Pulse every 2 seconds
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(bgmGain.gain);
    lfo.start();

    bgmGain.gain.setValueAtTime(0, audioCtx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(0.15 * VOL, audioCtx.currentTime + 2); // Fade in
    
    bgmOsc.connect(bgmGain);
    bgmGain.connect(audioCtx.destination);
    
    bgmOsc.start();
    isBgmPlaying = true;
  }
  return isBgmPlaying;
};
