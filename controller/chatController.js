import { chatWithGemini } from "../util/gemini.js";

export async function chatController(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }
    const aiResponse = await chatWithGemini({ messages });
    res.json({ response: aiResponse });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
