/**
 * Duct tapes the parts together into a
 * sounding machine.
 */
class SoundMachine {
	constructor() {
		var AudioContext = window.AudioContext || window.webkitAudioContext || false;
		if (!AudioContext) return;

		// Polyphony
		this.maxVoices = 6;
		this.currentVoiceIx = 0;
		this.voices = [];

		this.audioContext = new AudioContext();
		this.note         = new Note('EQUAL_TEMPERED');
		this.rng          = new RandomOffsetGenerator(-5, 12);
		this.melody       = new MelodyGenerator();
		this.trigGen      = new TriggerGenerator(this.audioContext);
		this.bus          = new Bus(this.audioContext);
		this.reverb       = new Reverb(this.audioContext);
		this.controls     = document.querySelector('.controls').elements;

		this.bus.insertEffect(this.reverb);
		this.bus.wetBalance(0.4);
		this.bus.connectTo(this.audioContext.destination);
	}

	startSound() {
		this.bus.unmute();
		this.trigGen.listen(this.onTrig, this);
		this.trigGen.startRandom();
		this.onTrig();
	}

	stopSound() {
		this.bus.mute();
		this.trigGen.stop();
		this.trigGen.unListen(this.onTrig);
	}

	onTrig() {
		var nextNote = this.melody.nextNote();

		if (nextNote) {
			var voice = this.getVoice();
			var attack = this.controls['attack'].value;
			var release = this.controls['release'].value;

			voice.env.attackTime = parseFloat(attack);
			voice.env.releaseTime = parseFloat(release);

			voice.osc.frequency(this.note.noteOffsetToHz(this.note.noteToOffset(nextNote)));
			voice.osc.connectTo(voice.env.cable);
			voice.env.connectTo(this.bus.cable);
			voice.env.applyEnvelope();
		}
	}

	// Simple polyphony
	getVoice() {
		if (this.voices.length < this.maxVoices) {
			this.voices.push({
				osc: new DCO(this.audioContext),
				env: new Envelope(this.audioContext)
			});
		}

		var voice = this.voices[this.currentVoiceIx];

		this.currentVoiceIx = this.currentVoiceIx < this.maxVoices - 1 ? (this.currentVoiceIx + 1) : 0;
		return voice;
	};
}