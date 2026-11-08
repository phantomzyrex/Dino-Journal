// Web Audio API synthesizer for subtle page-flip and deep paleontological resonance effects.
// Muted by default; user can toggle in the top menu or action bar popover.

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled = false;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPageTick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.045);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio errors if blocked by autoplay policy
    }
  }

  public playDinoRoar(pitchFactor = 1) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      subOsc.type = 'triangle';

      const baseFreq = 72 * pitchFactor;
      osc.frequency.setValueAtTime(baseFreq * 1.35, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.72, now + 0.65);

      subOsc.frequency.setValueAtTime(baseFreq * 0.65, now);
      subOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.65);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.65);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 0.7);
      subOsc.stop(now + 0.7);
    } catch {
      // Ignore audio errors
    }
  }
}

export const soundManager = new SoundManager();
