import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { generateAndSendApk } from './src/utils/apkGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const HSC_SYSTEM_INSTRUCTION = `তুমি হলে "HSC Study Buddy" — বাংলাদেশের HSC (Higher Secondary Certificate) শিক্ষার্থীদের জন্য ডেডিকেটেড এক্সপার্ট শিক্ষক ও স্টাডি মেন্টর।
তোমার বৈশিষ্ট্য ও দায়িত্ব:
১. NCTB পাঠ্যক্রমের বিজ্ঞান বিভাগের বিষয়সমূহ (পদার্থবিজ্ঞান ১ম ও ২য় পত্র, রসায়ন ১ম ও ২য় পত্র, উচ্চতর গণিত ১ম ও ২য় পত্র, জীববিজ্ঞান ১ম ও ২য় পত্র, তথ্য ও যোগাযোগ প্রযুক্তি (ICT), বাংলা ১ম ও ২য় পত্র, English 1st & 2nd Paper) খুব সহজ ও প্রাঞ্জল বাংলায় বুঝিয়ে বলা।
২. গাণিতিক ও বৈজ্ঞানিক সমস্যাগুলো ধাপে ধাপে (step-by-step) সমাধান করা। সরাসরি শুধু উত্তর না দিয়ে সূত্রের প্রয়োগ ও যুক্তি স্পষ্ট করা।
৩. গাণিতিক সমীকরণ ও সূত্রের সঠিক LaTeX ফরম্যাটিং:
   - সকল গাণিতিক সূত্র, সমীকরণ ও প্রতীকের জন্য স্ট্যান্ডার্ড LaTeX ব্যবহার করো।
   - ইনলাইন সূত্রের জন্য একক ডলার চিহ্ন ব্যবহার করো: যেমন $E = mc^2$, $\\frac{dy}{dx}$, $\\int x dx$, $\\vec{A} \\cdot \\vec{B} = AB \\cos \\theta$, $\\sqrt{P^2 + Q^2}$।
   - প্রধান বা বিস্তারিত সূত্রের জন্য ডাবল ডলার ($$ ... $$) ব্লকে লিখবে।
   - ভগ্নাংশের জন্য \\frac{l}{r}, লিমিটের জন্য \\lim_{x \\to 0}, ইন্টিগ্রালের জন্য \\int, সামেশনের জন্য \\sum ব্যবহার করো।
৪. প্রশ্নের ছবি আপলোড করা হলে ছবি থেকে প্রশ্নটি নির্ভুলভাবে পড়ে ধাপে ধাপে সমাধান দাও।
৫. ভাষা: মূলত প্রমিত বাংলা এবং প্রাসঙ্গিক ইংরেজি একাডেমিক পরিভাষা (যেমন: Newton's Law, Integration by parts, Organic Synthesis ইত্যাদি) ব্যবহার করো।
৬. শিক্ষার্থীদের সবসময় অনুপ্রাণিত রাখো এবং কার্যকর রিভিশন কৌশল ও পরীক্ষার টিপস দাও।`;

// API Routes
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'বার্তা বা ছবি প্রয়োজন' });
    }

    const contents: any[] = [];

    // Append prior history if provided
    for (const h of history) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }
    }

    // Build current turn parts
    const currentParts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      currentParts.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      });
    }

    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: HSC_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    } catch (firstErr: any) {
      console.warn('Gemini first attempt error, retrying once...', firstErr?.message);
      // Wait 1 second before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contents,
        config: {
          systemInstruction: HSC_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    }

    const reply = response?.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করো।';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.json({
      reply: 'ওয়ালাইকুম আসসালাম! মডেল সার্ভারে এই মুহূর্তে সাময়িক চাপ রয়েছে। অনুগ্রহ করে ৫-১০ সেকেন্ড পর আবার প্রশ্নটি সেন্ড করো। তোমার HSC প্রস্তুতির সাথে আমি আছি! 📚',
    });
  }
});

// AI Study Planner Route
app.post('/api/ai/plan', async (req, res) => {
  try {
    const { dailyHours, weakSubjects, examTarget, preferredTime } = req.body;

    const prompt = `একজন HSC শিক্ষার্থীর জন্য একটি সুনির্দিষ্ট সাপ্তাহিক পড়াশোনার পরিকল্পনা তৈরি করো।
তথ্য:
- দৈনিক পড়ার সময়: ${dailyHours || '6'} ঘণ্টা
- দুর্বল বা কঠিন বিষয়: ${weakSubjects || 'উচ্চতর গণিত, পদার্থবিজ্ঞান'}
- লক্ষ্য: ${examTarget || 'HSC 2026/2027'}
- সুবিধাজনক সময়: ${preferredTime || 'সকাল ও রাত'}

দয়া করে নিচের JSON ফরম্যাটে ৭ দিনের জন্য ৫-৭টি ব্যালেন্সড রুটিন স্লট দাও:
{
  "summary": "পরিকল্পনার সংক্ষিপ্ত সারসংক্ষেপ ও পরামর্শ",
  "slots": [
    {
      "day": "শনি",
      "time": "০৭:০০ AM - ০৮:৩০ AM",
      "subject": "পদার্থবিজ্ঞান ১ম পত্র",
      "activity": "অধ্যায় পড়া ও সূত্র মুখস্থ",
      "duration": 90
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'তুমি একজন অভিজ্ঞ HSC একাডেমিক কাউন্সেলর। ফলাফলটি শুধুমাত্র বৈধ JSON অবজেক্ট হিসেবে দাও। কোনো অতিরিক্ত ব্যাকটিক্স বা মার্কডাউন কোড ব্লক দিও না।',
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let planData;
    try {
      planData = JSON.parse(text);
    } catch {
      planData = { summary: text, slots: [] };
    }

    res.json(planData);
  } catch (error: any) {
    console.error('Study Plan Generation Error:', error);
    res.status(500).json({ error: 'পরিকল্পনা তৈরিতে সমস্যা হয়েছে।' });
  }
});

// Full APK Package Download Endpoint
app.get('/api/download/apk', async (_req, res) => {
  try {
    await generateAndSendApk(res, __dirname);
  } catch (err: any) {
    console.error('Failed to generate APK:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'APK ফাইল তৈরিতে সমস্যা হয়েছে।' });
    }
  }
});

// Vite Middleware for dev / static for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`HSC Tracker Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
