const {
  downloadInstagramVideo,
  downloadTikTokVideo,
} = require("./utils/downloadUtils");
const {
  isValidInstagramUrl,
  isValidTikTokUrl,
} = require("./validation/urlValidation");

function setupBotCommands(bot) {
  bot.command("start", (ctx) =>
    ctx.reply(
      "Instagram video yuklab olish botiga xush kelibsiz! Video yuklash uchun link tashlang"
    )
  );

  bot.on("message:text", async (ctx) => {
    const url = ctx.message.text;

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
}

module.exports = { setupBotCommands };
