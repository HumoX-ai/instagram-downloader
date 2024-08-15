require("dotenv").config({ path: ".env.local" });
const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const { setupBotCommands } = require("./src/botCommands");

// Bot tokenni kiriting
const bot = new Bot(process.env.BOT_TOKEN);

// Bot komandalarini sozlash
setupBotCommands(bot);

const app = express();
app.use(express.json());

app.use(webhookCallback(bot, "express"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
