import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or another suitable lightweight model
      messages: [
        {
          role: "system",
          content: `You are a translation expert. Translate the following text from ${sourceLanguage} to ${targetLanguage}.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message?.content || "Translation failed.";
    } else {
      return "Translation failed.";
    }
  } catch (error: any) {
    console.error("Translation error:", error);
    return `Translation failed: ${error.message}`;
  }
}
