const {
  authorize,
  listAndMarkUnreadEmails,
} = require("../gmailData/gmailClient");

const processEmails = async () => {
  try {
    const auth = await authorize();
    const evBets = await listAndMarkUnreadEmails(auth);
    console.log(evBets);
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
      await processEmails(); // Use await inside the setInterval callback
    }, 30000);
  });
};
