//importa as bibliotecas instaladas
const TelegramBot = require("node-telegram-bot-api");
const sharp = require("sharp");

//token do bot do telegram
const token = "6191560870:AAFkRoK7QE8aCQzqkHQ1Umwgf7A0KqTxQe4";

//cria o bot
const bot = new TelegramBot(token, { polling: true });


bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.photo && msg.photo[msg.photo.length - 1].file_id) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    bot.getFile(fileId).then((file) => {
      const filePath = file.file_path;
      const request = require("request");
      const fs = require("fs");
      const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

      request
        .get(fileUrl)
        .on("error", (err) => {
          console.log(err);
        })
        .pipe(fs.createWriteStream("image.webp"))
        .on("close", () => {
          sharp("image.webp")
            .jpeg()
            .toBuffer()
            .then((filename) => {
              bot.sendPhoto(chatId, filename, {
                caption: "Imagem convertida 🚀😎",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    });
  }
});
