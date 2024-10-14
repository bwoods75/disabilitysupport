require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY; // Add API key to .env file
const genAI = new GoogleGenerativeAI(apiKey);

app.use(express.static('public')); // Serve static files like HTML, CSS, and JS
app.use(express.json()); // Middleware to parse JSON requests

app.post('/api/message', async (req, res) => {
  const userMessage = req.body.message;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: 'Answer as a disability advocate...',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error('Error communicating with Google Generative AI:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
