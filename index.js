import { Bot, webhookCallback } from "grammy";
import instagramDl from "@sasmeee/igdl";

// Bot tokenni o'zgartiring
const bot = new Bot("YOUR_BOT_TOKEN");

// Instagram videoni yuklab olish uchun funksiya
async function downloadInstagramVideo(url) {
  try {
    const dataList = await instagramDl(url);
    const downloadLink = dataList[0]?.download_link;
    console.log(downloadLink);
    return downloadLink;
  } catch (error) {
    console.error("Error:", error);
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
  if (!isValidInstagramUrl(url)) {
    await ctx.reply("Iltimos, to'g'ri Instagram URL manzilini yuboring.");
    return;
  }

  await ctx.replyWithChatAction("upload_video");

  const videoUrl = await downloadInstagramVideo(url);

  if (videoUrl) {
    await ctx.replyWithVideo(videoUrl);
  } else {
    await ctx.reply("Video yuklab olishda xatolik yuz berdi");
  }
});

// Webhook handler
export default webhookCallback(bot, "http");
