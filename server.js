require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;

// Log the API key value to the console (server-side)
console.log(`GEMINI_API_KEY: ${apiKey}`);

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Answer as a disability advocate who is trying to foster better understanding of individuals with intellectual disabilities. Keep answers short and conversational.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'simple.html'));
});

app.get('/api/chat', async (req, res) => {
  const userMessage = req.query.message;
  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing your request.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  // Alert the value of the environment variable in the console
  console.log(`Alert: The value of GEMINI_API_KEY is ${apiKey}`);
});