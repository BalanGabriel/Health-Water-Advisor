import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';  // Verifică documentația pentru versiunea instalată

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 100,
    });

    const answer = response.choices[0].text.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
