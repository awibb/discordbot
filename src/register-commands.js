require("dotenv").config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
  {
    name: "add",
    description: "adds two numbers",
    options: [
      {
        name: "first-number",
        description: "the first number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "second-number",
        description: "the second number",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: "embed",
    description: "send an embed",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const registerSlashCommands = async () => {
  try {
    console.log("Registering slash commands");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands,
      }
    );
    console.log("Slash commands were registered successfully");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};

registerSlashCommands();
