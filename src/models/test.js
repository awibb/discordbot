const { Schema, model } = require("mongoose");

const testSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  value1: {
    type: Number,
    default: 0,
  },
  value2: {
    type: Number,
    default: 0,
  },
});

module.exports = model("test", testSchema);
