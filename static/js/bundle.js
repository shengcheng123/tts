// static/ts/voiceManager.ts
var VoiceManager = class {
  constructor() {
    this.allVoices = [];
  }
  async loadVoices() {
    try {
      const response = await fetch("/voices");
      this.allVoices = await response.json();
      console.log("Loaded voices:", this.allVoices);
    } catch (error) {
      console.error("Error loading voices:", error);
    }
  }
  getLanguages() {
    return [...new Set(this.allVoices.map((voice) => voice.Locale.split("-")[0]))].sort();
  }
  getFilteredVoices(selectedLanguage) {
    const filteredVoices = selectedLanguage === "all" ? [...this.allVoices] : this.allVoices.filter((voice) => voice.Locale.split("-")[0] === selectedLanguage);
    return filteredVoices.sort((a, b) => {
      if (a.Locale !== b.Locale) {
        return a.Locale.localeCompare(b.Locale);
      }
      return a.FriendlyName.localeCompare(b.FriendlyName);
    });
  }
};

// static/ts/audioManager.ts
var AudioManager = class {
  constructor() {
    this.audioPlayer = document.getElementById("audioPlayer");
    this.convertButton = document.getElementById("convertButton");
  }
  async convertToSpeech(text, voice) {
    if (this.isPlaying()) {
      this.stop();
      return;
    }
    if (!text) {
      alert("Please enter some text");
      return;
    }
    try {
      this.setLoadingState();
      const blob = await this.fetchAudio(text, voice);
      await this.playAudio(blob);
    } catch (error) {
      console.error("Error:", error);
      alert("Error converting text to speech");
      this.resetButton();
    }
  }
  isPlaying() {
    return Boolean(this.audioPlayer.src) && !this.audioPlayer.paused;
  }
  stop() {
    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;
    this.convertButton.textContent = "Convert to Speech";
  }
  setLoadingState() {
    this.convertButton.disabled = true;
    this.convertButton.innerHTML = 'Converting... <span class="spinner"></span>';
  }
  async fetchAudio(text, voice) {
    const response = await fetch(`/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`, {
      method: "POST"
    });
    if (!response.ok) {
      throw new Error("TTS request failed");
    }
    return await response.blob();
  }
  async playAudio(blob) {
    const audioUrl = URL.createObjectURL(blob);
    this.audioPlayer.src = audioUrl;
    this.audioPlayer.style.display = "block";
    this.setupAudioListeners();
    await this.audioPlayer.play();
  }
  setupAudioListeners() {
    this.audioPlayer.onplay = () => {
      this.convertButton.textContent = "Stop";
      this.convertButton.disabled = false;
    };
    this.audioPlayer.onended = () => {
      this.convertButton.textContent = "Convert to Speech";
    };
    this.audioPlayer.onpause = () => {
      this.convertButton.textContent = "Convert to Speech";
    };
  }
  resetButton() {
    this.convertButton.disabled = false;
    this.convertButton.textContent = "Convert to Speech";
  }
};

// static/ts/storage.ts
function saveSettings(settings) {
  localStorage.setItem("ttsSettings", JSON.stringify(settings));
}
function loadSettings() {
  return JSON.parse(localStorage.getItem("ttsSettings") || "{}");
}

// static/ts/main.ts
var App = class {
  constructor() {
    this.voiceManager = new VoiceManager();
    this.audioManager = new AudioManager();
    this.initializeElements();
    this.setupEventListeners();
  }
  initializeElements() {
    this.languageFilter = document.getElementById("languageFilter");
    this.voiceSelect = document.getElementById("voiceSelect");
    this.textInput = document.getElementById("textInput");
    this.convertButton = document.getElementById("convertButton");
  }
  setupEventListeners() {
    this.languageFilter.addEventListener("change", () => {
      this.updateVoiceList();
      this.saveCurrentSettings();
    });
    this.voiceSelect.addEventListener("change", () => this.saveCurrentSettings());
    this.textInput.addEventListener("input", () => this.saveCurrentSettings());
    this.convertButton.addEventListener("click", () => this.handleConvert());
  }
  async initialize() {
    try {
      await this.voiceManager.loadVoices();
      this.populateLanguageFilter();
      this.loadSavedSettings();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }
  populateLanguageFilter() {
    const languages = this.voiceManager.getLanguages();
    this.languageFilter.innerHTML = '<option value="all">All Languages</option>';
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = language;
      this.languageFilter.appendChild(option);
    });
  }
  updateVoiceList() {
    const filteredVoices = this.voiceManager.getFilteredVoices(this.languageFilter.value);
    this.voiceSelect.innerHTML = "";
    filteredVoices.forEach((voice) => {
      const option = document.createElement("option");
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
};
window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.initialize();
});
