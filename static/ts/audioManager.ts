export class AudioManager {
    private audioPlayer: HTMLAudioElement;
    private convertButton: HTMLButtonElement;

    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
        this.convertButton = document.getElementById('convertButton') as HTMLButtonElement;
    }

    async convertToSpeech(text: string, voice: string): Promise<void> {
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
        } catch (error) {
            console.error('Error:', error);
            alert('Error converting text to speech');
            this.resetButton();
        }
    }

    private isPlaying(): boolean {
        return Boolean(this.audioPlayer.src) && !this.audioPlayer.paused;
    }

    private stop(): void {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.convertButton.textContent = 'Convert to Speech';
    }

    private setLoadingState(): void {
        this.convertButton.disabled = true;
        this.convertButton.innerHTML = 'Converting... <span class="spinner"></span>';
    }

    private async fetchAudio(text: string, voice: string): Promise<Blob> {
        const response = await fetch(`/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('TTS request failed');
        }

        return await response.blob();
    }

    private async playAudio(blob: Blob): Promise<void> {
        const audioUrl = URL.createObjectURL(blob);
        this.audioPlayer.src = audioUrl;
        this.audioPlayer.style.display = 'block';

        this.setupAudioListeners();
        await this.audioPlayer.play();
    }

    private setupAudioListeners(): void {
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

    private resetButton(): void {
        this.convertButton.disabled = false;
        this.convertButton.textContent = 'Convert to Speech';
    }
}
