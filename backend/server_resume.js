import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import pdf from 'pdf-parse';
import axios from 'axios';
import FormData from 'form-data';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

const app = express();
const UPLOAD_DIR = 'upload';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const upload = multer({ dest: UPLOAD_DIR });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


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
    if (!fs.existsSync(filePath)) throw new Error(`❌ File not found: ${filePath}`);
    let buf = fs.readFileSync(filePath);

    if (originalname.toLowerCase().endsWith('.pdf')) {
      const tempCleaned = await cleanPDF(filePath);
      buf = fs.readFileSync(tempCleaned);
      const data = await pdf(buf);
      fs.unlinkSync(tempCleaned);
      return data.text || '';
    }

    return buf.toString('utf8');
  } catch (err) {
    console.error(`⚠️ extractTextFromFile error: ${err.message}`);
    return '';
  }
}


async function callGroq(resumeText) {
  const apikey = process.env.GROQ_API_KEY;
  if (!apikey) throw new Error("GROQ_API_KEY missing in .env");

  const prompt = `You are an interviewer. Given the applicant resume below, generate:
1) 10 interview questions focused on the applicant's skills and experience and also ask questions related to projects and technologies used
2) For each question, include a short intent tag (e.g., "behavioral", "technical", "design") and a difficulty (easy/medium/hard).

Resume:
${resumeText}

Return as JSON array: [{ "q": "...", "intent": "...", "difficulty": "..." }, ...]`;

  try {
    const resp = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful AI interviewer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apikey}`
        },
        timeout: 20000
      }
    );

    const text = resp.data?.choices?.[0]?.message?.content || "";
    try {
      const maybeJson = JSON.parse(text);
      if (Array.isArray(maybeJson)) return maybeJson;
      if (maybeJson.questions) return maybeJson.questions;
    } catch {
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        try { return JSON.parse(jsonMatch[0]); } catch {}
      }
    }

    return [{ q: text.substring(0, 1000), intent: 'unknown', difficulty: 'medium' }];
  } catch (err) {
    console.error(`Groq API Error: ${err.response?.status} ${err.response?.statusText}`);
    console.error(err.response?.data || err.message);
    throw new Error(`Groq API request failed: ${err.message}`);
  }
}

app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const originalname = req.file.originalname || '';

    let text = await extractTextFromFile(filePath, originalname);
    text = text.replace(/\s+/g, ' ').trim().slice(0, 20000);
    fs.unlinkSync(filePath);

    if (!text) return res.status(400).json({ error: 'Could not extract text from the file' });

    const questions = await callGroq(text);
    res.json({ ok: true, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});


app.post('/send-to-python', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const originalname = req.file.originalname || '';

    const form = new FormData();
    form.append('resume', fs.createReadStream(filePath), originalname);

    const pythonURL = 'http://localhost:5000/check_resume';
    const pythonResp = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      maxBodyLength: Infinity,
      timeout: 30000
    });

    fs.unlinkSync(filePath);
    res.json({ ok: true, pythonData: pythonResp.data });
  } catch (err) {
    console.error('Python microservice error:', err.message);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});


const PORT = process.env.PORT || 4000;
console.log("🔑 Loaded Groq Key:", process.env.GROQ_API_KEY ? "YES" : "NO");
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
