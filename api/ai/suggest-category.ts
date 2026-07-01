import { GoogleGenAI } from '@google/genai';
import { getFirestore } from 'firebase-admin/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { query } = req.body;

  try {
    const snapshot = await db.collection('shops').limit(10).get();
    let shopsData = snapshot.docs.map(doc => doc.data());

    const model = ai.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
      You are 'Zunex Booking Assistant'.
      Shop Data: ${JSON.stringify(shopsData)}
      User Query: "${query}"
      
      Instructions:
      - Be friendly, energetic, and conversational.
      - Use provided shop data for service suggestions.
      - If no exact match, suggest alternatives.
      - Use emojis! Be fun! 😊
      - Only suggest 'Contact Us' if the user reports a bug.
      - If greeting, ask: "What service can I help you book today?"
    `;

    const result = await model.generateContent(prompt);
    res.status(200).json({ reply: result.response.text() });

  } catch (error) {
    res.status(200).json({ reply: "I'm still here! Let's try again—what service do you need help with? 🛠️" });
  }
}
