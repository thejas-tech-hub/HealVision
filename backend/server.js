// backend/server.js

import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// === ENVIRONMENT SETUP ===
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("❌ Missing GOOGLE_API_KEY in .env file!");
  process.exit(1);
}

// ✅ Stable Gemini endpoint (latest confirmed)
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json({ limit: "10mb" }));
console.log("✅ CORS enabled for all origins");

// === MULTER CONFIG (for image uploads) ===
const upload = multer({ storage: multer.memoryStorage() });

// === ROUTES ===

// 🟢 Root route
app.get("/", (req, res) => {
  res.send("🌿 HealVision Backend is up and running!");
});


// 🧠 TEXT ANALYSIS (Structured JSON Output)
app.post("/api/analyze/text", async (req, res) => {
  const text = req.body.text || req.body.symptomsText || req.body.symptoms;
  if (!text) {
    return res.status(400).json({ error: "Missing text in request body" });
  }

  console.log("📩 Received /api/analyze/text request");

  try {
    const prompt = `
You are a medical AI assistant. Analyze the user's symptoms safely and provide a structured, non-diagnostic report.

Symptoms: ${text}

Respond ONLY in pure JSON format:
{
  "summary": "Short summary of user symptoms",
  "possibleCauses": ["Cause 1", "Cause 2"],
  "redFlags": ["Warning 1", "Warning 2"],
  "selfCareTips": ["Tip 1", "Tip 2"],
  "sources": ["Source URL 1", "Source URL 2"]
}
`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    reply = reply.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch {
      console.warn("⚠️ Could not parse Gemini JSON. Returning safe fallback.");
      parsed = {
        summary: reply || "No structured summary available.",
        possibleCauses: [],
        redFlags: [],
        selfCareTips: [],
        sources: [],
      };
    }

    res.json(parsed);
  } catch (error) {
    console.error("❌ Text Analysis Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal server error during text analysis",
    });
  }
});


// 🩻 IMAGE ANALYSIS (Real Gemini Multimodal)
app.post("/api/analyze/image", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No image uploaded" });

  console.log(`📩 Received /api/analyze/image request for ${file.originalname}`);

  try {
    const base64Image = file.buffer.toString("base64");

    const prompt = `
You are a medical AI assistant. Analyze the uploaded X-ray or image safely.
Provide a structured, non-diagnostic medical insight.

Respond strictly in JSON format:
{
  "summary": "Short summary of findings",
  "possibleCauses": ["Cause 1", "Cause 2"],
  "redFlags": ["Warning 1", "Warning 2"],
  "selfCareTips": ["Tip 1", "Tip 2"],
  "sources": ["Source URL 1", "Source URL 2"]
}
`;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: file.mimetype,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    let reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    reply = reply.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch {
      console.warn("⚠️ Image AI returned unstructured data. Using fallback.");
      parsed = {
        summary: reply || `AI response unclear for ${file.originalname}`,
        possibleCauses: [],
        redFlags: [],
        selfCareTips: ["Consult a doctor if symptoms persist.", "Maintain hydration."],
        sources: ["https://www.mayoclinic.org", "https://www.who.int"],
      };
    }

    console.log("✅ Gemini image analysis complete.");
    res.json(parsed);
  } catch (error) {
    console.error("❌ Image Analysis Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal server error during image analysis",
    });
  }
});


// 💬 AI DOCTOR CHAT
app.post("/api/chat", async (req, res) => {
  const { messages, mindCare, targetLanguage } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid chat messages array" });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || "Hello";
  console.log("💬 Chat input:", lastUserMessage);

  try {
    const context = mindCare
      ? "You are a calm, empathetic mental health assistant. Offer comforting, motivational responses."
      : "You are a helpful AI health assistant. Respond clearly, respectfully, and avoid giving diagnoses.";

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${context}\n\nUser message: ${lastUserMessage}\nRespond in ${targetLanguage}.`,
            },
          ],
        },
      ],
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help. Please share more details.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Chat API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal server error during chat",
    });
  }
});


// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 HealVision backend running on http://localhost:${PORT}`);
});
