app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // Parcurge toate rândurile din Excel și caută orice informație care ar putea fi relevantă pentru mesajul utilizatorului
    const matchingData = excelData.filter(row => {
      return Object.values(row).some(value => 
        value && value.toString().toLowerCase().includes(userMessage)
      );
    });

    if (matchingData.length > 0) {
      const detailedList = matchingData.map(row => {
        return Object.entries(row).map(([key, value]) => `${key}: ${value || 'N/A'}`).join('\n');
      }).join('\n\n');

      res.json({ answer: `Iată informațiile relevante din baza de date:\n${detailedList}` });
      return;
    }

    // Dacă nu se găsesc date relevante în Excel, se trece la generarea unui răspuns cu OpenAI
    const systemMessage = {
      role: "system",
      content: `
        You are Health & Water Advisor. Welcome! I can help you choose the best water to drink based on your health needs, with a focus on Romanian water brands. Just tell me your condition, and I'll provide recommendations and detailed information.
      `
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, { role: 'user', content: req.body.message }],
    });

    res.json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred: ' + error.message);
  }
});
