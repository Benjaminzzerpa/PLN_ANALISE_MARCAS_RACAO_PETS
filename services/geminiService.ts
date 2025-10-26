
import { GoogleGenAI, Type } from "@google/genai";
import { SentimentResult, Sentiment } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            marca: {
                type: Type.STRING,
                description: 'O nome da marca de ração analisada.',
            },
            sentimento: {
                type: Type.STRING,
                enum: [Sentiment.Positive, Sentiment.Negative, Sentiment.Neutral],
                description: `O sentimento geral dos comentários sobre a marca. Deve ser um dos seguintes: '${Sentiment.Positive}', '${Sentiment.Negative}', ou '${Sentiment.Neutral}'.`
            },
            resumo: {
                type: Type.STRING,
                description: 'Um resumo conciso de uma frase explicando a razão para o sentimento atribuído.'
            }
        },
        required: ['marca', 'sentimento', 'resumo'],
    },
};

export const analyzeSentiments = async (comments: string, brands: string): Promise<SentimentResult[]> => {
    try {
        const brandsList = brands.split(',').map(b => b.trim()).filter(b => b);
        let prompt: string;

        if (brandsList.length > 0) {
            prompt = `Analise o sentimento dos seguintes comentários de clientes sobre estas marcas de ração para cães e gatos: ${brandsList.join(', ')}. Para cada marca, determine se o sentimento geral é '${Sentiment.Positive}', '${Sentiment.Negative}' ou '${Sentiment.Neutral}'. Forneça um breve resumo de uma frase explicando o sentimento. Ignore qualquer outra marca não listada. Comentários:\n\n---\n${comments}\n---`;
        } else {
            prompt = `Primeiro, identifique as marcas de ração para cães e gatos mencionadas nos comentários a seguir. Em seguida, para cada marca identificada, analise o sentimento geral dos comentários relacionados. Determine se o sentimento é '${Sentiment.Positive}', '${Sentiment.Negative}' ou '${Sentiment.Neutral}' e forneça um breve resumo de uma frase explicando o sentimento. Comentários:\n\n---\n${comments}\n---`;
        }
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const parsedResults: SentimentResult[] = JSON.parse(jsonText);
        
        // Ensure sentiment values match the enum
        return parsedResults.filter(result => 
            Object.values(Sentiment).includes(result.sentimento)
        );

    } catch (error) {
        console.error("Error analyzing sentiments:", error);
        if (error instanceof Error) {
            throw new Error(`Falha ao analisar os sentimentos. Detalhes: ${error.message}`);
        }
        throw new Error("Ocorreu um erro desconhecido durante a análise de sentimentos.");
    }
};
