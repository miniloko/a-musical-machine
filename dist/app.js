"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Simple semantic wrapper for AudioNode functionality
 *
 * AudioCable.cable is simply an exposed GainNode
 */

var AudioCable = (function () {
	function AudioCable(audioContext) {
		_classCallCheck(this, AudioCable);

		this.audioContext = audioContext;
		this.cable = this.audioContext.createGain();
	}

	_createClass(AudioCable, [{
		key: "connectTo",
		value: function connectTo(audioNode) {
			this.cable.connect(audioNode);
		}
	}, {
		key: "disconnectFrom",
		value: function disconnectFrom(audioNode) {
			this.cable.disconnect(audioNode);
		}
	}]);

	return AudioCable;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Bus is a "mixer bus"-type utility which
 * supports basic insert effect(s) capability,
 * with a global wet/dry to all the insert effects
 *
 * TODO: Wet/dry mixing doesn't seem to work on mobile.
 */

var Bus = (function (_AudioCable) {
	_inherits(Bus, _AudioCable);

	function Bus(audioContext) {
		_classCallCheck(this, Bus);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Bus).call(this, audioContext));

		_this2.dry = new AudioCable(audioContext);
		_this2.wet = new AudioCable(audioContext);
		_this2.master = new AudioCable(audioContext);
		_this2.effects = new Set();
		_this2.gain = 1;
		// Internally split signal into two
		_this2.cable.connect(_this2.dry.cable);
		_this2.cable.connect(_this2.wet.cable);
		// Connect both signals to "master"
		_this2.dry.connectTo(_this2.master.cable);
		_this2.wet.connectTo(_this2.master.cable);
		return _this2;
	}

	_createClass(Bus, [{
		key: "connectTo",
		value: function connectTo(audioNode) {
			// Expose master instead of this.cable
			this.master.connectTo(audioNode);
		}
	}, {
		key: "disconnectFrom",
		value: function disconnectFrom(audioNode) {
			this.master.disconnectFrom(audioNode);
		}
	}, {
		key: "mute",
		value: function mute() {
			this.master.cable.gain.value = 0;
			this.master.cable.gain.value = 0;
		}
	}, {
		key: "unmute",
		value: function unmute() {
			this.master.cable.gain.value = this.gain;
		}
	}, {
		key: "wetBalance",
		value: function wetBalance(balance) {
			this.dry.cable.gain.value = 1 - balance;
			this.wet.cable.gain.value = balance;
		}
	}, {
		key: "insertEffect",
		value: function insertEffect(effect) {
			this.cable.disconnect(this.wet.cable);
			this.effects.add(effect);
			this.buildEffectChain();
		}
	}, {
		key: "removeEffect",
		value: function removeEffect(effect) {
			if (this.effects.delete(effect)) {
				this.buildEffectChain();
			}
		}
	}, {
		key: "buildEffectChain",
		value: function buildEffectChain() {
			var currEffectIx = 0;
			var previousEffect = {};
			var _this = this;

			this.effects.forEach(function (effect) {
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
	}]);

	return Bus;
})(AudioCable);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Connect an AudioNode to the envelope
 */

var Envelope = (function (_AudioCable) {
	_inherits(Envelope, _AudioCable);

	function Envelope(audioContext) {
		_classCallCheck(this, Envelope);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Envelope).call(this, audioContext));

		_this.attackTime = 0.1; // 100ms
		_this.releaseTime = 0.5; // 500ms
		return _this;
	}

	_createClass(Envelope, [{
		key: "applyEnvelope",
		value: function applyEnvelope() {
			var now = this.audioContext.currentTime;
			this.cable.gain.setValueAtTime(0.0, now);
			this.cable.gain.linearRampToValueAtTime(1.0, now + this.attackTime);
			this.cable.gain.linearRampToValueAtTime(0.0, now + this.attackTime + this.releaseTime);
		}
	}]);

	return Envelope;
})(AudioCable);
'use strict';

(function () {
	var initialized = false;
	var eventType = 'click';
	var playEl = document.querySelector('.playButton');
	var analyserCanvas = document.getElementById('analyser');

	var sm = {};
	var vis = {};

	if ('touchend' in window) eventType = 'touchend';

	// We need to wait until a touchend event occurs on mobile
	playEl.addEventListener(eventType, playHandler);

	function playHandler(evt) {
		if (!initialized) {
			sm = new SoundMachine();
			vis = new Visualiser(sm.audioContext, sm.bus.master.cable, analyserCanvas.offsetWidth, analyserCanvas.offsetHeight);
			initialized = true;
		}

		evt.preventDefault();

		var icon = playEl.querySelector('span');
		if (icon.classList.contains('play--paused')) {
			icon.classList.remove('play--paused');
			icon.classList.add('play--playing');
			sm.startSound();
		} else {
			icon.classList.remove('play--playing');
			icon.classList.add('play--paused');
			sm.stopSound();
		}
	}
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MelodyGenerator = (function () {
	function MelodyGenerator() {
		_classCallCheck(this, MelodyGenerator);

		this.noteGroups = [['c4', 'a3', 'c4', 'e3', 'g4', '', 'd5', ''], ['d4', 'a4', 'f4', 'f3', 'e4', 'd3', '', ''], ['e4', 'd4', 'c4', 'g3', 'e3', '', 'a3', ''], ['d3', 'f4', 'c4', 'd4', '', 'a4', 'a3', '']];

		this.currentStep = 1;
		this.currentGroupIx = 0;
	}

	_createClass(MelodyGenerator, [{
		key: 'nextNote',
		value: function nextNote() {
			var noteIx = this.currentStep % this.noteGroups[this.currentGroupIx].length;
			var note = '';

			// At the end of each note group - pick a new, random group
			if (noteIx === 0) {
				this.currentGroupIx = Math.floor(Math.random() * this.noteGroups.length);
				noteIx = this.noteGroups[this.currentGroupIx].length;
			}

			note = this.noteGroups[this.currentGroupIx][noteIx - 1];
			this.currentStep++;

			return note !== '' ? note : false;
		}
	}]);

	return MelodyGenerator;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Handles note to hertz conversions
 */

var Note = (function () {
	function Note(scaleName) {
		_classCallCheck(this, Note);

		this.scales = {
			BOHLEN_PIERCE: {
				noteDelta: 1.08818,
				baseFrequency: 10,
				baseOffset: 0,
				minOffset: -45,
				maxOffset: 45
			},
			EQUAL_TEMPERED: {
				noteDelta: 1.0594545454545454,
				baseFrequency: 16.3591205, // C0 - http://www.phy.mtu.edu/~suits/notefreqs.html
				baseOffset: 0, // 36 = C3 TODO: Remove?
				minOffset: 0, // C0
				maxOffset: 108, // B8
				baseNotes: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
			}
		};

		this.setScale(scaleName || 'BOHLEN_PIERCE');
	}

	/**
  * Set the scale to be used for hertz conversion
  */

	_createClass(Note, [{
		key: 'setScale',
		value: function setScale(scaleName) {
			if (typeof this.scales[scaleName] !== 'undefined') {
				this.scale = this.scales[scaleName];
			}
		}

		/**
   * Takes a note offset, adds to base offset and
   * returns it's corresponding hz
   */

	}, {
		key: 'noteOffsetToHz',
		value: function noteOffsetToHz(offset) {
			// Add base offset to passed offset
			offset += this.scale.baseOffset; // TODO: Remove?
			// Make sure result is still in range
			offset = Math.min(this.scale.maxOffset, Math.max(this.scale.minOffset, offset));
			// Zero offsets are === baseOffset
			offset = offset === 0 ? this.scale.baseOffset : offset;
			// Convert to hertz
			return this.scale.baseFrequency * Math.pow(this.scale.noteDelta, offset);
		}

		/**
   * Takes a note as string and returns an offset on the scale
   * The following works: "C2", "C", "C#", "C#2"
   * If the octave is not specified, we fall back to 3
   *
   * Only works with the EQUAL_TEMPERED scale right now
   */

	}, {
		key: 'noteToOffset',
		value: function noteToOffset(noteString) {
			if (typeof this.scale.baseNotes === 'undefined') return;

			var splitString = noteString.split(/(\d)/);
			var note = splitString[0];
			var oct = splitString.length > 1 ? splitString[1] : 3;
			var noteOffset = oct * this.scale.baseNotes.length + this.scale.baseNotes.indexOf(note);
			return noteOffset;
		}
	}]);

	return Note;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A digitally controlled oscillator
 * Creates an oscillator that attaches itself to an audiocontext
 * while exposing conveince methods for setting frequency in hertz.
 *
 * @param AudioContext audioContext
 */

var DCO = (function (_AudioCable) {
	_inherits(DCO, _AudioCable);

	function DCO(audioContext) {
		_classCallCheck(this, DCO);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DCO).call(this, audioContext));

		_this.oscNode = _this.audioContext.createOscillator();
		_this.defaultFrequency = 220;
		_this.oscNode.type = 'sine';
		_this.oscNode.frequency.value = _this.defaultFrequency;
		_this.oscNode.connect(_this.cable);
		// The oscillator is always "running"
		// TODO: Research cost of killing and creating on stop and start
		_this.oscNode.start(0);
		return _this;
	}

	_createClass(DCO, [{
		key: 'waveform',
		value: function waveform(waveformType) {
			this.oscNode.type = waveformType || 'sine';
		}
	}, {
		key: 'frequency',
		value: function frequency(hz) {
			this.oscNode.frequency.setValueAtTime(hz, this.audioContext.currentTime);
		}
	}]);

	return DCO;
})(AudioCable);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Reverb = (function (_AudioCable) {
	_inherits(Reverb, _AudioCable);

	function Reverb(audioContext) {
		_classCallCheck(this, Reverb);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Reverb).call(this, audioContext));

		_this.seconds = 5;
		_this.decay = 3;
		_this.cable = _this.audioContext.createConvolver(); // Replace GainNode with ConvolverNode
		_this.createImpulse();
		return _this;
	}

	_createClass(Reverb, [{
		key: 'createImpulse',
		value: function createImpulse(length, decay) {
			var rate = this.audioContext.sampleRate;
			var length = rate * this.seconds; // 48000 * seconds
			var decay = this.decay;
			var impulse = this.audioContext.createBuffer(2, length, rate);
			var impulseL = impulse.getChannelData(0);
			var impulseR = impulse.getChannelData(1);
			var n,
			    i = 0;

			console.time('building impulse');
			for (; i < length; i++) {
				n = this.reverse ? length - i : i;
				impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
				impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
			}
			console.timeEnd('building impulse');

			this.cable.buffer = impulse;
		}
	}]);

	return Reverb;
})(AudioCable);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Duct tapes the parts together into a
 * sounding machine.
 */

var SoundMachine = (function () {
	function SoundMachine() {
		_classCallCheck(this, SoundMachine);

		var AudioContext = window.AudioContext || window.webkitAudioContext || false;
		if (!AudioContext) return;

		// Polyphony
		this.maxVoices = 6;
		this.currentVoiceIx = 0;
		this.voices = [];

		this.audioContext = new AudioContext();
		this.note = new Note('EQUAL_TEMPERED');
		this.rng = new RandomOffsetGenerator(-5, 12);
		this.melody = new MelodyGenerator();
		this.trigGen = new TriggerGenerator(this.audioContext);
		this.bus = new Bus(this.audioContext);
		this.reverb = new Reverb(this.audioContext);
		this.controls = document.querySelector('.controls').elements;

		this.bus.insertEffect(this.reverb);
		this.bus.wetBalance(0.4);
		this.bus.connectTo(this.audioContext.destination);
	}

	_createClass(SoundMachine, [{
		key: 'startSound',
		value: function startSound() {
			this.bus.unmute();
			this.trigGen.listen(this.onTrig, this);
			this.trigGen.startRandom();
			this.onTrig();
		}
	}, {
		key: 'stopSound',
		value: function stopSound() {
			this.bus.mute();
			this.trigGen.stop();
			this.trigGen.unListen(this.onTrig);
		}
	}, {
		key: 'onTrig',
		value: function onTrig() {
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

	}, {
		key: 'getVoice',
		value: function getVoice() {
			if (this.voices.length < this.maxVoices) {
				this.voices.push({
					osc: new DCO(this.audioContext),
					env: new Envelope(this.audioContext)
				});
			}

			var voice = this.voices[this.currentVoiceIx];

			this.currentVoiceIx = this.currentVoiceIx < this.maxVoices - 1 ? this.currentVoiceIx + 1 : 0;
			return voice;
		}
	}]);

	return SoundMachine;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Triggers an event every beat at a set BPM
 */

var TriggerGenerator = (function () {
	function TriggerGenerator(audioContext) {
		_classCallCheck(this, TriggerGenerator);

		var bufferSize = 256;
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

	_createClass(TriggerGenerator, [{
		key: "listen",
		value: function listen(func, scope) {
			scope = scope || this;
			this.listeners.add({ func: func, scope: scope });
		}

		/**
   * Unlisten to triggers.
   */

	}, {
		key: "unListen",
		value: function unListen(func) {
			var _this = this;
			if (_this.listeners.size === 0) return;

			_this.listeners.forEach(function (listener) {
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

	}, {
		key: "start",
		value: function start(bpm) {
			var _this = this;
			if (_this.isRunning === true) return;

			_this.bpm = bpm || _this.bpm;

			_this.isRunning = true;
			_this.scriptProcessor.connect(this.audioContext.destination); // TODO: Remove?

			// Experiment using the very precise onaudioprocess+currentTime combo
			// of figuring out if a trig is going to be executed.
			_this.scriptProcessor.onaudioprocess = function audioProcessHandler() {
				var now = _this.audioContext.currentTime;
				var beatsPerSecond = 60 / _this.bpm;

				if (now >= _this.timeOfLastTrigger + beatsPerSecond) {
					_this.timeOfLastTrigger = now;
					// Call trig listeners
					_this.trig.call(_this);
				}
			};
		}

		/**
   * Start triggering at random intervals
   */

	}, {
		key: "startRandom",
		value: function startRandom() {
			// Each "beat" will trigger setRandomBpm
			this.listen(this.setRandomBpm, this);
			this.start();
		}

		/**
   * Each new bpm is based on the previous value,
   * making it gradually swing towards faster or
   * slower tempos.
   */

	}, {
		key: "setRandomBpm",
		value: function setRandomBpm() {
			var minBpm = Math.max(this.bpm - 40, 10);
			var maxBpm = Math.min(this.bpm + 40, 180);
			var range = -minBpm + maxBpm;
			this.bpm = Math.floor(Math.random() * range + minBpm);
		}
	}, {
		key: "stop",
		value: function stop() {
			this.scriptProcessor.disconnect(this.audioContext.destination);
			this.isRunning = false;
		}
	}, {
		key: "trig",
		value: function trig() {
			this.listeners.forEach(function (listener) {
				listener.func.call(listener.scope);
			});
		}
	}]);

	return TriggerGenerator;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generates a random number from a specified range.
 */

var RandomOffsetGenerator = (function () {
	function RandomOffsetGenerator(minOffset, maxOffset) {
		_classCallCheck(this, RandomOffsetGenerator);

		this.minOffset = minOffset || -2; // Offsets below 0
		this.maxOffset = maxOffset || 12; // Offsets above 0
		this.lastOffset = minOffset;
	}

	_createClass(RandomOffsetGenerator, [{
		key: "getRandomOffset",
		value: function getRandomOffset() {
			var randomRange = -this.minOffset + this.maxOffset;
			this.lastOffset = Math.round(Math.random() * randomRange) + this.minOffset;
			return this.lastOffset;
		}
	}, {
		key: "getRandomOffsetFromArray",
		value: function getRandomOffsetFromArray(noteArray) {
			this.lastOffset = noteArray.length ? noteArray[parseInt(Math.random() * noteArray.length)] : 0;
			return this.lastOffset;
		}
	}, {
		key: "testScale",
		value: function testScale() {
			this.lastOffset = this.lastOffset < this.maxOffset ? this.lastOffset + 1 : 0;
			return this.lastOffset;
		}
	}]);

	return RandomOffsetGenerator;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visualiser = (function () {
	function Visualiser(audioContext, audioNode, width, height) {
		_classCallCheck(this, Visualiser);

		this.width = width;
		this.height = height;

		this.player = document.querySelector('.player');
		this.canvasPlaceholder = document.querySelector('.canvas-placeholder');
		this.canvas = document.createElement('canvas');
		this.canvas.classList.add('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.player.removeChild(this.canvasPlaceholder);
		this.player.appendChild(this.canvas);

		this.levelEl = document.getElementById('soundLevel');

		this.canvasCtx = this.canvas.getContext('2d');

		this.analyser = audioContext.createAnalyser();
		this.analyser.fftSize = 512;

		this.bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Uint8Array(this.bufferLength);

		audioNode.connect(this.analyser);
		this.draw();
	}

	// draw an oscilloscope of the current audio source

	_createClass(Visualiser, [{
		key: 'draw',
		value: function draw() {
			var _this = this;

			_this.analyser.getByteTimeDomainData(_this.dataArray);

			_this.canvasCtx.fillStyle = 'rgba(34, 70, 108, 0.3)';
			_this.canvasCtx.fillRect(0, 0, _this.width, _this.height);

			_this.canvasCtx.lineWidth = 2.5;
			_this.canvasCtx.strokeStyle = '#BAA847';

			_this.canvasCtx.beginPath();

			var sliceWidth = _this.width * 1.0 / _this.bufferLength;
			var x = 0;

			for (var i = 0; i < _this.bufferLength; i++) {
				var v = _this.dataArray[i] / 128.0;
				var y = v * _this.height / 2;

				if (i === 0) {
					_this.canvasCtx.moveTo(x, y);
				} else {
					_this.canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			_this.canvasCtx.stroke();

			window.requestAnimationFrame(function () {
				_this.draw.apply(_this);
			});
		}
	}]);

	return Visualiser;
})();
//# sourceMappingURL=app.js.map
