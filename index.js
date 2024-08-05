const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Ask OpenAI GPT</h1>
    <form method="post" action="/ask">
      <label for="question">Enter your question: </label>
      <input type="text" id="question" name="question" required>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.status(400).send('Question is required');
  }

  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: question,
        max_tokens: 100
      })
    });

    const data = await response.json();
    res.send(`<h1>Response</h1><p>${data.choices[0].text}</p><a href="/">Ask another question</a>`);
  } catch (error) {
    console.error('Error fetching from OpenAI API:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
