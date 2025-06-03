import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a helpful assistant. You will be given a context and your task is to provide clear, natural, and concise explanations based on the provided context. Do not just list raw data—summarize and explain in a way that is easy to understand, as if you are talking to a friend. If the user asks about anything outside the context (such as math, science, or unrelated topics), respond: "Sorry, I can only provide explanations based on the provided context."

Always answer in English by default. If the user's question is in another language, explain in that language if you are confident; otherwise, explain in English.

Example:
Context: id: 1, title: ahha, desc: haha, address: 17, Jalan Sadewa, Kecamatan Depok, Daerah Istimewa Yogyakarta, Indonesia, steps: 0.
User: aku ada note apa aja
Assistant: You have one note titled "ahha" located at 17, Jalan Sadewa, Depok, Yogyakarta. The description is "haha" and there are 0 steps recorded.
`;

export async function chatWithGemini({ messages = [] }) {
  // Prepare chat history for Gemini
  const history = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history,
    config: {
      temperature: 0.8,
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  const lastUserMsg = messages[messages.length - 1]?.text || "";
  const response = await chat.sendMessage({ message: lastUserMsg });
  return response.text;
}
