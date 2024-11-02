import { TTSSettings } from './types';

export function saveSettings(settings: TTSSettings): void {
    localStorage.setItem('ttsSettings', JSON.stringify(settings));
}

export function loadSettings(): TTSSettings {
    return JSON.parse(localStorage.getItem('ttsSettings') || '{}');
}
