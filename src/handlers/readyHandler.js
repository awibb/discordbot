module.exports = (client) => {
  client.on("ready", (c) => {
    console.log(`Logged in as ${client.user.tag}!`);

    // client.user.setActivity({
    //   name: "Gambling Simulator",
    // });

    // setInterval(() => {
    //   console.log("alive!");
    // }, 10000);
  });
};
