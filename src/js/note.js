/**
 * Handles note to hertz conversions
 */
class Note {
	constructor(scaleName) {
		this.scales = {
			BOHLEN_PIERCE: {
				noteDelta: 1.08818,
				baseFrequency: 10,
				baseOffset: 0,
				minOffset: -45,
				maxOffset: 45,
			},
			EQUAL_TEMPERED: {
				noteDelta: 1.0594545454545454,
				baseFrequency: 16.3591205, // C0 - http://www.phy.mtu.edu/~suits/notefreqs.html
				baseOffset: 0,   // 36 = C3 TODO: Remove?
				minOffset: 0,    // C0
				maxOffset: 108,  // B8
				baseNotes: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b']
			}
		};

		this.setScale(scaleName || 'BOHLEN_PIERCE');
	}

	/**
	 * Set the scale to be used for hertz conversion
	 */
	setScale(scaleName) {
		if (typeof this.scales[scaleName] !== 'undefined') {
			this.scale = this.scales[scaleName];
		}
	}

	/**
	 * Takes a note offset, adds to base offset and
	 * returns it's corresponding hz
	 */
	noteOffsetToHz(offset) {
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
	noteToOffset(noteString) {
		if (typeof this.scale.baseNotes === 'undefined') return;

		let splitString = noteString.split(/(\d)/);
		let note = splitString[0];
		let oct = splitString.length > 1 ? splitString[1] : 3;
		let noteOffset = oct * this.scale.baseNotes.length + this.scale.baseNotes.indexOf(note);
		return noteOffset;
	}
}