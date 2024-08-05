// index.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/ask', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).send('API key is missing');
    }

    const question = req.body.question;
    if (!question) {
        return res.status(400).send('Question is required');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: question,
                max_tokens: 100
            })
        });
        const data = await response.json();
        res.json({ answer: data.choices[0].text.trim() });
    } catch (error) {
        res.status(500).send('Error querying OpenAI API: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
