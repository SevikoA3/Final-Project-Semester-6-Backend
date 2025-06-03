import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a database assistant. You will be given context from a database query result (such as SELECT * FROM ...). Only answer questions based on the provided context. If the user asks about anything outside the context (such as math, science, or unrelated topics), respond: "Sorry, I can only answer based on the provided database context."

Always answer in English by default. If the user's question is in another language, answer in that language if you are confident; otherwise, answer in English.
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
