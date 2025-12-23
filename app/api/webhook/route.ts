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
  try {
    const rawMessage = ctx.message.text?.trim();

    // Guard against empty messages
    if (!rawMessage) {
      console.warn("Received empty message");
      return;
    }

    console.info("Received message:", rawMessage);
    await ctx.sendChatAction("typing");
    let translatedMessage: string;

    // Skip translation for URL-only messages
    if (isUrlOnly(rawMessage)) {
      console.info("Message is URL-only, skipping translation");
      translatedMessage = rawMessage;
    } else if (isEnglish(rawMessage)) {
      console.info("Translating from English to Burmese");
      translatedMessage = await translateText(rawMessage, "en", "my"); // English to Burmese
    } else {
      console.info("Translating from Burmese to English");
      translatedMessage = await translateText(rawMessage, "my", "en"); // Burmese to English
    }

    await ctx.reply(translatedMessage, {
      reply_parameters: {
        message_id: ctx.message.message_id,
      },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    try {
      await ctx.reply(
        "Sorry, I encountered an error processing your message. Please try again.",
      );
    } catch (replyError) {
      console.error("Error sending error reply:", replyError);
    }
  }
});

// Function to determine if the message is in English
// Allows Latin characters, common punctuation, and numbers
function isEnglish(text: string): boolean {
  // Count Latin characters vs other scripts
  const latinChars = (text.match(/[A-Za-z]/g) || []).length;
  const totalChars = text.length;
  // If more than 70% of letters are Latin, consider it English
  return latinChars > 0 && latinChars / totalChars > 0.7;
}

// Function to determine if the message is URL-only
function isUrlOnly(text: string): boolean {
  const urlPattern = /^https?:\/\/[^\s]+$/;
  return urlPattern.test(text);
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
