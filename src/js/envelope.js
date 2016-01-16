/**
 * Connect an AudioNode to the envelope
 */
class Envelope extends AudioCable {
	constructor(audioContext) {
		super(audioContext);
		this.attackTime = 0.1;  // 100ms
		this.releaseTime = 0.5; // 500ms
	}

	applyEnvelope() {
		let now = this.audioContext.currentTime;
		this.cable.gain.setValueAtTime(0.0, now);
		this.cable.gain.linearRampToValueAtTime(1.0, now + this.attackTime);
		this.cable.gain.linearRampToValueAtTime(0.0, now + this.attackTime + this.releaseTime);
	}
}