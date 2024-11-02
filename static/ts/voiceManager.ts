import { Voice } from './types';

export class VoiceManager {
    private allVoices: Voice[] = [];
    
    async loadVoices(): Promise<void> {
        try {
            const response = await fetch('/voices');
            this.allVoices = await response.json();
            console.log('Loaded voices:', this.allVoices);
        } catch (error) {
            console.error('Error loading voices:', error);
        }
    }

    getLanguages(): string[] {
        return [...new Set(this.allVoices.map(voice => voice.Locale.split('-')[0]))].sort();
    }

    getFilteredVoices(selectedLanguage: string): Voice[] {
        const filteredVoices = selectedLanguage === 'all'
            ? [...this.allVoices]
            : this.allVoices.filter(voice => voice.Locale.split('-')[0] === selectedLanguage);

        return filteredVoices.sort((a, b) => {
            if (a.Locale !== b.Locale) {
                return a.Locale.localeCompare(b.Locale);
            }
            return a.FriendlyName.localeCompare(b.FriendlyName);
        });
    }
}
