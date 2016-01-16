/**
 * A digitally controlled oscillator
 * Creates an oscillator that attaches itself to an audiocontext
 * while exposing conveince methods for setting frequency in hertz.
 *
 * @param AudioContext audioContext
 */
class DCO extends AudioCable {
	constructor(audioContext) {
		super(audioContext);
		this.oscNode = this.audioContext.createOscillator();
		this.defaultFrequency = 220;
		this.oscNode.type = 'sine';
		this.oscNode.frequency.value = this.defaultFrequency;
		this.oscNode.connect(this.cable);
		// The oscillator is always "running"
		// TODO: Research cost of killing and creating on stop and start
		this.oscNode.start(0);
	}
	waveform(waveformType) {
		this.oscNode.type = waveformType || 'sine';
	}
	frequency(hz) {
		this.oscNode.frequency.setValueAtTime(hz, this.audioContext.currentTime);
	}
}