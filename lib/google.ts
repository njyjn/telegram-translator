import { v2 } from "@google-cloud/translate";

const credentials = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}",
);

// Creates a client
const translationClient = new v2.Translate({ credentials });

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> {
  try {
    // Construct request
    const request = {
      format: "text",
      from: sourceLanguage,
      to: targetLanguage,
    };

    // Run request
    const [response] = await translationClient.translate([text], request);

    if (response && response.length > 0) {
      return response[0] || "Translation failed.";
    } else {
      return "Translation failed.";
    }
  } catch (error: any) {
    console.error("Translation error:", error);
    return `Translation failed: ${error.message}`;
  }
}
