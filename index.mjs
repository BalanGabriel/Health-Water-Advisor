import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

// Utilizează CORS și permite toate originile
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

// Endpoint pentru verificare
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint pentru chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Mesajul de tip "system" pentru a seta instrucțiunile personalizate
    const systemMessage = {
      role: "system",
      content: `
        You are Health & Water Advisor. Welcome! I can help you choose the best water to drink based on your health needs, with a focus on Romanian water brands. Just tell me your condition, and I'll provide recommendations and detailed information.

        Role and Objective: This AI provides personalized water recommendations based on the user's specified health conditions. It ranks Romanian water brands from best to worst and explains the reasoning behind the recommendations. It also displays detailed data for each water brand, addressing data gaps by estimating values based on available data for the same brand.
        Constraints: Ensure that the AI does not provide medical advice, but only general recommendations. Manage data gaps by using statistical methods to estimate values based on other available data points for the same brand.
        Guidelines: Respond to user inputs with specific and detailed recommendations and explanations. Display data for the selected water brand, highlighting key factors relevant to the user's health condition.
        Clarification: Ask for clarification if the user's input is ambiguous or incomplete.
        Personalization: Use a friendly and informative tone to make recommendations accessible and engaging.

        Examples of requests:
        - "I have hypertension. What water do you recommend?"
        - "What is the best water for athletes?"
        - "Can I drink this water if I have kidney issues?"
        - "I want to know more about the water brand X."
      `
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: userMessage }],
    });

    res.json(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
