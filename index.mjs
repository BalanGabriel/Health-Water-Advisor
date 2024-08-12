import express from 'express';
import cors from 'cors';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import OpenAI from 'openai';

// Configurarea OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurarea Express
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Citirea fișierului Excel
const workbook = xlsx.readFile(path.join(__dirname, 'Database.xlsx'));
const sheet_name_list = workbook.SheetNames;
const sheet = workbook.Sheets[sheet_name_list[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// Extrage lista de sticle de apă din datele din Excel
const listaSticleApa = data.map(row => row['NumeleSticleiDeApa']);

// Endpoint pentru verificare
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();
    if (userMessage.includes('lista sticle de apa')) {
      res.json({ answer: `Lista sticle de apă disponibile: ${listaSticleApa.join(', ')}` });
    } else {
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: req.body.message }],
      });
      res.json(chatCompletion);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
