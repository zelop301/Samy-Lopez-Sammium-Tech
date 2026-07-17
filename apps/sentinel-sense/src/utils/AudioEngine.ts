// Web Audio API Synthesizer for Sentinel Sense
class AudioEngine {
  private ctx: AudioContext | null = null;
  private continuousOsc: OscillatorNode | null = null;
  private continuousGain: GainNode | null = null;
  private isMuted: boolean = true;
  private droneInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser.", e);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopDrone();
    } else {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  // Plays a sci-fi radar ping sweep when scanning
  playScanPing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Sweep frequency from 1200Hz down to 200Hz
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {
      console.error(e);
    }
  }

  // Plays a sharp alert trigger sound for dynamic risk hikes
  playAlertTrigger() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Create a rapid double alert beep
      const ctx = this.ctx;
      const now = ctx.currentTime;
      [0, 0.15].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, now + delay);
        gain.gain.setValueAtTime(0.08, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Dynamic continuous low-frequency drone that pulses faster/louder as risk score rises
  updateDrone(overallScore: number) {
    if (this.isMuted) {
      this.stopDrone();
      return;
    }
    this.init();
    if (!this.ctx) return;

    // Only play drone if threat is ELEVATED (>45)
    if (overallScore < 45) {
      this.stopDrone();
      return;
    }

    try {
      if (!this.continuousOsc) {
        this.continuousOsc = this.ctx.createOscillator();
        this.continuousGain = this.ctx.createGain();
        
        // Use triangle wave for a deep, vibrating drone (like Spider-Sense buzz)
        this.continuousOsc.type = "triangle";
        this.continuousOsc.frequency.setValueAtTime(90, this.ctx.currentTime); // Low bass buzz
        
        this.continuousGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
        this.continuousOsc.connect(this.continuousGain);
        this.continuousGain.connect(this.ctx.destination);
        this.continuousOsc.start();
      }

      // Frequency rises slightly with threat score (90Hz to 180Hz)
      const targetFreq = 90 + ((overallScore - 45) * 1.5);
      this.continuousOsc.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.5);

      // Volume or pulse rate scales with intensity
      const normalizedThreat = (overallScore - 45) / 55; // 0.0 to 1.0
      const pulseSpeedMs = Math.max(200, 1000 - (normalizedThreat * 750)); // pulses faster as threat rises
      const maxVolume = 0.02 + (normalizedThreat * 0.04);

      if (this.droneInterval) {
        clearInterval(this.droneInterval);
      }

      // Rhythmically pulse the gain node
      this.droneInterval = setInterval(() => {
        if (!this.ctx || !this.continuousGain) return;
        const now = this.ctx.currentTime;
        this.continuousGain.gain.cancelScheduledValues(now);
        this.continuousGain.gain.setValueAtTime(0.01, now);
        this.continuousGain.gain.linearRampToValueAtTime(maxVolume, now + (pulseSpeedMs / 2000));
        this.continuousGain.gain.linearRampToValueAtTime(0.01, now + (pulseSpeedMs / 1000));
      }, pulseSpeedMs);

    } catch (e) {
      console.error(e);
    }
  }

  stopDrone() {
    if (this.droneInterval) {
      clearInterval(this.droneInterval);
      this.droneInterval = null;
    }
    if (this.continuousOsc) {
      try {
        this.continuousOsc.stop();
        this.continuousOsc.disconnect();
      } catch (e) {}
      this.continuousOsc = null;
    }
    if (this.continuousGain) {
      try {
        this.continuousGain.disconnect();
      } catch (e) {}
      this.continuousGain = null;
    }
  }

  // Plays an ultra-crisp, short mechanical click sound for panel haptics
  playTactileClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(3200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }

  // Plays a deep, resonant sub-bass energy discharge from the AI Core
  playCorePulse() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.7);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.75);
    } catch (e) {
      console.error(e);
    }
  }
}

export const audioEngine = new AudioEngine();
