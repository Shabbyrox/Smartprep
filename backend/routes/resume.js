import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdf from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const UPLOAD_DIR = 'upload';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ dest: UPLOAD_DIR });

// ---------------- Helper Functions ----------------

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

    if (originalname.toLowerCase().endsWith('.pdf')) {
      const tempCleaned = await cleanPDF(filePath);
      buf = fs.readFileSync(tempCleaned);
      const data = await pdf(buf);
      if (fs.existsSync(tempCleaned)) fs.unlinkSync(tempCleaned);
      return data.text || '';
    }

    return buf.toString('utf8');
  } catch (err) {
    console.error(`⚠️ extractTextFromFile error: ${err.message}`);
    return '';
  }
}

// ---------------- Gemini Setup ----------------

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('❌ GEMINI_API_KEY missing in .env');

const genAI = new GoogleGenerativeAI(apiKey);

// ---------------- Gemini Calls ----------------

async function callGeminiInterview(resumeText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are an interviewer. Given the applicant resume below, generate:
1) 10 interview questions focused on the applicant's skills and experience, including projects and technologies.
2) Include a short intent tag (behavioral, technical, design) and difficulty (easy/medium/hard).

Resume:
${resumeText}

Return as JSON array: [{ "q": "...", "intent": "...", "difficulty": "..." }, ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const maybeJson = JSON.parse(text);
    if (Array.isArray(maybeJson)) return maybeJson;
  } catch {
    const jsonMatch = text.match(/\[.*?\]/s);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch {}
    }
  }

  return [{ q: text.substring(0, 1000), intent: 'unknown', difficulty: 'medium' }];
}

async function callGeminiSummaryAndReview(resumeText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are an AI resume reviewer. Review the resume below and always return a JSON object with:
{
  "summary": "...polished professional summary...",
  "strengths": ["3 key strengths"],
  "areas_of_improvement": ["3 areas to improve"],
  "feedback": ["3 actionable feedback points"]
}

Even if the resume is missing information, provide suggestions or "N/A" instead of leaving arrays empty.

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);

  let output = {
    summary: '',
    strengths: [],
    areas_of_improvement: [],
    feedback: []
  };

  try {
    const text = result.response.text();
    output = JSON.parse(text);

    output.strengths = output.strengths?.length ? output.strengths : ["No clear strengths identified"];
    output.areas_of_improvement = output.areas_of_improvement?.length ? output.areas_of_improvement : ["No immediate areas for improvement"];
    output.feedback = output.feedback?.length ? output.feedback : ["No actionable feedback provided"];
    output.summary = output.summary?.trim() ? output.summary : "Professional summary could not be extracted; consider adding one.";
  } catch (err) {
    console.warn('GPT did not return valid JSON, using fallback.');
    const text = result.response.text();
    output.summary = text.substring(0, 2000);
    output.strengths = ["No clear strengths identified"];
    output.areas_of_improvement = ["No immediate areas for improvement"];
    output.feedback = ["No actionable feedback provided"];
  }

  return output;
}

// ---------------- Routes ----------------

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const questions = await callGeminiInterview(text);
    res.json({ ok: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/upload-resume-summary', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const summaryFeedback = await callGeminiSummaryAndReview(text);
    res.json({ ok: true, ...summaryFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Optional review endpoint (structured JSON)
router.post('/upload-resume-review', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const review = await callGeminiSummaryAndReview(text);
    res.json({ ok: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Send to Python microservice
router.post('/send-to-python', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    const form = new FormData();
    form.append('resume', fs.createReadStream(filePath), originalname);

    const pythonURL = 'http://localhost:5001/check-resume-summary';
    const pythonResp = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      maxBodyLength: Infinity,
      timeout: 30000,
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true, pythonData: pythonResp.data });
  } catch (err) {
    console.error('Python microservice error:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;


import express from 'express';
import multer from 'multer';
import fs from 'fs';
import pdf from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const UPLOAD_DIR = 'upload';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ dest: UPLOAD_DIR });

// ---------------- Helper Functions ----------------

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

    if (originalname.toLowerCase().endsWith('.pdf')) {
      const tempCleaned = await cleanPDF(filePath);
      buf = fs.readFileSync(tempCleaned);
      const data = await pdf(buf);
      if (fs.existsSync(tempCleaned)) fs.unlinkSync(tempCleaned);
      return data.text || '';
    }

    return buf.toString('utf8');
  } catch (err) {
    console.error(`⚠️ extractTextFromFile error: ${err.message}`);
    return '';
  }
}

// ---------------- Gemini Setup ----------------

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('❌ GEMINI_API_KEY missing in .env');

const genAI = new GoogleGenerativeAI(apiKey);

// ---------------- Gemini Calls ----------------

async function callGeminiInterview(resumeText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are an interviewer. Given the applicant resume below, generate:
1) 10 interview questions focused on the applicant's skills and experience, including projects and technologies.
2) Include a short intent tag (behavioral, technical, design) and difficulty (easy/medium/hard).

Resume:
${resumeText}

Return as JSON array: [{ "q": "...", "intent": "...", "difficulty": "..." }, ...]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const maybeJson = JSON.parse(text);
    if (Array.isArray(maybeJson)) return maybeJson;
  } catch {
    const jsonMatch = text.match(/\[.*?\]/s);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch {}
    }
  }

  return [{ q: text.substring(0, 1000), intent: 'unknown', difficulty: 'medium' }];
}

async function callGeminiSummaryAndReview(resumeText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const prompt = `You are an AI resume reviewer. Review the resume below and always return a JSON object with:
{
  "summary": "...polished professional summary...",
  "strengths": ["3 key strengths"],
  "areas_of_improvement": ["3 areas to improve"],
  "feedback": ["3 actionable feedback points"]
}

Even if the resume is missing information, provide suggestions or "N/A" instead of leaving arrays empty.

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);

  let output = {
    summary: '',
    strengths: [],
    areas_of_improvement: [],
    feedback: []
  };

  try {
    const text = result.response.text();
    output = JSON.parse(text);

    output.strengths = output.strengths?.length ? output.strengths : ["No clear strengths identified"];
    output.areas_of_improvement = output.areas_of_improvement?.length ? output.areas_of_improvement : ["No immediate areas for improvement"];
    output.feedback = output.feedback?.length ? output.feedback : ["No actionable feedback provided"];
    output.summary = output.summary?.trim() ? output.summary : "Professional summary could not be extracted; consider adding one.";
  } catch (err) {
    console.warn('GPT did not return valid JSON, using fallback.');
    const text = result.response.text();
    output.summary = text.substring(0, 2000);
    output.strengths = ["No clear strengths identified"];
    output.areas_of_improvement = ["No immediate areas for improvement"];
    output.feedback = ["No actionable feedback provided"];
  }

  return output;
}

// ---------------- Routes ----------------

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const questions = await callGeminiInterview(text);
    res.json({ ok: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

router.post('/upload-resume-summary', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const summaryFeedback = await callGeminiSummaryAndReview(text);
    res.json({ ok: true, ...summaryFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Optional review endpoint (structured JSON)
router.post('/upload-resume-review', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (!text) return res.status(400).json({ error: 'Could not extract text from file' });

    const review = await callGeminiSummaryAndReview(text);
    res.json({ ok: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Send to Python microservice
router.post('/send-to-python', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { path: filePath, originalname } = req.file;
    const form = new FormData();
    form.append('resume', fs.createReadStream(filePath), originalname);

    const pythonURL = 'http://localhost:5001/check-resume-summary';
    const pythonResp = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      maxBodyLength: Infinity,
      timeout: 30000,
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true, pythonData: pythonResp.data });
  } catch (err) {
    console.error('Python microservice error:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;

