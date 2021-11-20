const { promisify } = require('util')
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Repeat something')
    .addStringOption(option => option
      .setName('message')
      .setDescription('The message to repeat [string]')
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName('times')
      .setDescription('The number of times to repeat the message [int 1~10, default 3]')
      .setRequired(false)
    ),

	async execute(interaction) {
    function rep(msg, x) {
      setTimeout(function() {interaction.channel.send(msg)}, 500 * x)
    }

    const message = interaction.options.getString('message')
    var times = interaction.options.getInteger('times') || 3

    times > 10 ? (times = 10, response += '\nNote: 10 times maximum') : times
    response = `Dispatching "${message}" ${times} times`
    
    if (interaction.guild) {
      await interaction.reply({content: response, ephemeral: true})
      for (let i = 0; i < times; i++) {rep(message, i)}
    }
    else {
      await interaction.reply("This command can't be used in DM or any other places except for server channels.")
    }
  },
};

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "none",
  usage: '`/' + module.exports.data.name + '`'
}