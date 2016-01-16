class MelodyGenerator {
	constructor() {
		this.noteGroups = [
			['c4', 'a3', 'c4', 'e3', 'g4',   '', 'd5', ''],
			['d4', 'a4', 'f4', 'f3', 'e4', 'd3',   '', ''],
			['e4', 'd4', 'c4', 'g3', 'e3',   '', 'a3', ''],
			['d3', 'f4', 'c4', 'd4',   '', 'a4', 'a3', '']
		];

		this.currentStep = 1;
		this.currentGroupIx = 0;
	}

	nextNote() {
		var noteIx = this.currentStep % this.noteGroups[this.currentGroupIx].length;
		var note = '';

		// At the end of each note group - pick a new, random group
		if (noteIx === 0) {
			this.currentGroupIx = Math.floor(Math.random() * this.noteGroups.length);
			noteIx = this.noteGroups[this.currentGroupIx].length;
		}

		note = this.noteGroups[this.currentGroupIx][noteIx - 1];
		this.currentStep++;

		return note !== '' ? note : false
	}

}