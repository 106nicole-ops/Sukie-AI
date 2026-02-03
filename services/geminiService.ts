import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../data";

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (ai) return ai;
  
  // In a real app, this should be a proper environment variable check.
  // For this generated code to be functional if the user adds the key, we check process.env.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work until provided.");
    return null;
  }
  
  ai = new GoogleGenAI({ apiKey });
  return ai;
};

export const generateSukieResponse = async (
  userInput: string, 
  context: string = ""
): Promise<string> => {
  const client = getAIClient();
  if (!client) {
    return "⚠️ 请配置 API Key 以启用 Sukie AI 战神模式。";
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview', // Updated to valid model
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Context: ${context}` },
            { text: `User Objection/Scenario: ${userInput}` }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly creative for metaphors
      }
    });

    return response.text || "Sukie 正在思考...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = (error as any).message || 'Unknown error';
    if (errorMessage.includes('404')) {
        return "❌ 无法连接 AI (404)。请检查模型名称是否有效。";
    }
    return `❌ Sukie 暂时不在线: ${errorMessage}`;
  }
};

export const getTacticalHint = async (scenarioTitle: string, logic: string): Promise<string> => {
   const client = getAIClient();
   if (!client) return "请配置 API Key";

   try {
     const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview', // Updated to valid model
        contents: [
            { text: `Current Scenario: ${scenarioTitle}. Logic: ${logic}. Give me a short, cryptic, Socrates-style hint (max 50 chars) to guide the user to the answer without giving it away.`}
        ]
     });
     return response.text || "思考本质...";
   } catch (e) {
       console.error("Hint API Error:", e);
       return "提示服务暂不可用";
   }
}
