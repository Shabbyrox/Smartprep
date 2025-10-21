import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";   // ✅ Added
dotenv.config();              // ✅ Load .env

const router = express.Router();
const UPLOAD_DIR = "upload";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ dest: UPLOAD_DIR });

// ------------------------- Helper Functions -------------------------

async function cleanPDF(inputPath) {
  const outputPath = `${inputPath}_${Date.now()}_cleaned.pdf`;
  try {
    const data = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(data, { ignoreEncryption: true });
    const bytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, bytes);
    return outputPath;
  } catch (err) {
    console.error(`⚠️ PDF cleaning failed: ${err.message}`);
    return inputPath;
  }
}

async function extractTextFromFile(filePath, originalname) {
  try {
    if (!fs.existsSync(filePath))
      throw new Error(`❌ File not found: ${filePath}`);
    let buf = fs.readFileSync(filePath);

    if (originalname.toLowerCase().endsWith(".pdf")) {
      const tempCleaned = await cleanPDF(filePath);
      buf = fs.readFileSync(tempCleaned);
      const data = await pdf(buf);
      fs.unlinkSync(tempCleaned);
      return data.text || "";
    }

    return buf.toString("utf8");
  } catch (err) {
    console.error(`⚠️ extractTextFromFile error: ${err.message}`);
    return "";
  }
}

// ------------------------- Gemini Setup -------------------------

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("❌ GEMINI_API_KEY missing in .env");

const genAI = new GoogleGenerativeAI(apiKey);

// ------------------------- Gemini API Calls -------------------------

async function callGemini(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are an interviewer. Given the applicant resume below, generate:
1) 10 interview questions focused on the applicant's skills and experience and also ask questions related to projects and technologies used
2) For each question, include a short intent tag (e.g., "behavioral", "technical", "design") and a difficulty (easy/medium/hard).

Resume:
${resumeText}

Return as JSON array: [{ "q": "...", "intent": "...", "difficulty": "..." }, ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const maybeJson = JSON.parse(text);
    if (Array.isArray(maybeJson)) return maybeJson;
    if (maybeJson.questions) return maybeJson.questions;
  } catch {
    const jsonMatch = text.match(/\[.*?\]/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {}
    }
  }

  return [{ q: text.substring(0, 1000), intent: "unknown", difficulty: "medium" }];
}

async function callGeminiSummary(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `Please review the professional summary in the resume below. 
If it is fine, return the same summary. If improvements are needed, provide a polished version.

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callGeminiReview(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `You are an AI resume reviewer. Analyze the following resume and provide structured feedback in this exact format:

Start with a heading: 'AI Feedback – Personalized suggestions to improve your resume.'

Give an Overall Score out of 100 (based on clarity, achievements, technical relevance, and ATS keyword optimization).

Provide exactly 3 feedback points using bullet style with emojis or symbols (✅, ⚠️, ❌). Keep them short and actionable.

If the resume has strengths, highlight them positively.

If something is missing (like quantified achievements or keywords), mark it with ❌.

Keep language simple and direct, not too long.

Now here is the resume:
${resumeText}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ------------------------- Routes -------------------------

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const originalname = req.file.originalname;

    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, " ").trim().slice(0, 20000);
    fs.unlinkSync(filePath);

    if (!text)
      return res.status(400).json({ error: "Could not extract text from the file" });

    const questions = await callGemini(text);
    res.json({ ok: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/upload-resume-summary", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const originalname = req.file.originalname;

    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, " ").trim().slice(0, 20000);
    fs.unlinkSync(filePath);

    if (!text)
      return res.status(400).json({ error: "Could not extract text from the file" });

    const summary = await callGeminiSummary(text);
    res.json({ ok: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});
router.post("/upload-resume-review", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const originalname = req.file.originalname;

    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, " ").trim().slice(0, 20000);
    fs.unlinkSync(filePath);

    if (!text)
      return res.status(400).json({ error: "Could not extract text from the file" });

    const summary = await callGeminiSummary(text);
    res.json({ ok: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.post("/send-to-python", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const originalname = req.file.originalname;

    const form = new FormData();
    form.append("resume", fs.createReadStream(filePath), originalname);

    const pythonURL = "http://localhost:5000/check-resume-summary";
    const pythonResp = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      maxBodyLength: Infinity,
      timeout: 30000,
    });

    fs.unlinkSync(filePath);
    res.json({ ok: true, pythonData: pythonResp.data });
  } catch (err) {
    console.error("Python microservice error:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
