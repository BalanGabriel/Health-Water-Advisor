import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import XLSX from 'xlsx';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Configurare CORS
app.use(cors({
  origin: 'https://balangabriel.github.io',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Răspunde cererilor OPTIONS (preflight)
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Citește fișierul Excel
    const filePath = path.resolve('data', 'Database.xlsx'); // Modifică calea după cum este necesar
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Ia primul sheet
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Procesare date (exemplu)
    console.log(data);

    // Mesajul de tip "system" pentru a seta instrucțiunile personalizate
    const systemMessage = {
      role: "system",
      content: `
        You are Health & Water Advisor. Welcome! I can help you choose the best water to drink based on your health needs, with a focus on Romanian water brands. Just tell me your condition, and I'll provide recommendations and detailed information.
        // Restul mesajului...
      `
    };

    // Folosește modelul 'gpt-4o-mini'
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: userMessage }],
    });

    res.json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
