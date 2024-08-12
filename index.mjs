import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurare pentru a folosi __dirname cu module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurare CORS pentru a permite accesul doar de la adresa specifică
app.use(cors({
  origin: 'https://balangabriel.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Inițializarea clientului OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Încărcarea fișierului Excel
const workbook = xlsx.readFile(path.join(__dirname, 'Database.xlsx'));
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(worksheet);

// Endpoint pentru verificare
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Verifică dacă întrebarea utilizatorului este legată de fișierul Excel
    if (userMessage.toLowerCase().includes('lista') && userMessage.toLowerCase().includes('sticle de apa')) {
      const waterBottles = data.map(row => row['Nume'] || 'Nume necunoscut'); // presupunând că există o coloană "Nume" în Excel
      const responseText = `Iată o listă cu sticlele de apă disponibile:\n- ${waterBottles.join('\n- ')}`;
      res.json({ answer: responseText });
    } else {
      // Folosește OpenAI pentru alte întrebări
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userMessage }],
      });
      res.json(chatCompletion.choices[0].message);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
