class AudioPlayer {
	constructor() {
		// Use local music file
		this.audio = new Audio('music.mp3');
		this.audio.loop = true;
		this.isPlaying = false;
		this.volume = localStorage.getItem('musicVolume') || 0.5;
		this.audio.volume = this.volume;
	}

	toggle() {
		if (this.isPlaying) {
			this.audio.pause();
		} else {
			this.audio.play().catch(e => console.log('Playback failed:', e));
		}
		this.isPlaying = !this.isPlaying;
		return this.isPlaying;
	}

	setVolume(value) {
		this.volume = value;
		this.audio.volume = value;
		localStorage.setItem('musicVolume', value);
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
		this.isPlaying = false;
	}
}

// Initialize audio player
const audioPlayer = new AudioPlayer();

// Export for global access
window.audioPlayer = audioPlayer;
