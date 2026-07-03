import dotenv from "dotenv";
import express from "express";
import { OpenAI } from "openai";
import z from "zod";

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
    // JSON_MODE
    response_format: { type: "json_object" },
    messages: [
      {
        role: "developer", // definir uma regra
        content:
          "Liste 3 produtos que atendam a necessidade do usuário. Responda em JSON no formato { produto: [string] }",
      },
      {
        role: "user",
        content: req.body.message,
      },
    ],
  });

  const output = JSON.parse(completion.choices[0].message.content ?? "");
  const schema = z.object({
    produto: z.array(z.string()),
  });

  const result = schema.safeParse(output);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid output format" });
  }

  res.json(output);
});

export default app;
