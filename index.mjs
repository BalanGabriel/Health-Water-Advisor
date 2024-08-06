import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import bodyParser from 'body-parser';

// Configurare Express
const app = express();
const port = process.env.PORT || 3000;

// Configurare CORS și body-parser
app.use(cors());
app.use(bodyParser.json());

// Configurare OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint pentru proxy
app.post('/api/proxy', async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt || !model) {
      return res.status(400).json({ error: 'Prompt and model are required' });
    }

    const response = await openai.createCompletion({
      model: model,
      prompt: prompt,
      max_tokens: 100,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pornire server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

