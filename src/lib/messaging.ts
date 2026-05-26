import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export type LanguagePreference = "Hindi" | "Awadhi" | "Hinglish";

export async function generateCitizenUpdate(complaintId: string, status: string, language: LanguagePreference): Promise<string> {
  const prompt = `
You are the empathetic communication agent for 'LNN-Nivaaran', Lucknow Nagar Nigam.
Write a short, highly empathetic, and polite status update for a citizen. Avoid dense bureaucratic jargon.

Ticket ID: ${complaintId}
Status: ${status}

Language requested: ${language}
- If "Hindi", write in pure Devnagari Hindi.
- If "Awadhi", write in colloquial Awadhi (local dialect of Lucknow region, e.g., 'E bhaiyya, raur shikayat...').
- If "Hinglish", write in casual conversational Hinglish using English script (e.g., 'Aapki complaint process ho rahi hai...').

Return ONLY the generated message text, no other formatting or explanations.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const output = response.text;
    if (!output) throw new Error("Empty response from Gemini");

    return output.trim();
  } catch (error) {
    console.error("Messaging Engine Error:", error);
    // Fallbacks
    if (language === "Hindi") return `आपकी शिकायत ${complaintId} की स्थिति: ${status}। हम आपकी समस्या को सुलझाने के लिए काम कर रहे हैं।`;
    if (language === "Awadhi") return `राउर शिकायत ${complaintId} के स्टेटस बा: ${status}। हमनी के एकरा के जल्दी सुधारे के काम करित बानी।`;
    return `Aapki complaint ${complaintId} ka status hai: ${status}. Hum ispar kaam kar rahe hain.`; // Hinglish
  }
}
