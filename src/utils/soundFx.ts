class SoundEngine {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    this.init();
    if (!this.audioCtx) return;

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  playPop() {
    this.playTone(600, 'sine', 0.1, 0.2);
  }

  playClick() {
    this.playTone(800, 'triangle', 0.05, 0.1);
  }

  playDiceRoll() {
    this.init();
    if (!this.audioCtx) return;
    
    // Rapid marimba-like sounds to simulate a rolling dice
    let time = this.audioCtx.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = 300 + Math.random() * 200;
      
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + 0.1);
      
      time += 0.15; // speed of rolling
    }
  }

  playSuccess() {
    this.init();
    if (!this.audioCtx) return;
    // A nice ascending chord
    const time = this.audioCtx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, i) => { // A major chord
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, time + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, time + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.5);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(time + i * 0.1);
      osc.stop(time + i * 0.1 + 0.5);
    });
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.3, 0.3);
  }
}

export const soundManager = new SoundEngine();
