/**
 * Simple semantic wrapper for AudioNode functionality
 *
 * AudioCable.cable is simply an exposed GainNode
 */
class AudioCable {
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.cable = this.audioContext.createGain();
	}

	connectTo(audioNode) {
		this.cable.connect(audioNode);
	}

	disconnectFrom(audioNode) {
		this.cable.disconnect(audioNode);
	}
}