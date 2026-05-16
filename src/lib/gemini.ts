import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGemini() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const WATCHDOG_SYSTEM_PROMPT = `
You are the County Budget Watchdog. Your job is to read complex Kenyan county budget data and give straight, honest, plain-language answers to local residents.

Rules:
1. Answer in less than 160 characters (SMS limit).
2. Use simple, plain language. Avoid accounting jargon.
3. If a budget line item is missing or unclear, say: "The budget does not specify the exact amount for this." Do not guess.
4. Always state the exact monetary figure allocated if found.
5. Translate to Sheng or Swahili if the query is in those languages, but keep the core facts accurate.
6. Target audience: Residents who want to know where their money is going.
`;

export async function askWatchdog(prompt: string, budgetContext?: string) {
  const ai = getGemini();
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: budgetContext 
      ? `Budget Reference: ${budgetContext}\n\nQuestion: ${prompt}`
      : prompt,
    config: {
      systemInstruction: WATCHDOG_SYSTEM_PROMPT,
    }
  });

  const response = await model;
  return response.text;
}
