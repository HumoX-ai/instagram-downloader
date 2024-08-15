import { Bot, webhookCallback } from "grammy";
import express from "express";
import instagramDl from "@sasmeee/igdl";

const bot = new Bot("2124012147:AAHLrHAt36dllh_uAgQiKXmdmHfy7kcwhqA");
const app = express();

// Instagram video download function
async function downloadInstagramVideo(url) {
  try {
    const dataList = await instagramDl(url);
    const downloadLink = dataList[0]?.download_link;
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

// /start command
bot.command("start", (ctx) =>
  ctx.reply(
    "Welcome to the Instagram Video Downloader Bot! Please send a link to download a video."
  )
);

// Handle text messages
bot.on("message:text", async (ctx) => {
  const url = ctx.message.text;
  if (!isValidInstagramUrl(url)) {
    await ctx.reply("Please send a valid Instagram URL.");
    return;
  }

  await ctx.replyWithChatAction("upload_video");

  const videoUrl = await downloadInstagramVideo(url);

  if (videoUrl) {
    await ctx.replyWithVideo(videoUrl);
  } else {
    await ctx.reply("An error occurred while downloading the video.");
  }
});

// Set up the webhook endpoint
app.use(express.json());
app.use(`/${bot.token}`, webhookCallback(bot, "express"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  const webhookUrl = `https://cb76-213-230-102-239.ngrok-free.app/${bot.token}`;
  await bot.api.setWebhook(webhookUrl);
  console.log(`Webhook set to ${webhookUrl}`);
});
