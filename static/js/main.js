import { VoiceManager } from './voiceManager';
import { AudioManager } from './audioManager';
import { saveSettings, loadSettings } from './storage';
class App {
    constructor() {
        this.voiceManager = new VoiceManager();
        this.audioManager = new AudioManager();
        this.initializeElements();
        this.setupEventListeners();
    }
    initializeElements() {
        this.languageFilter = document.getElementById('languageFilter');
        this.voiceSelect = document.getElementById('voiceSelect');
        this.textInput = document.getElementById('textInput');
        this.convertButton = document.getElementById('convertButton');
    }
    setupEventListeners() {
        this.languageFilter.addEventListener('change', () => {
            this.updateVoiceList();
            this.saveCurrentSettings();
        });
        this.voiceSelect.addEventListener('change', () => this.saveCurrentSettings());
        this.textInput.addEventListener('input', () => this.saveCurrentSettings());
        this.convertButton.addEventListener('click', () => this.handleConvert());
    }
    async initialize() {
        try {
            await this.voiceManager.loadVoices();
            this.populateLanguageFilter();
            this.loadSavedSettings();
        }
        catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    populateLanguageFilter() {
        const languages = this.voiceManager.getLanguages();
        this.languageFilter.innerHTML = '<option value="all">All Languages</option>';
        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            this.languageFilter.appendChild(option);
        });
    }
    updateVoiceList() {
        const filteredVoices = this.voiceManager.getFilteredVoices(this.languageFilter.value);
        this.voiceSelect.innerHTML = '';
        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.ShortName;
            option.textContent = `${voice.Locale} - ${voice.FriendlyName}`;
            this.voiceSelect.appendChild(option);
        });
    }
    loadSavedSettings() {
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
    saveCurrentSettings() {
        saveSettings({
            language: this.languageFilter.value,
            voice: this.voiceSelect.value,
            text: this.textInput.value
        });
    }
    handleConvert() {
        this.audioManager.convertToSpeech(this.textInput.value, this.voiceSelect.value);
    }
}
// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();
});
