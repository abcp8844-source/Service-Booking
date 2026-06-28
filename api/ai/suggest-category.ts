import { GoogleGenAI } from '@google/genai';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase کا کنکشن (اپنی JSON کی فائل کا پاتھ دیں)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { query, userLocation } = req.body;

  try {
    // 1. Firebase سے کیٹیگری کا ڈیٹا نکالیں
    const shopsRef = db.collection('shops');
    const snapshot = await shopsRef.where('category', '==', query.toLowerCase()).get();
    
    let shopsData = [];
    snapshot.forEach(doc => shopsData.push(doc.data()));

    // 2. Gemini کو ڈیٹا اور لوکیشن کے ساتھ بھیجیں
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: `
        You are the Booking Service Assistant.
        Available Shops for user: ${JSON.stringify(shopsData)}
        User Location: ${JSON.stringify(userLocation)}
        
        Rules:
        - Analyze shops based on distance. Suggest the nearest ones.
        - Provide Shop Name, Distance, and their Booking Link.
        - If shops are far, inform the user clearly.
        - If user asks for login/bugs, direct them to 'Contact Us' page.
        - Tone: Helpful, Urdu/Native language, Professional.
        - If query is unrelated, politely stay within the Booking Service scope.
      `,
      config: { responseMimeType: "application/json" }
    });

    res.status(200).json(JSON.parse(response.text));
  } catch (error) {
    res.status(500).json({ reply: "Our booking system is currently busy. For emergency support, please visit our 'Contact Us' page." });
  }
}
