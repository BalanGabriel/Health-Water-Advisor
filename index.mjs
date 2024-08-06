import express from 'express';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Configurează CORS pentru a permite cererile de la domeniul specific
app.use(cors({ origin: 'https://balangabriel.github.io' }));
app.options('*', cors()); // Enable pre-flight (OPTIONS) requests for all routes

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
