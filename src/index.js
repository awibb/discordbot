// index.js
require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    //connect to database
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("connected to DB");
    eventHandler(client);
    client.login(process.env.TOKEN);
  } catch (e) {
    console.log(`error on bot startup up ${e}`);
  }
  // Use the eventHandler to handle all the events
})();

// Use the eventHandler to handle all the events
