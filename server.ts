import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const portFromArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
const PORT = Number(process.env.PORT) || portFromArg || 3000;

const hostArgIndex = process.argv.indexOf('--host');
const hostFromArg = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : undefined;
const HOST = process.env.HOST || hostFromArg || '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Shopping Assistant & Wardrobe Stylist Endpoint
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, history = [], currentLanguage = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are "Zoya", GA Cloth's premier fashion stylist and shopping consultant.
GA Cloth is a luxury Pakistani apparel and couture fashion brand based in Lahore/Karachi.
Store Details:
- Physical Products: Unstitched 3-Piece & 2-Piece Suits, Ready-to-Wear (Pret), Festive & Luxury Chiffon/Velvet, Mens Kurta Pajama & Waistcoats, Shawls, Pashminas.
- Payment Methods: Cash on Delivery (COD) across Pakistan, Bank Transfer (Meezan, HBL), JazzCash, Easypaisa with manual receipt verification, and Debit/Credit Card.
- Shipping: Nationwide TCS Courier. Flat rate PKR 250, FREE shipping on orders above PKR 3,500. Delivery in 2-4 working days (Karachi, Lahore, Islamabad next-day or 2-day).
- Return Policy: 7 days easy return/exchange in original unstitched/unworn condition with tags.
- Response Language: If the user writes in Urdu or roman Urdu, respond in graceful, polite Urdu (or roman Urdu if they typed in roman). If English, respond in elegant English.
- Tone: Warm, respectful, knowledgeable about Pakistani festive fashion (Mehndi, Barat, Walima, Eid, lawn season, winter khaddar/velvet), yardage requirements (e.g. 3m shirt for kaliyan/flair, 2.5m trouser, 2.5m dupatta).
Give concise, helpful, and fashionable advice with recommendations.`;

    let replyText = '';
    let usedModel = 'gemini-4-argon';

    try {
      // First attempt with gemini-4-argon with HIGH thinking level
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      replyText = response.text || 'Shukriya for reaching out to GA Cloth. How else may I assist your style journey today?';
    } catch (primaryError: any) {
      console.warn('gemini-4-argon attempt failed, falling back to gemini-3.8-flash:', primaryError?.message);
      usedModel = 'gemini-3.8-flash';
      // Graceful fallback to gemini-3.8-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
        },
      });
      replyText = fallbackResponse.text || 'Welcome to GA Cloth! How may I assist your wardrobe selection today?';
    }

    return res.json({
      reply: replyText,
      modelUsed: usedModel,
      thinking: true,
    });
  } catch (error: any) {
    console.error('Error in assistant API:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate styling advice',
      fallback: 'Hamari customer support team hamesha aapki madad ke liye tayyar hai. Please feel free to browse our collection or ask about sizes, fabrics, and TCS delivery.',
    });
  }
});

// Admin AI Product Description & SEO Generator
app.post('/api/gemini/generate-description', async (req, res) => {
  try {
    const {
      title,
      category,
      fabric,
      pieces,
      embroidery,
      season,
      color,
    } = req.body;

    const prompt = `Generate a comprehensive luxury Pakistani e-commerce product description for:
Product Title: ${title || 'Luxury Embroidered Suit'}
Category: ${category || 'Unstitched Festive'}
Fabric: ${fabric || 'Pure Chiffon / Premium Lawn'}
Pieces/Type: ${pieces || '3 Piece Suit'}
Details/Embroidery: ${embroidery || 'Zari, sequins and resham threadwork'}
Season: ${season || 'Festive / Summer'}
Color: ${color || 'Royal Indigo & Sand Gold'}

Return a valid JSON object matching this structure:
{
  "titleEn": "Refined English Title",
  "titleUr": "Urdu Title in Arabic/Urdu script (e.g. لگژری کڑھائی والا ۳ پیس سوٹ)",
  "descriptionEn": "Rich 2-3 paragraph English luxury fashion description highlighting fabric drape, craftsmanship, and occasion styling.",
  "descriptionUr": "Authentic Urdu description in Urdu script describing the delicacy of the kapra, design, and styling.",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "washCareEn": "Dry clean recommended or gentle hand wash instructions.",
  "washCareUr": "دھلائی کی ہدایات",
  "seoMetaTitle": "SEO title under 60 chars",
  "seoMetaDescription": "High CTR SEO meta description under 155 chars",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`;

    let jsonStr = '';
    let usedModel = 'gemini-4-argon';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite copywriter for luxury Pakistani fashion brands like Sana Safinaz, Maria.B, and Khaadi. Always return strictly valid JSON with no markdown wrapping.',
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      jsonStr = response.text || '{}';
    } catch (err: any) {
      console.warn('Argon failed in description gen, trying gemini-3.8-flash:', err?.message);
      usedModel = 'gemini-3.8-flash';
      const fallback = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite copywriter for luxury Pakistani fashion brands. Always return strictly valid JSON.',
          responseMimeType: 'application/json',
        },
      });
      jsonStr = fallback.text || '{}';
    }

    try {
      // Clean possible markdown code fences if any
      const cleaned = jsonStr.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      return res.json({ success: true, data: parsed, modelUsed: usedModel });
    } catch (parseError) {
      return res.json({
        success: true,
        data: {
          titleEn: title,
          titleUr: title,
          descriptionEn: jsonStr,
          descriptionUr: 'اعلیٰ معیار کا شاہکار سوٹ',
          features: ['پریمیم فیبرک', 'نفیس کڑھائی', 'آرام دہ فٹنگ'],
          washCareEn: 'Dry clean recommended for best results.',
          washCareUr: 'ڈرائی کلین کی سفارش کی جاتی ہے۔',
          seoMetaTitle: `${title} | GA Cloth Pakistan`,
          seoMetaDescription: `Buy ${title} online at GA Cloth with cash on delivery and fast TCS shipping across Pakistan.`,
          seoKeywords: ['Pakistani suit', 'lawn', 'pret', 'GA Cloth'],
        },
        modelUsed: usedModel,
      });
    }
  } catch (error: any) {
    console.error('Error generating description:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate product description' });
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`GA Cloth Server is running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting process...`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });

  const shutdown = () => {
    console.log('Closing HTTP server gracefully...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
