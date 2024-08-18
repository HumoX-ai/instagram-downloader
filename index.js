import { Bot, webhookCallback } from "grammy";
import dotenv from "dotenv";
import {
  downloadInstagramContent,
  downloadTikTokContent,
} from "./src/download.js";
import isValidUrl from "./src/validation.js";
dotenv.config();
import express from "express";

// Bot tokenni kiriting
const bot = new Bot(process.env.BOT_TOKEN);

// /start komandasi
bot.command("start", (ctx) => {
  const userName = ctx.from.first_name;

  ctx.reply(
    ` Hayrli kun ${userName}, Instagram video yuklab olish botiga xush kelibsiz! Video yuklash uchun link tashlang`
  );
});

bot.command("help", (ctx) =>
  ctx.reply(
    "Bu bot orqali Instagram yoki TikTok'dan video yuklab olishingiz mumkin. Linkni yuboring, va video yuklab olinadi."
  )
);

bot.on(":new_chat_members", (ctx) =>
  ctx.reply(
    "Xush kelibsiz! Instagram yoki TikTok'dan video yuklab olish uchun link yuboring."
  )
);

// Foydalanuvchi link yuborganda
bot.on("message:text", async (ctx) => {
  try {
    const url = ctx.message.text;

    if (!isValidUrl(url)) {
      await ctx.reply("Iltimos, to'g'ri URL manzilini yuboring.");
      return;
    }

    // Foydalanuvchiga typing faoliyatini ko'rsatish
    await ctx.replyWithChatAction("typing");

    if (url.includes("instagram.com")) {
      const contentUrls = await downloadInstagramContent(url);
      if (contentUrls && contentUrls.length > 0) {
        const mediaGroup = contentUrls.map((url) => ({
          type: "video",
          media: url,
        }));
        await ctx.replyWithMediaGroup(mediaGroup);
      } else {
        await ctx.reply(
          "Iltimos, to'g'ri Instagram URL manzilini yuboring yoki URL'da kontent mavjudligiga ishonch hosil qiling."
        );
      }
    } else if (url.includes("tiktok.com")) {
      const contentUrl = await downloadTikTokContent(url);
      if (contentUrl) {
        await ctx.replyWithVideo(contentUrl);
        // await ctx.reply(
        //   "Hozircha tik tok uchun video yuklay olmaysiz. Buning ustida ishlamoqdaman"
        // );
      } else {
        await ctx.reply("Iltimos, to'g'ri TikTok URL manzilini yuboring.");
      }
    } else {
      await ctx.reply(
        "Iltimos, to'g'ri Instagram yoki TikTok URL manzilini yuboring."
      );
    }
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    await ctx.reply(
      "Nimadir noto'g'ri ketdi. Iltimos, keyinroq qayta urinib ko'ring."
    );
  }
});

// Express serverini yaratish
const app = express();
app.use(express.json());

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
