import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resume.js';
import mcq from './routes/mcq.js'
import userinfoRoutes from "./routes/userinfo.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Use the resume routes
app.use('/', resumeRoutes);
app.use(mcq);
app.use("/api", userinfoRoutes);

const PORT = process.env.PORT || 4000;
// Note: It says "Groq Key" but checks for "GEMINI_API_KEY". 
// Ensure the environment variable name matches the key you want to use.
console.log("🔑 Loaded Groq Key:", process.env.GEMINI_API_KEY ? "YES" : "NO"); 
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));