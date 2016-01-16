class Reverb extends AudioCable {
	constructor(audioContext) {
		super(audioContext);
		this.seconds = 5;
		this.decay = 3;
		this.cable = this.audioContext.createConvolver(); // Replace GainNode with ConvolverNode
		this.createImpulse();
	}

	createImpulse(length, decay) {
		var rate = this.audioContext.sampleRate;
		var length = rate * this.seconds; // 48000 * seconds
		var decay = this.decay;
		var impulse = this.audioContext.createBuffer(2, length, rate);
		var impulseL = impulse.getChannelData(0);
		var impulseR = impulse.getChannelData(1);
		var n, i = 0;

		console.time('building impulse');
		for (; i < length; i++) {
			n = this.reverse ? length - i : i;
			impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
			impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
		}
		console.timeEnd('building impulse');

		this.cable.buffer = impulse;
	}
}