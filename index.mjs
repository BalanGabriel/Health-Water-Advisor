import OpenAI from 'openai';

// Crearea clientului OpenAI folosind cheia din variabilele de mediu
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Accesarea cheii API din variabilele de mediu
});

// Exemplu de utilizare a completărilor de chat
async function main() {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say this is a test' }],
    });
    console.log(chatCompletion);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
