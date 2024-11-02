export class AudioManager {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.convertButton = document.getElementById('convertButton');
    }
    async convertToSpeech(text, voice) {
        if (this.isPlaying()) {
            this.stop();
            return;
        }
        if (!text) {
            alert('Please enter some text');
            return;
        }
        try {
            this.setLoadingState();
            const blob = await this.fetchAudio(text, voice);
            await this.playAudio(blob);
        }
        catch (error) {
            console.error('Error:', error);
            alert('Error converting text to speech');
            this.resetButton();
        }
    }
    isPlaying() {
        return Boolean(this.audioPlayer.src) && !this.audioPlayer.paused;
    }
    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.convertButton.textContent = 'Convert to Speech';
    }
    setLoadingState() {
        this.convertButton.disabled = true;
        this.convertButton.innerHTML = 'Converting... <span class="spinner"></span>';
    }
    async fetchAudio(text, voice) {
        const response = await fetch(`/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('TTS request failed');
        }
        return await response.blob();
    }
    async playAudio(blob) {
        const audioUrl = URL.createObjectURL(blob);
        this.audioPlayer.src = audioUrl;
        this.audioPlayer.style.display = 'block';
        this.setupAudioListeners();
        await this.audioPlayer.play();
    }
    setupAudioListeners() {
        this.audioPlayer.onplay = () => {
            this.convertButton.textContent = 'Stop';
            this.convertButton.disabled = false;
        };
        this.audioPlayer.onended = () => {
            this.convertButton.textContent = 'Convert to Speech';
        };
        this.audioPlayer.onpause = () => {
            this.convertButton.textContent = 'Convert to Speech';
        };
    }
    resetButton() {
        this.convertButton.disabled = false;
        this.convertButton.textContent = 'Convert to Speech';
    }
}
