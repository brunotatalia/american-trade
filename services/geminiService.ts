
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT, API_KEY_WARNING } from '../constants';
import { GameEvent } from "../types";

let ai: GoogleGenAI | null = null;
const apiKey = process.env.API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(API_KEY_WARNING);
}

export const isGeminiAvailable = (): boolean => !!ai;

export const generateText = async (prompt: string, useThinkingBudgetZero: boolean = false): Promise<string> => {
  if (!ai) {
    // Fallback if API key is not available
    console.warn("Gemini API not initialized. Returning placeholder text.");
    return `Placeholder response: Gemini API key not configured. Original prompt: ${prompt}`;
  }

  try {
    const config = useThinkingBudgetZero ? { thinkingConfig: { thinkingBudget: 0 } } : {};
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: prompt,
        config: config
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while contacting Gemini.";
  }
};

export const generateMarketNews = async (commodityName: string, eraName: string): Promise<string> => {
    if (!isGeminiAvailable()) {
        return `Market update for ${commodityName}: Stable conditions reported in the ${eraName} era. (Gemini offline)`;
    }
    const prompt = `You are a financial news anchor for the game "American Dream Trader". 
    Generate a very short, impactful, and era-appropriate (currently ${eraName}) news headline (under 15 words) about the ${commodityName} market. 
    It could be bullish, bearish, or neutral. Be creative and concise. For example: "${commodityName} prices surge on new industrial demand!" or "Uncertainty looms over ${commodityName} market."`;
    return generateText(prompt, true); // Use thinkingBudget: 0 for faster, potentially less nuanced news.
};

export const generateGameEventDescription = async (eraName: string, playerStatusHint?: string): Promise<{title: string, description: string, type: GameEvent['type']}> => {
    if (!isGeminiAvailable()) {
        return {
            title: "Routine Check",
            description: `A standard day in the ${eraName}. Nothing extraordinary to report. (Gemini offline)`,
            type: 'neutral'
        };
    }
    const playerContext = playerStatusHint ? `The player is currently ${playerStatusHint}.` : "";
    const prompt = `You are a game master for "American Dream Trader". 
    The current era is ${eraName}. ${playerContext}
    Generate a concise, flavorful random event for the player.
    Provide a "title" (max 5 words), a "description" (max 30 words), and a "type" ('positive', 'negative', 'neutral', or 'opportunity').
    Format the response as a JSON object with keys "title", "description", and "type".
    Example: {"title": "Unexpected Windfall", "description": "An old investment suddenly pays off.", "type": "positive"}`;
    
    const responseText = await generateText(prompt);

    try {
        let jsonStr = responseText.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
          jsonStr = match[2].trim();
        }
        const parsed = JSON.parse(jsonStr);
        if (parsed.title && parsed.description && ['positive', 'negative', 'neutral', 'opportunity'].includes(parsed.type)) {
            return { title: parsed.title, description: parsed.description, type: parsed.type as GameEvent['type'] };
        }
        throw new Error("Invalid JSON structure from Gemini for game event.");
    } catch (error) {
        console.error("Failed to parse game event from Gemini:", error, "Raw response:", responseText);
        return {
            title: "Mysterious Signal",
            description: `Market whispers speak of strange occurrences. The true meaning is unclear. (Gemini parse error: ${responseText.substring(0,50)}...)`,
            type: 'neutral'
        };
    }
};
