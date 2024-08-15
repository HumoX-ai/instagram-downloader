import { Bot, webhookCallback } from "grammy";
import instagramDl from "@sasmeee/igdl";
import tik from "rahad-media-downloader";
import express from "express";

// Bot tokenni kiriting
const bot = new Bot("1835122693:AAGXn10Cs_0KPYFL2hatEHGMomABzq-KJcg");

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
    const result = await tik.rahadtikdl(url);
    console.log(result.data.noWatermarkMp4);
    return result.data.noWatermarkMp4;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function isValidInstagramUrl(url) {
  const instagramUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s/]+\/[^\s/]+\/?/;
  return instagramUrlPattern.test(url);
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
  // if (!isValidInstagramUrl(url)) {
  //   await ctx.reply("Iltimos, to'g'ri Instagram URL manzilini yuboring.");
  //   return;
  // }

  // Foydalanuvchiga typing faoliyatini ko'rsatish
  await ctx.replyWithChatAction("upload_video");
  let videoUrl;
  if (isValidInstagramUrl(url)) {
    videoUrl = await downloadInstagramVideo(url);
  } else {
    videoUrl = await downloadTikTokVideo(url);
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
