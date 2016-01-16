/**
 * Generates a random number from a specified range.
 */
class RandomOffsetGenerator {
	constructor(minOffset, maxOffset) {
		this.minOffset = minOffset || -2; // Offsets below 0
		this.maxOffset = maxOffset || 12; // Offsets above 0
		this.lastOffset = minOffset;
	}
	getRandomOffset() {
		var randomRange = -this.minOffset + this.maxOffset;
		this.lastOffset = Math.round(Math.random() * randomRange) + this.minOffset;
		return this.lastOffset;
	}
	getRandomOffsetFromArray(noteArray) {
		this.lastOffset = noteArray.length ? noteArray[parseInt(Math.random() * noteArray.length)] : 0;
		return this.lastOffset;
	}
	testScale() {
		this.lastOffset = this.lastOffset < this.maxOffset ? this.lastOffset + 1 : 0;
		return this.lastOffset;
	}
}