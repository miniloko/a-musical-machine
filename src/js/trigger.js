/**
 * Triggers an event every beat at a set BPM
 */
class TriggerGenerator {
	constructor(audioContext) {
		let bufferSize = 256;
		this.audioContext = audioContext;
		this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
		this.bpm = 100;
		this.isRunning = false;
		this.timeOfLastTrigger = 0;
		this.listeners = new Set();
	}

	/**
	 * Simple trigger listener registration
	 */
	listen(func, scope) {
		scope = scope || this;
		this.listeners.add({func: func, scope: scope});
	}

	/**
	 * Unlisten to triggers.
	 */
	unListen(func) {
		let _this = this;
		if (_this.listeners.size === 0) return;

		_this.listeners.forEach(function(listener){
			// This func already registered? Remove.
			if (listener.func === func) {
				_this.listeners.delete(listener);
				return;
			}
		});
	}

	/**
	 * Start triggering @ optional bpm
	 */
	start(bpm) {
		let _this = this;
		if (_this.isRunning === true) return;

		_this.bpm = bpm || _this.bpm;

		_this.isRunning = true;
		_this.scriptProcessor.connect(this.audioContext.destination); // TODO: Remove?

		// Experiment using the very precise onaudioprocess+currentTime combo
		// of figuring out if a trig is going to be executed.
		_this.scriptProcessor.onaudioprocess = function audioProcessHandler() {
			let now = _this.audioContext.currentTime;
			let beatsPerSecond = 60 / _this.bpm;

			if (now >= _this.timeOfLastTrigger + beatsPerSecond) {
				_this.timeOfLastTrigger = now;
				// Call trig listeners
				_this.trig.call(_this);
			}
		}
	}

	/**
	 * Start triggering at random intervals
	 */
	startRandom() {
		// Each "beat" will trigger setRandomBpm
		this.listen(this.setRandomBpm, this);
		this.start();
	}

	/**
	 * Each new bpm is based on the previous value,
	 * making it gradually swing towards faster or
	 * slower tempos.
	 */
	setRandomBpm() {
		var minBpm = Math.max(this.bpm - 40, 10);
		var maxBpm = Math.min(this.bpm + 40, 180);
		var range = -minBpm + maxBpm;
		this.bpm = Math.floor(Math.random() * range + minBpm);
	}

	stop() {
		this.scriptProcessor.disconnect(this.audioContext.destination);
		this.isRunning = false;
	}

	trig() {
		this.listeners.forEach(function(listener) {
			listener.func.call(listener.scope);
		});
	}
}