import { VoiceManager } from './voiceManager';
import { AudioManager } from './audioManager';
import { saveSettings, loadSettings } from './storage';

class App {
    private voiceManager: VoiceManager;
    private audioManager: AudioManager;
    private languageFilter!: HTMLSelectElement;
    private voiceSelect!: HTMLSelectElement;
    private textInput!: HTMLTextAreaElement;
    private convertButton!: HTMLButtonElement;

    constructor() {
        this.voiceManager = new VoiceManager();
        this.audioManager = new AudioManager();
        this.initializeElements();
        this.setupEventListeners();
    }

    private initializeElements(): void {
        this.languageFilter = document.getElementById('languageFilter') as HTMLSelectElement;
        this.voiceSelect = document.getElementById('voiceSelect') as HTMLSelectElement;
        this.textInput = document.getElementById('textInput') as HTMLTextAreaElement;
        this.convertButton = document.getElementById('convertButton') as HTMLButtonElement;
    }

    private setupEventListeners(): void {
        this.languageFilter.addEventListener('change', () => {
            this.updateVoiceList();
            this.saveCurrentSettings();
        });

        this.voiceSelect.addEventListener('change', () => this.saveCurrentSettings());
        this.textInput.addEventListener('input', () => this.saveCurrentSettings());
        this.convertButton.addEventListener('click', () => this.handleConvert());
    }

    async initialize(): Promise<void> {
        try {
            await this.voiceManager.loadVoices();
            this.populateLanguageFilter();
            this.loadSavedSettings();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    private populateLanguageFilter(): void {
        const languages = this.voiceManager.getLanguages();
        this.languageFilter.innerHTML = '<option value="all">All Languages</option>';
        
        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            this.languageFilter.appendChild(option);
        });
    }

    private updateVoiceList(): void {
        const filteredVoices = this.voiceManager.getFilteredVoices(this.languageFilter.value);
        this.voiceSelect.innerHTML = '';
        
        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.ShortName;
            option.textContent = `${voice.Locale} - ${voice.FriendlyName}`;
            this.voiceSelect.appendChild(option);
        });
    }

    private loadSavedSettings(): void {
        const settings = loadSettings();
        
        if (settings.language) {
            this.languageFilter.value = settings.language;
            this.updateVoiceList();
        }

        if (settings.voice) {
            setTimeout(() => {
                this.voiceSelect.value = settings.voice;
            }, 100);
        }

        if (settings.text) {
            this.textInput.value = settings.text;
        }
    }

    private saveCurrentSettings(): void {
        saveSettings({
            language: this.languageFilter.value,
            voice: this.voiceSelect.value,
            text: this.textInput.value
        });
    }

    private handleConvert(): void {
        this.audioManager.convertToSpeech(this.textInput.value, this.voiceSelect.value);
    }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});
