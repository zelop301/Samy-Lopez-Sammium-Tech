/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class CosmosSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  // Sound nodes
  private mainGain: GainNode | null = null;
  private ambientOsc: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private delayNode: DelayNode | null = null;

  // Dynamic sound parameters
  private blackHoleOsc: OscillatorNode | null = null;
  private blackHoleGain: GainNode | null = null;
  private nebulaOsc: OscillatorNode | null = null;
  private nebulaGain: GainNode | null = null;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Main Gain Node
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);

      // Delay Node for cosmic spaciousness
      this.delayNode = this.ctx.createDelay(2.0);
      this.delayNode.delayTime.setValueAtTime(0.6, this.ctx.currentTime);
      const delayFeedback = this.ctx.createGain();
      delayFeedback.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.delayNode.connect(delayFeedback);
      delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.mainGain);

      // Create ambient background drones
      const frequencies = [73.42, 110.0, 146.83, 220.0]; // D2, A2, D3, A3
      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.mainGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        // Gentle modulation
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.05 + idx * 0.02, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.mainGain);
        
        if (idx % 2 === 0 && this.delayNode) {
          gain.connect(this.delayNode);
        }

        osc.start();
        this.ambientOsc.push(osc);
        this.ambientGains.push(gain);
      });

      // Special black hole deep rumble sub-bass
      this.blackHoleOsc = this.ctx.createOscillator();
      this.blackHoleOsc.type = 'sawtooth';
      this.blackHoleOsc.frequency.setValueAtTime(32.7, this.ctx.currentTime); // C1
      
      // Filter to keep only sub frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(60, this.ctx.currentTime);

      this.blackHoleGain = this.ctx.createGain();
      this.blackHoleGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.blackHoleOsc.connect(filter);
      filter.connect(this.blackHoleGain);
      this.blackHoleGain.connect(this.mainGain);
      this.blackHoleOsc.start();

      // Nebula shimmering choir
      this.nebulaOsc = this.ctx.createOscillator();
      this.nebulaOsc.type = 'triangle';
      this.nebulaOsc.frequency.setValueAtTime(440.0, this.ctx.currentTime); // A4
      
      const nebFilter = this.ctx.createBiquadFilter();
      nebFilter.type = 'bandpass';
      nebFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      nebFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Shimmer LFO
      const shimLfo = this.ctx.createOscillator();
      const shimLfoGain = this.ctx.createGain();
      shimLfo.frequency.setValueAtTime(4.5, this.ctx.currentTime);
      shimLfoGain.gain.setValueAtTime(15.0, this.ctx.currentTime);
      shimLfo.connect(shimLfoGain);
      shimLfoGain.connect(nebFilter.frequency);
      shimLfo.start();

      this.nebulaGain = this.ctx.createGain();
      this.nebulaGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.nebulaOsc.connect(nebFilter);
      nebFilter.connect(this.nebulaGain);
      if (this.delayNode) {
        this.nebulaGain.connect(this.delayNode);
      } else {
        this.nebulaGain.connect(this.mainGain);
      }
      this.nebulaOsc.start();

    } catch (e) {
      console.error('Web Audio API not supported or initialization failed:', e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.init();
    if (!this.ctx || !this.mainGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const targetGain = muted ? 0.0 : 0.8;
    this.mainGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 1.0);
  }

  public updateProximity(blackHoleDist: number, nebulaDist: number) {
    if (this.isMuted || !this.ctx) return;
    
    // Scale black hole rumble (dist range 0 to 150)
    if (this.blackHoleGain && this.blackHoleOsc) {
      const bhFactor = Math.max(0, 1 - blackHoleDist / 120);
      const bhTarget = bhFactor * 0.35;
      this.blackHoleGain.gain.setTargetAtTime(bhTarget, this.ctx.currentTime, 0.1);
      // Pitch shifts slightly when closer
      this.blackHoleOsc.frequency.setTargetAtTime(32.7 + bhFactor * 10, this.ctx.currentTime, 0.2);
    }

    // Scale nebula shimmering choir (dist range 0 to 200)
    if (this.nebulaGain && this.nebulaOsc) {
      const nebFactor = Math.max(0, 1 - nebulaDist / 180);
      const nebTarget = nebFactor * 0.12;
      this.nebulaGain.gain.setTargetAtTime(nebTarget, this.ctx.currentTime, 0.15);
      this.nebulaOsc.frequency.setTargetAtTime(440.0 + nebFactor * 110, this.ctx.currentTime, 0.3);
    }
  }

  // Play a brilliant synth trigger for supernovas
  public playSupernova() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    
    const time = this.ctx.currentTime;
    
    // Low rumble sweep
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 2.5);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, time);
    filter.frequency.exponentialRampToValueAtTime(30, time + 2.0);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.4, time + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 3.0);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);
    
    osc.start(time);
    osc.stop(time + 3.2);

    // High shimmer spark
    const sparkOsc = this.ctx.createOscillator();
    const sparkGain = this.ctx.createGain();
    
    sparkOsc.type = 'triangle';
    sparkOsc.frequency.setValueAtTime(880, time);
    sparkOsc.frequency.exponentialRampToValueAtTime(1760, time + 0.3);
    sparkOsc.frequency.exponentialRampToValueAtTime(110, time + 1.5);

    sparkGain.gain.setValueAtTime(0.001, time);
    sparkGain.gain.exponentialRampToValueAtTime(0.2, time + 0.05);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

    sparkOsc.connect(sparkGain);
    if (this.delayNode) {
      sparkGain.connect(this.delayNode);
    } else {
      sparkGain.connect(this.mainGain);
    }

    sparkOsc.start(time);
    sparkOsc.stop(time + 2.0);
  }

  // Play energetic spark trigger for star births or clicks
  public playClick() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, time);
    osc.frequency.exponentialRampToValueAtTime(150, time + 0.18); // Elegant digital pop down

    gainNode.gain.setValueAtTime(0.18, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gainNode);
    gainNode.connect(this.mainGain);
    osc.start(time);
    osc.stop(time + 0.25);
  }

  // Play high-frequency delicate crystal/photon chime for UI hovers
  public playHover() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;

    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, time);
    osc.frequency.exponentialRampToValueAtTime(2200, time + 0.05);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.04, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gainNode);
    if (this.delayNode) {
      gainNode.connect(this.delayNode);
    } else {
      gainNode.connect(this.mainGain);
    }
    osc.start(time);
    osc.stop(time + 0.15);
  }

  // Play a brilliant crystal resonance bell for achievements
  public playAchievement() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;

    const time = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 987.77, 1318.51]; // C5, E5, G5, B5, E6 (Major 7th high chord)
    
    chords.forEach((freq, index) => {
      if (!this.ctx || !this.mainGain) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time + index * 0.04); // Staggered arpeggio

      gainNode.gain.setValueAtTime(0.001, time);
      gainNode.gain.exponentialRampToValueAtTime(0.08, time + index * 0.04 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 2.5 + index * 0.1);

      osc.connect(gainNode);
      if (this.delayNode) {
        gainNode.connect(this.delayNode);
      } else {
        gainNode.connect(this.mainGain);
      }
      osc.start(time + index * 0.04);
      osc.stop(time + 3.0);
    });
  }

  // Play a futuristic resonant sweep for panel openings / materializations
  public playPanelOpen() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;

    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(440, time + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, time);
    filter.frequency.exponentialRampToValueAtTime(1600, time + 0.4);
    filter.Q.setValueAtTime(4.0, time);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.18, time + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);

    osc.start(time);
    osc.stop(time + 0.65);
  }

  // Play a massive cinematic sub-bass rumble swell for Galaxy Generation
  public playGenerateGalaxy() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;

    const time = this.ctx.currentTime;
    
    // Low sub swell
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(35, time); // Db1
    subOsc.frequency.linearRampToValueAtTime(55, time + 2.5);

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(40, time);
    subFilter.frequency.exponentialRampToValueAtTime(120, time + 2.0);

    subGain.gain.setValueAtTime(0.001, time);
    subGain.gain.exponentialRampToValueAtTime(0.48, time + 1.2);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 4.5);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.mainGain);

    subOsc.start(time);
    subOsc.stop(time + 4.8);

    // Sparkling high pass chime layer
    const chimeOsc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(800, time);
    chimeOsc.frequency.exponentialRampToValueAtTime(1800, time + 1.5);

    chimeGain.gain.setValueAtTime(0.001, time);
    chimeGain.gain.exponentialRampToValueAtTime(0.15, time + 0.8);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, time + 3.0);

    chimeOsc.connect(chimeGain);
    if (this.delayNode) {
      chimeGain.connect(this.delayNode);
    } else {
      chimeGain.connect(this.mainGain);
    }

    chimeOsc.start(time);
    chimeOsc.stop(time + 3.5);
  }

  // Play deep sweep trigger for collisions
  public playCollision() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;

    const time = this.ctx.currentTime;
    
    // Sub-bass growl sweep
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, time);
    osc.frequency.exponentialRampToValueAtTime(25, time + 4.0);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, time);
    
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.5, time + 1.0);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 5.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);

    osc.start(time);
    osc.stop(time + 5.5);
  }

  // Play faint heartbeat sub-bass thud (double beat)
  public playHeartbeat() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    // First beat of heartbeat
    const playBeat = (t: number) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(50, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.25);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(80, t);

      gainNode.gain.setValueAtTime(0.001, t);
      gainNode.gain.exponentialRampToValueAtTime(0.4, t + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.mainGain!);

      osc.start(t);
      osc.stop(t + 0.35);
    };

    playBeat(time);
    playBeat(time + 0.25); // Lub-dub double beat
  }

  // Play spectacular cosmic ignition transition (darkness tearing open and stars igniting!)
  public playCosmicIgnition() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    // 1. Heavy sub explosion
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    const subFilter = this.ctx.createBiquadFilter();

    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(65, time);
    subOsc.frequency.exponentialRampToValueAtTime(20, time + 2.5);

    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(100, time);

    subGain.gain.setValueAtTime(0.001, time);
    subGain.gain.exponentialRampToValueAtTime(0.7, time + 0.2);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 3.5);

    subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.mainGain);
    subOsc.start(time);
    subOsc.stop(time + 4.0);

    // 2. Sparkly stars chime cascade (multiple frequencies)
    const frequencies = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6
    frequencies.forEach((freq, index) => {
      const chimeOsc = this.ctx!.createOscillator();
      const chimeGain = this.ctx!.createGain();
      const delayTimeOffset = index * 0.15;

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, time + delayTimeOffset);
      chimeOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + delayTimeOffset + 1.2);

      chimeGain.gain.setValueAtTime(0.001, time + delayTimeOffset);
      chimeGain.gain.exponentialRampToValueAtTime(0.12, time + delayTimeOffset + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, time + delayTimeOffset + 2.0);

      chimeOsc.connect(chimeGain);
      if (this.delayNode) {
        chimeGain.connect(this.delayNode);
      } else {
        chimeGain.connect(this.mainGain!);
      }

      chimeOsc.start(time + delayTimeOffset);
      chimeOsc.stop(time + delayTimeOffset + 2.5);
    });
  }

  // Play event horizon crossover sound (passing through black hole into holographic observatory)
  public playGravityHumTransition() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    // 1. Gravity wave frequency sweep
    const gravityOsc = this.ctx.createOscillator();
    const gravityGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    gravityOsc.type = 'sine';
    gravityOsc.frequency.setValueAtTime(40, time);
    // Sweep up then plunge down
    gravityOsc.frequency.exponentialRampToValueAtTime(250, time + 1.5);
    gravityOsc.frequency.exponentialRampToValueAtTime(45, time + 3.5);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(150, time);
    filter.Q.setValueAtTime(1.5, time);

    gravityGain.gain.setValueAtTime(0.001, time);
    gravityGain.gain.exponentialRampToValueAtTime(0.65, time + 1.5);
    gravityGain.gain.exponentialRampToValueAtTime(0.001, time + 4.0);

    gravityOsc.connect(filter);
    filter.connect(gravityGain);
    gravityGain.connect(this.mainGain);

    gravityOsc.start(time);
    gravityOsc.stop(time + 4.5);

    // 2. High crystal chime representing holographic space resolution
    const hOsc = this.ctx.createOscillator();
    const hGain = this.ctx.createGain();

    hOsc.type = 'triangle';
    hOsc.frequency.setValueAtTime(880, time + 1.0);
    hOsc.frequency.exponentialRampToValueAtTime(1760, time + 3.0);

    hGain.gain.setValueAtTime(0.001, time + 1.0);
    hGain.gain.exponentialRampToValueAtTime(0.15, time + 1.5);
    hGain.gain.exponentialRampToValueAtTime(0.001, time + 4.0);

    hOsc.connect(hGain);
    if (this.delayNode) {
      hGain.connect(this.delayNode);
    } else {
      hGain.connect(this.mainGain);
    }

    hOsc.start(time + 1.0);
    hOsc.stop(time + 4.5);
  }

  // Play micro holographic beep for calibration lines and scanner sweeps
  public playHolographicBeep(freq = 1200, duration = 0.08, type: 'sine' | 'triangle' = 'sine') {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.08, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gainNode);
    gainNode.connect(this.mainGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // Play resonant glass chime for gyroscopic dimensional alignment
  public playResonantRing(freq = 220) {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    // Add slightly detuned harmonic for rich resonance
    osc2.frequency.setValueAtTime(freq * 1.501, time); 

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, time);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.25, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 2.6);
    osc2.stop(time + 2.6);
  }

  // Play rising hyperdrive engine rumble sweep
  public playHyperdriveEngine(duration = 4.0) {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const fmOsc = this.ctx.createOscillator();
    const fmGain = this.ctx.createGain();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(35, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + duration);

    fmOsc.type = 'sine';
    fmOsc.frequency.setValueAtTime(8, time); // 8Hz modulation for vibration

    fmGain.gain.setValueAtTime(15, time);
    fmGain.gain.linearRampToValueAtTime(45, time + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, time);
    filter.frequency.exponentialRampToValueAtTime(800, time + duration);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.45, time + duration * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration + 0.5);

    fmOsc.connect(fmGain);
    fmGain.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);

    osc.start(time);
    fmOsc.start(time);
    osc.stop(time + duration + 0.5);
    fmOsc.stop(time + duration + 0.5);
  }

  // Play white noise wormhole whoosh transition
  public playWormholeWhoosh() {
    if (this.isMuted || !this.ctx || !this.mainGain) return;
    const time = this.ctx.currentTime;

    // Synthesize a white noise buffer
    const bufferSize = this.ctx.sampleRate * 2.5; // 2.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(100, time);
    // Sweep the bandpass frequency up and then open it wide
    filter.frequency.exponentialRampToValueAtTime(4000, time + 1.2);
    filter.frequency.exponentialRampToValueAtTime(200, time + 2.5);
    filter.Q.setValueAtTime(2.0, time);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.35, time + 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 2.5);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.mainGain);

    noiseNode.start(time);
    noiseNode.stop(time + 2.6);
  }
}

export const soundEngine = new CosmosSoundEngine();
