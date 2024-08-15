// require("dotenv").config({ path: ".env" });
const { Bot, webhookCallback } = require("grammy");
const instagramDl = require("@sasmeee/igdl");
const { alldl } = require("rahad-all-downloader");
const express = require("express");

// Bot tokenni kiriting
const bot = new Bot("2124012147:AAHLrHAt36dllh_uAgQiKXmdmHfy7kcwhqA");

// Instagram videoni yuklab olish uchun funksiya
async function downloadInstagramVideo(url) {
  try {
    const dataList = await instagramDl(url);
    const downloadLink = dataList[0]?.download_link; // dataList[0] - birinchi video ma'lumotlari
    console.log(downloadLink);
    return downloadLink;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function downloadTikTokVideo(url) {
  try {
    const result = await alldl(url);
    console.log(result.data.videoUrl);
    return result.data.videoUrl;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function isValidInstagramUrl(url) {
  const instagramUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s/]+\/[^\s/]+\/?/;
  return instagramUrlPattern.test(url);
}

function isValidTikTokUrl(url) {
  const tikTokUrlPattern = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?/;
  return tikTokUrlPattern.test(url);
}

// /start komandasi
bot.command("start", (ctx) =>
  ctx.reply(
    "Instagram video yuklab olish botiga xush kelibsiz! Video yuklash uchun link tashlang"
  )
);

// Foydalanuvchi link yuborganda
bot.on("message:text", async (ctx) => {
  const url = ctx.message.text;

  // Foydalanuvchiga typing faoliyatini ko'rsatish
  await ctx.replyWithChatAction("upload_video");
  let videoUrl;

  if (isValidInstagramUrl(url)) {
    videoUrl = await downloadInstagramVideo(url);
  } else if (isValidTikTokUrl(url)) {
    videoUrl = await downloadTikTokVideo(url);
  } else {
    await ctx.reply("Link noto'g'ri kiritildi");
    return;
  }

  if (videoUrl) {
    await ctx.replyWithVideo(videoUrl);
  } else {
    await ctx.reply("Video yuklab olishda xatolik yuz berdi");
  }
});

bot.start();

// Express serverini yaratish
const app = express();
app.use(express.json());

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
