
export enum Sentiment {
  Positive = 'Positivo',
  Negative = 'Negativo',
  Neutral = 'Neutro',
}

export interface SentimentResult {
  marca: string;
  sentimento: Sentiment;
  resumo: string;
}
