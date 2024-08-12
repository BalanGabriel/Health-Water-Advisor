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

// Citește fișierul Excel la pornirea serverului
const filePath = path.resolve('Database.xlsx'); // Modifică calea dacă este necesar
let excelData = [];

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Folosește primul sheet
  const sheet = workbook.Sheets[sheetName];
  excelData = XLSX.utils.sheet_to_json(sheet);
  console.log('Excel data loaded:', excelData);
} catch (error) {
  console.error('Error reading Excel file:', error.message);
}

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // Verifică dacă mesajul cere date specifice din Excel
    if (userMessage.includes('aqua carpatica')) {
      const aquaCarpaticaData = excelData.find(row => row.Brand.toLowerCase() === 'aqua carpatica');
      if (aquaCarpaticaData) {
        res.json({ answer: `Datele pentru Aqua Carpatica:\n${JSON.stringify(aquaCarpaticaData, null, 2)}` });
        return;
      }
    }

    // Mesajul de tip "system" pentru a seta instrucțiunile personalizate
    const systemMessage = {
      role: "system",
      content: `
        You are Health & Water Advisor. Welcome! I can help you choose the best water to drink based on your health needs, with a focus on Romanian water brands. Just tell me your condition, and I'll provide recommendations and detailed information.

        Examples of requests:
        - "I have hypertension. What water do you recommend?"
        - "What is the best water for athletes?"
        - "Can I drink this water if I have kidney issues?"
        - "I want to know more about the water brand X."
      `
    };

    // Folosește modelul 'gpt-4o-mini'
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: req.body.message }],
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

