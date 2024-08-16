import { Bot, webhookCallback } from "grammy";
import s from "videos-downloader";
import express from "express";

// Bot tokenni kiriting
const bot = new Bot("2124012147:AAHLrHAt36dllh_uAgQiKXmdmHfy7kcwhqA");

// Instagram videoni yuklab olish uchun funksiya
async function downloadInstagramContent(url) {
  try {
    const dataList = await s.instagram(url);
    console.log(dataList.url_list);
    return dataList.url_list; // URL manzillarni olamiz (rasm yoki video bo'lishi mumkin)
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

  // Foydalanuvchiga typing faoliyatini ko'rsatish
  await ctx.replyWithChatAction("typing");

  const contentUrls = await downloadInstagramContent(url);
  if (contentUrls && contentUrls.length > 0) {
    if (contentUrls.length === 1) {
      // Agar faqat bitta media bo'lsa, to'g'ridan-to'g'ri yuboriladi
      const mediaUrl = contentUrls[0];
      if (mediaUrl.includes("/ig/")) {
        await ctx.replyWithVideo(mediaUrl);
      } else {
        await ctx.replyWithPhoto(mediaUrl);
      }
    } else {
      // Agar bir nechta media bo'lsa, media guruh sifatida yuboriladi
      const mediaGroup = contentUrls.map((mediaUrl) => {
        return {
          type: mediaUrl.includes("/ig/") ? "video" : "photo",
          media: mediaUrl,
        };
      });
      await ctx.replyWithMediaGroup(mediaGroup);
    }
  } else {
    await ctx.reply("Kontentni yuklab olishda xatolik yuz berdi");
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
