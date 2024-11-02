export function saveSettings(settings) {
    localStorage.setItem('ttsSettings', JSON.stringify(settings));
}
export function loadSettings() {
    return JSON.parse(localStorage.getItem('ttsSettings') || '{}');
}
