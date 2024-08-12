import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configurare pentru a folosi __dirname cu module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Verifică dacă fișierul Database.xlsx există
console.log("Directory name:", __dirname);
console.log("Expected path to Database.xlsx:", path.join(__dirname, 'Database.xlsx'));

if (fs.existsSync(path.join(__dirname, 'Database.xlsx'))) {
    console.log("Database.xlsx was found in the application directory!");

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
} else {
    console.error("Database.xlsx is missing in the application directory!");

    // Endpoint pentru verificare
    app.get('/', (req, res) => {
        res.status(500).send('Database.xlsx is missing in the application directory!');
    });

    // Endpoint pentru chat
    app.post('/chat', async (req, res) => {
        res.status(500).send('Database.xlsx is missing in the application directory!');
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
