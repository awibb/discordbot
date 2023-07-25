const readyHandler = require("./readyHandler");
const interactionCreateHandler = require("./interactionCreateHandler");

module.exports = (client) => {
  // Call the individual event handlers here
  readyHandler(client);
  interactionCreateHandler(client);
};
