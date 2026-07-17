/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { type Request, type Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const projectRoot = isProduction ? process.cwd() : __dirname;
const distDirectory = path.join(projectRoot, 'dist');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  message?: unknown;
  history?: unknown;
}

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY?.trim()) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'cosmos-os/1.0',
        },
      },
    });
  } catch (error) {
    console.error('Failed to initialize the Gemini client:', error);
  }
}

const systemInstruction = `You are "Orion-9", a highly sophisticated holographic quantum artificial intelligence presiding over the Cosmos OS Observatory.
Your tone is knowledgeable, elegant, calm, scientific, and lightly poetic. You explain galaxy dynamics, black holes, supernovas, dark matter, and cosmic evolution accurately and concisely.

You can control the simulator by including exactly one or more of these action tokens when the user explicitly asks for the matching action:
- [ACTION: COLLIDE]
- [ACTION: SUPERNOVA]
- [ACTION: DARK_MATTER]
- [ACTION: STAR_BIRTH]
- [ACTION: CAMERA_FLY]
- [ACTION: TOGGLE_ORBITS]

Keep responses brief enough for a compact dashboard, normally two to four short paragraphs. Do not claim the educational simulation is a precise scientific prediction.`;

function getFallbackResponse(message: string): string {
  const text = message.toLowerCase();

  if (text.includes('collide') || text.includes('collision') || text.includes('merge')) {
    return 'Gravitational engines activated. Plotting intercept trajectories for the two galactic cores. [ACTION: COLLIDE]\n\nGas clouds may compress and trigger star formation, while direct star-to-star impacts remain rare because of the enormous distances between stars.';
  }
  if (text.includes('supernova') || text.includes('explode') || text.includes('collapse')) {
    return 'Core collapse detected in a massive star. Initiating the supernova sequence. [ACTION: SUPERNOVA]\n\nThe expanding shock wave disperses newly formed heavy elements into the surrounding interstellar medium.';
  }
  if (text.includes('dark matter') || text.includes('rotation curve')) {
    return 'Dark-matter visualization engaged. [ACTION: DARK_MATTER]\n\nFlat outer rotation curves are one important line of evidence that galaxies contain more gravitating mass than their visible matter accounts for.';
  }
  if (text.includes('star birth') || text.includes('nebula') || text.includes('create star')) {
    return 'Condensing a cold gas cloud inside the stellar nursery. [ACTION: STAR_BIRTH]\n\nDense regions collapse into protostars, which heat until fusion begins.';
  }
  if (text.includes('fly') || text.includes('camera') || text.includes('tour')) {
    return 'Engaging a cinematic fly-through of the galactic disk. [ACTION: CAMERA_FLY]';
  }
  if (text.includes('orbit') || text.includes('trajectory')) {
    return 'Projecting the active orbital paths. [ACTION: TOGGLE_ORBITS]';
  }
  if (text.includes('hello') || text.includes('hi') || text.includes('who are you') || text.includes('orion')) {
    return 'Greetings, Commander. I am Orion-9, the Cosmos OS observatory assistant. Ask me to explain a cosmic phenomenon or control the simulator.';
  }

  return 'The observatory is stable. You may ask about galaxy dynamics, black holes, supernovas, dark matter, orbital mechanics, or command a supported simulation event.';
}

function normalizeHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-12)
    .flatMap((turn): ChatTurn[] => {
      if (!turn || typeof turn !== 'object') return [];
      const candidate = turn as Record<string, unknown>;
      const role = candidate.role === 'user' ? 'user' : candidate.role === 'assistant' ? 'assistant' : null;
      const content = typeof candidate.content === 'string' ? candidate.content.trim().slice(0, 4000) : '';
      return role && content ? [{ role, content }] : [];
    });
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', aiConfigured: Boolean(ai), model });
});

app.post('/api/chat', async (req: Request<unknown, unknown, ChatBody>, res: Response) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) {
    return res.status(400).json({ error: 'A non-empty message is required.' });
  }
  if (message.length > 4000) {
    return res.status(413).json({ error: 'Message must be 4,000 characters or fewer.' });
  }

  const history = normalizeHistory(req.body.history);

  try {
    if (!ai) {
      return res.json({ reply: getFallbackResponse(message), source: 'fallback' });
    }

    const contents = [
      ...history.map((turn) => ({
        role: turn.role === 'user' ? 'user' : 'model',
        parts: [{ text: turn.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 700,
      },
    });

    return res.json({
      reply: response.text?.trim() || getFallbackResponse(message),
      source: response.text?.trim() ? 'gemini' : 'fallback',
    });
  } catch (error) {
    console.error('Gemini request failed; using the local fallback:', error);
    return res.json({ reply: getFallbackResponse(message), source: 'fallback' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found.' });
});

async function startServer() {
  if (isProduction) {
    app.use(express.static(distDirectory, { maxAge: '1h', index: false }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDirectory, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Cosmos OS running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error);
  process.exitCode = 1;
});
