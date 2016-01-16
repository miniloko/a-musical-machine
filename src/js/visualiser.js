class Visualiser {
	constructor(audioContext, audioNode, width, height) {
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
	draw() {
		let _this = this;

		_this.analyser.getByteTimeDomainData(_this.dataArray);

		_this.canvasCtx.fillStyle =  'rgba(34, 70, 108, 0.3)';
		_this.canvasCtx.fillRect(0, 0, _this.width, _this.height);

		_this.canvasCtx.lineWidth = 2.5;
		_this.canvasCtx.strokeStyle = '#BAA847';

		_this.canvasCtx.beginPath();

		let sliceWidth = _this.width * 1.0 / _this.bufferLength;
		let x = 0;

		for(var i = 0; i < _this.bufferLength; i++) {
			var v = _this.dataArray[i] / 128.0;
			var y = v * _this.height/2;

			if(i === 0) {
				_this.canvasCtx.moveTo(x, y);
			} else {
				_this.canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		_this.canvasCtx.stroke();

		window.requestAnimationFrame(function() {
			_this.draw.apply(_this);
		});
    }
}