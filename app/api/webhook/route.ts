import { translateText } from "@/lib/google";
import { authMiddleware } from "@/lib/middleware/auth";
import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const IS_TEST_ENV = process.env.NODE_ENV === "development";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!, {
  telegram: {
    testEnv: IS_TEST_ENV,
    webhookReply: false,
  },
});

bot.use(authMiddleware);
bot.on(message("text"), async (ctx) => {
  console.info("Received message:", ctx.message.text);
  ctx.sendChatAction("typing");
  const message = ctx.message.text;
  let translatedMessage;

  // Skip translation for URL-only messages
  if (isUrlOnly(message)) {
    console.info("Message is URL-only, skipping translation");
    translatedMessage = message;
  } else if (isEnglish(message)) {
    console.info("Translating from English to Burmese");
    translatedMessage = await translateText(message, "en", "my"); // English to Burmese
  } else {
    console.info("Translating from Burmese to English");
    translatedMessage = await translateText(message, "my", "en"); // Burmese to English
  }

  await ctx.reply(translatedMessage, {
    reply_parameters: {
      message_id: ctx.message.message_id,
    },
  });
});

// Function to determine if the message is in English
function isEnglish(text: string): boolean {
  return /^[A-Za-z0-9\s.,!?'"()]+$/.test(text);
}

// Function to determine if the message is URL-only
function isUrlOnly(text: string): boolean {
  const urlPattern = /^https?:\/\/[^\s]+$/;
  return urlPattern.test(text);
}

export async function POST(req: NextRequest) {
  const update = await req.json();
  await bot.handleUpdate(update);
  return NextResponse.json({ status: "ok" });
}
