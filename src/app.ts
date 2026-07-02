import dotenv from "dotenv";
import express from "express";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 100,
    messages: [
      {
        role: "developer", // definir uma regra
        content:
          "Você é um assistente que gera histórias de uma frase. Use emojis a cada 2 palavras.",
      },
      {
        role: "user",
        content: req.body.message,
      },
    ],
  });

  res.json({
    message: completion.choices[0].message.content,
  });
});

export default app;
