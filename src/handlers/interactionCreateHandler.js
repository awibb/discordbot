const { EmbedBuilder, Embed } = require("discord.js");
const Test = require("../models/test");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Your interactionCreate event code here

    // Example code for the "add" command
    if (interaction.commandName === "add") {
      const num1 = interaction.options.get("first-number").value;
      const num2 = interaction.options.get("second-number").value;
      console.log(interaction.user.id);
      console.log(interaction);
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        value1: num1,
        value2: num2,
      };
      console.log(query);
      const test = await Test.findOne(query);
      //if the entry already exists
      if (test) {
        console.log("db entry already exists");
        // test.value1 = num1;
        // test.value2 = num2;
        // await test.Save().catch((e) => {
        //   console.log("error saving updated add entry");
        // });
      }
      // if new db entry
      else {
        const newEntry = new Test({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          value1: 5,
          value2: 12,
        });
        await newEntry.save();
        console.log("new record added to DB");
      }

      interaction.reply(`The sum is ${num1 + num2}`);
    }

    // Example code for the "embed" command
    if (interaction.commandName === "embed") {
      const embed = new EmbedBuilder()
        .setTitle("embed title")
        .setDescription("this is a description")
        .setColor("Random")
        .addFields(
          { name: "field title", value: "some random value", inline: true },
          { name: "field title2", value: "some random value2", inline: true },
          { name: "field title3", value: "some random value3", inline: true }
        );

      interaction.reply({ embeds: [embed] });
    }
  });
};
