
import { GoogleGenAI, Type } from "@google/genai";
import { Staff, Client, Shift } from '../types';

interface GeneratedShiftSimple {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  reasoning: string;
}

export const generateSmartSchedule = async (
  startDate: string,
  endDate: string,
  location: Client,
  availableStaff: Staff[]
): Promise<Shift[]> => {
  
  // Safe check for process.env to prevent crashes in browsers if polyfill is missing
  const apiKey = typeof process !== "undefined" && process.env ? process.env.API_KEY : undefined;

  if (!apiKey) {
    console.warn("API Key missing for Gemini. Please set REACT_APP_API_KEY or VITE_API_KEY depending on your build system, or ensure process.env.API_KEY is available.");
    // In a real Vercel/Vite environment, you often need 'import.meta.env.VITE_API_KEY'
    // But adhering to strict prompt rules:
    alert("API Key configuration missing. Check console.");
    return [];
  }

  // Initialize the client strictly according to the guidelines, but inside the function scope
  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    You are an expert security schedule manager.
    Create a schedule for the location "${location.name}" from ${startDate} to ${endDate}.
    
    Constraints:
    1. Ensure 24h coverage if possible based on staff roles.
    2. Respect staff preferred shifts logic (Day/Night) loosely.
    3. Standard shifts are usually 12h (06:00-18:00 or 18:00-06:00) or 8h (08:00-16:00, 16:00-00:00, 00:00-08:00).
    4. Do not double book the same person on the same day.
    5. Return a JSON array.

    Available Staff:
    ${JSON.stringify(availableStaff.map(s => ({ id: s.id, name: s.name, role: s.role, pref: s.preferredShifts })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              staffId: { type: Type.STRING },
              date: { type: Type.STRING, description: "Format YYYY-MM-DD" },
              startTime: { type: Type.STRING, description: "Format HH:mm" },
              endTime: { type: Type.STRING, description: "Format HH:mm" },
              type: { type: Type.STRING, description: "Day or Night" },
              reasoning: { type: Type.STRING }
            },
            required: ["staffId", "date", "startTime", "endTime", "type"]
          }
        }
      }
    });

    const generatedData = JSON.parse(response.text || '[]') as GeneratedShiftSimple[];

    // Map back to our internal Shift structure
    return generatedData.map((item, index) => ({
      id: `gen-${Date.now()}-${index}`,
      staffId: item.staffId,
      locationId: location.id,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      type: (item.type === 'Day' || item.type === 'Night') ? item.type : 'Custom',
      notes: item.reasoning
    }));

  } catch (error) {
    console.error("Failed to generate schedule with Gemini:", error);
    throw error;
  }
};
