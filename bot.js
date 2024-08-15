import { Bot, webhookCallback } from "grammy";
import express from "express";
import instagramDl from "@sasmeee/igdl";

const bot = new Bot("SIZNING_BOT_TOKEN");
const app = express();

// Instagram video yuklab olish funksiyasi
async function downloadInstagramVideo(url) {
  try {
    const dataList = await instagramDl(url);
    const downloadLink = dataList[0]?.download_link;
    return downloadLink;
  } catch (error) {
    console.error("Xatolik:", error);
  }
}

function isValidInstagramUrl(url) {
  const instagramUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\s/]+\/[^\s/]+\/?/;
  return instagramUrlPattern.test(url);
}

// /start komanda
bot.command("start", (ctx) =>
  ctx.reply(
    "Instagram video yuklab olish botiga xush kelibsiz! Video yuklash uchun linkni yuboring."
  )
);

// Matnli xabarlarni qayta ishlash
bot.on("message:text", async (ctx) => {
  const url = ctx.message.text;
  if (!isValidInstagramUrl(url)) {
    await ctx.reply("Iltimos, to'g'ri Instagram URL manzilini yuboring.");
    return;
  }

  await ctx.replyWithChatAction("upload_video");

  const videoUrl = await downloadInstagramVideo(url);

  if (videoUrl) {
    await ctx.replyWithVideo(videoUrl);
  } else {
    await ctx.reply("Video yuklab olishda xatolik yuz berdi.");
  }
});

// Webhook endpointini sozlash
app.use(express.json());
app.use(`/api/${bot.token}`, webhookCallback(bot, "express"));

// Serverni sozlash
export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}
