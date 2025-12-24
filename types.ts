
export interface EmojiTranslation {
  id: string;
  mood: string;
  emojis: string;
  timestamp: number;
}

export interface TranslationResponse {
  emojis: string;
  error?: string;
}
