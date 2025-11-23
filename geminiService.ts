import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const polishPitch = async (rawText: string, habit: string): Promise<string> => {
  if (!genAI) return rawText;

  try {
    const prompt = `
      You are an editor for a premium, calm accountability app called "Habit Dating". 
      The user is writing a pitch to find an accountability partner for the habit of "${habit}".
      Rewrite the following text to be concise, motivating, and premium. 
      Max 140 characters. No emojis. Tone: Serious, dedicated, but warm.
      
      Input: "${rawText}"
    `;
    
    // Note: The system instruction asked to use ai.models.generateContent. 
    // Adapting to the specific library method structure requested in instructions.
    // Correct usage based on @google/genai guidelines provided.
    
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text?.trim() || rawText;
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    return rawText;
  }
};

export const generateCompatibility = async (userBio: string, myBio: string): Promise<string> => {
    if (!genAI) return "High compatibility based on shared goals.";

    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze compatibility between two accountability partners. 
            Person A: "${userBio}"
            Person B: "${myBio}"
            Output a single short sentence (max 10 words) highlighting why they work well together.`
        });
        return response.text?.trim() || "Great potential for shared growth.";
    } catch (error) {
        return "Great potential for shared growth.";
    }
}