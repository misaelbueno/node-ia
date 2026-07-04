import dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import z from "zod";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const schema = z.object({
  produtos: z.array(z.string()),
});

export const generateProducts = async (message: string) => {
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
        content: message,
      },
    ],
  });

  if (!completion.choices[0].message.refusal) {
    throw new Error("Refusal");
  }

  return completion.choices[0].message.parsed;
};
