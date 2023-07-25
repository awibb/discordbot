const Test = require("../../models/test");

module.exports = async (interaction) => {
  const num1 = interaction.options.get("first-number").value;
  const num2 = interaction.options.get("second-number").value;
  //   console.log(interaction.user.id);
  //   console.log(interaction);
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
      value1: num1,
      value2: num2,
    });
    await newEntry.save();
    console.log("new record added to DB");
  }

  interaction.reply(`The sum is ${num1 + num2}`);
};
