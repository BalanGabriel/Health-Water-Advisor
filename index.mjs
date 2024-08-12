import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Definirea __dirname pentru ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Utilizează CORS și permite toate originile
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Endpoint pentru verificare
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Configurare pentru încărcarea fișierelor
const upload = multer({ dest: 'uploads/' });

// Citește fișierul Excel 'Database.xlsx'
const workbook = xlsx.readFile(path.join(__dirname, 'Database.xlsx'));

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: req.body.message }],
    });
    res.json(chatCompletion);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
