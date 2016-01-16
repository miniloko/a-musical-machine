/**
 * Bus is a "mixer bus"-type utility which
 * supports basic insert effect(s) capability,
 * with a global wet/dry to all the insert effects
 *
 * TODO: Wet/dry mixing doesn't seem to work on mobile.
 */
class Bus extends AudioCable {
	constructor(audioContext) {
		super(audioContext);
		this.dry    = new AudioCable(audioContext);
		this.wet    = new AudioCable(audioContext);
		this.master = new AudioCable(audioContext);
		this.effects = new Set();
		this.gain = 1;
		// Internally split signal into two
		this.cable.connect(this.dry.cable);
		this.cable.connect(this.wet.cable);
		// Connect both signals to "master"
		this.dry.connectTo(this.master.cable);
		this.wet.connectTo(this.master.cable);
	}

	connectTo(audioNode) {
		// Expose master instead of this.cable
		this.master.connectTo(audioNode);
	}

	disconnectFrom(audioNode) {
		this.master.disconnectFrom(audioNode);
	}

	mute() {
		this.master.cable.gain.value = 0;
		this.master.cable.gain.value = 0;
	}

	unmute() {
		this.master.cable.gain.value = this.gain;
	}

	wetBalance(balance) {
		this.dry.cable.gain.value = 1 - balance;
		this.wet.cable.gain.value = balance;
	}

	insertEffect(effect) {
		this.cable.disconnect(this.wet.cable);
		this.effects.add(effect);
		this.buildEffectChain();
	}

	removeEffect(effect) {
		if (this.effects.delete(effect)) {
			this.buildEffectChain();
		}
	}

	buildEffectChain() {
		let currEffectIx = 0;
		let previousEffect = {};
		let _this = this;

		this.effects.forEach(function(effect) {
			effect.cable.disconnect();
			// First effect needs to be hooked to the wet cable
			if (currEffectIx === 0) {
				effect.connectTo(_this.wet.cable);
				_this.cable.connect(effect.cable);
			} else {
				_this.effect.connectTo(previousEffect);
			}

			currEffectIx++;
			previousEffect = effect; // Will this crash?
		});
	}
}