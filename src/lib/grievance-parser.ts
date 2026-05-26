import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

export interface GrievancePayload {
  category: string;
  urgency: "Low" | "Medium" | "High";
  location: string;
  wardZone: string;
  departmentId: string;
  title: string;
  summary: string;
}

export async function parseAndRouteGrievance(text: string): Promise<GrievancePayload> {
  const prompt = `
You are LNN-Nivaaran, an autonomous civic grievance parsing agent for Lucknow Nagar Nigam.
Analyze the following grievance text (which could be in Hindi, English, or Hinglish) and extract the required information.

Categories available to map to (choose the closest one):
- "Street Light"
- "Garbage / Sanitation"
- "Water Supply"
- "Road Damage"
- "Electricity"
- "Illegal Construction"
- "Encroachment"
- "Corruption"
- "Public Health"

Rules for Department Mapping based on Category:
- "Street Light" -> maps to "lmc"
- "Garbage / Sanitation" -> maps to "health-dept" (or "nagar-nigam", we will use "health-dept")
- "Water Supply" -> maps to "jal-nigam"
- "Road Damage" -> maps to "pwd"
- "Electricity" -> maps to "power-dept"
- Others map to their respective sensible departments.

Grievance Text: "${text}"

Respond ONLY with a valid JSON object matching this schema:
{
  "category": "One of the specific categories above",
  "urgency": "Low" | "Medium" | "High",
  "location": "extracted landmark/location",
  "wardZone": "extracted ward or zone if any, else 'Unknown'",
  "departmentId": "The department ID based on rules above",
  "title": "A short English title for the complaint (max 6 words)",
  "summary": "A concise English summary"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const output = response.text;
    if (!output) throw new Error("Empty response from Gemini");

    const payload = JSON.parse(output) as GrievancePayload;
    
    // Ensure strict department mappings based on requirements
    if (payload.category === "Street Light") payload.departmentId = "power-dept"; // Streetlights / Dark Spots -> Electrical Wing (power-dept)
    if (payload.category === "Garbage / Sanitation") payload.departmentId = "health-dept"; // Swachh Bharat Cell / Health Wing
    if (payload.category === "Water Supply") payload.departmentId = "jal-nigam";
    if (payload.category === "Road Damage") payload.departmentId = "pwd";

    return payload;

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    // Fallback if AI fails or no API key
    return {
      category: "Garbage / Sanitation",
      urgency: "Medium",
      location: "Unknown",
      wardZone: "Unknown",
      departmentId: "health-dept",
      title: "Unable to parse text",
      summary: "Fallback response due to API error",
    };
  }
}
