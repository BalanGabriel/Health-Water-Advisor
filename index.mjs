import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurează CORS pentru a permite cereri din domeniul specific
app.use(cors({
  origin: 'https://balangabriel.github.io'
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const workbook = xlsx.readFile(path.join(__dirname, 'Database.xlsx'));
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(worksheet);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (userMessage.toLowerCase().includes('lista') && userMessage.toLowerCase().includes('sticle de apa')) {
      const waterBottles = data.map(row => row['Nume'] || 'Nume necunoscut');
      const responseText = `Iată o listă cu sticlele de apă disponibile:\n- ${waterBottles.join('\n- ')}`;
      res.json({ answer: responseText });
    } else {
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
