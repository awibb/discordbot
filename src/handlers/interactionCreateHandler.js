const { EmbedBuilder, Embed } = require("discord.js");
const Test = require("../models/test");
const addCommand = require("./commands/addCommand");
const addResultCommand = require("./commands/addResultCommand");
const {
  authorize,
  listAndMarkUnreadEmails,
} = require("../gmailData/gmailClient");
// const embedCommand = require("./commands/embedCommand");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Your interactionCreate event code here

    // Example code for the "add" command
    if (interaction.commandName === "add") {
      await addCommand(interaction);
    }

    if (interaction.commandName === "addresult") {
      await addResultCommand(interaction);
    }
    if (interaction.commandName === "fetchodds") {
      console.log("fetch email data from gmail!");
      interaction.reply("fetch email data from gmail!");
      try {
        const auth = await authorize();
        await listAndMarkUnreadEmails(auth);
      } catch (error) {
        console.error(error);
      }
    }
  });
};
