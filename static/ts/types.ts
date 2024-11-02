export interface Voice {
    Locale: string;
    ShortName: string;
    FriendlyName: string;
}

export interface TTSSettings {
    language: string;
    voice: string;
    text: string;
}
