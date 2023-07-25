const Test = require("../../models/test");
const { EmbedBuilder, Embed } = require("discord.js");

module.exports = async (interaction) => {
  console.log("make db call");
  const embedsTest = [];
  await Test.find()
    .then((documents) => {
      console.log("All entries:", documents);

      // Iterate through each entry
      documents.forEach((entry) => {
        console.log("val1", entry.value1);
        console.log("val2", entry.value2);

        // Do whatever you want to do with each entry here
        const embed = new EmbedBuilder()
          .setTitle("embed title")
          .setDescription("this is a description")
          .setColor("Random")
          .addFields(
            {
              name: "value1",
              value: String(entry.value1),
              inline: true,
            },
            {
              name: "value2",
              value: String(entry.value2),
              inline: true,
            },
            {
              name: "sum",
              value: String(entry.value1 + entry.value2),
              inline: true,
            }
          );
        embedsTest.push(embed);
      });
    })
    .catch((err) => {
      console.error("Error finding documents:", err);
    });
  console.log(embedsTest.length);
  if (embedsTest.length > 0) {
    interaction.reply({ embeds: embedsTest });
  } else {
    interaction.reply("No records in the database");
  }
};
