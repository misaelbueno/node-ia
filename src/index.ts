import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function generateText() {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 100,
    messages: [
      {
        role: "developer", // definir uma regra
        content: "Use emojis a cada 2 palavras.",
      },
      {
        role: "user",
        content: "Escreva uma pequena história sobre unicórnios.",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

generateText();
