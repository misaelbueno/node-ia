import dotenv from "dotenv";
import express from "express";
import { OpenAI } from "openai";
import z from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const app = express();
app.use(express.json());

const schema = z.object({
  produtos: z.array(z.string()),
});

app.post("/generate", async (req, res) => {
  try {
    const completion = await client.chat.completions.parse({
      model: "gpt-4o-mini",
      max_completion_tokens: 100,
      response_format: zodResponseFormat(schema, "produtos_schema"),
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

    if (!completion.choices[0].message.refusal) {
      res
        .status(400)
        .json({ error: "The model refused to generate a response." });
      return;
    }

    res.json(completion.choices[0].message.parsed?.produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
