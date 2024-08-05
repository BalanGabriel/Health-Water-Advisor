import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    const question = req.body.question;
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        method: 'post',
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
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
