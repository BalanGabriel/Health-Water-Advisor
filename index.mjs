import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import XLSX from 'xlsx';
import path from 'path';

const app = express(); // Asigură-te că variabila app este definită aici
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
const filePath = path.resolve('Database.xlsx');
let excelData = [];

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Folosește primul sheet
  const sheet = workbook.Sheets[sheetName];
  excelData = XLSX.utils.sheet_to_json(sheet); // Convertim foaia Excel într-un array de obiecte JSON
  console.log('Excel data loaded:', excelData);
} catch (error) {
  console.error('Error reading Excel file:', error.message);
}

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // Parcurge toate rândurile din Excel și caută orice informație care ar putea fi relevantă pentru mesajul utilizatorului
    const matchingData = excelData.filter(row => {
      return Object.values(row).some(value => 
        value && value.toString().toLowerCase().includes(userMessage)
      );
    });

    if (matchingData.length > 0) {
      const detailedList = matchingData.map(row => {
        return Object.entries(row).map(([key, value]) => `${key}: ${value || 'N/A'}`).join('\n');
      }).join('\n\n');

      res.json({ answer: `Iată informațiile relevante din baza de date:\n${detailedList}` });
      return;
    }

    // Dacă nu se găsesc date relevante în Excel, se trece la generarea unui răspuns cu OpenAI
    const systemMessage = {
      role: "system",
      content: `
        You are Health & Water Advisor. Welcome! I can help you choose the best water to drink based on your health needs, with a focus on Romanian water brands. Just tell me your condition, and I'll provide recommendations and detailed information.
      `
    };

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
