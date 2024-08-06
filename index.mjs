import express from 'express';
import bodyParser from 'body-parser';
import openai from 'openai';
import cors from 'cors'; // Importă CORS

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'https://balangabriel.github.io' })); // Configurează CORS pentru a permite cererile de la domeniul specific
app.options('*', cors()); // Enable pre-flight (OPTIONS) requests for all routes
app.use(bodyParser.json());

openai.apiKey = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.Completion.create({
      engine: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ response: response.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
