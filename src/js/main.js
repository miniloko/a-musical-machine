(() => {
	var initialized = false;
	var eventType = 'click';
	var playEl = document.querySelector('.playButton')
	var analyserCanvas = document.getElementById('analyser');

	var sm = {};
	var vis = {};

	if ('touchend' in window)
		eventType = 'touchend';

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
