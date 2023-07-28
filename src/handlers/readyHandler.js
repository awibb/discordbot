const { EmbedBuilder, Embed } = require("discord.js");
const {
  authorize,
  listAndMarkUnreadEmails,
} = require("../gmailData/gmailClient");

const processEmails = async (client) => {
  try {
    const auth = await authorize();
    const evBets = await listAndMarkUnreadEmails(auth);
    //console.log(evBets);
    sendMessageToChannel(evBets, client);
  } catch (error) {
    console.error(error);
  }
};
module.exports = (client) => {
  client.on("ready", async (c) => {
    // Add 'async' here
    console.log(`Logged in as ${client.user.tag}!`);

    // client.user.setActivity({
    //   name: "Gambling Simulator",
    // });

    setInterval(async () => {
      await processEmails(client); // Use await inside the setInterval callback
    }, 30000);
  });
};

// Function to send a message to the specified channel
function sendMessageToChannel(message, client) {
  const CHANNEL_ID = "1133507028770365472";
  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) {
    console.error("Channel not found. Check if the channel ID is correct.");
    return;
  }

  // console.log("Channel ID:", channel.id);
  // console.log("Channel type:", channel.type);
  // console.log("Channel name:", channel.name);

  if (channel.type !== 0) {
    console.error("The channel is not a text channel.");
    return;
  }
  const embedList = [];
  // console.log("message: " + typeof message);
  if (message) {
    message.forEach((element) => {
      // console.log("ELEMENT");
      // console.log(element);

      const embed = new EmbedBuilder()
        .setTitle("New EV Bet Opportunity")
        //.setDescription("this is a description")
        .setColor("Green")
        .addFields(
          {
            name: "Book",
            value: String(element.book),
          },
          {
            name: "Event",
            value: String(element.event),
          },
          {
            name: "Date",
            value: String(element.date),
          },

          {
            name: "Bet",
            value: String(element.bet),
          },
          {
            name: "Edge",
            value: String(element.edge),
          }
        );
      embedList.push(embed);
    });
  }

  // Send the message
  console.log("EMBED LENGTH    : " + embedList.length);
  if (embedList.length > 0) {
    channel
      .send({ embeds: embedList })
      .then(() => {
        console.log("Message sent successfully.");
      })
      .catch((error) => {
        console.error("Error while sending message:", error);
      });
  } else {
    console.log("no bets found in last cycle");
  }
}
