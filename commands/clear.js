const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
  data: new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear messages in the channel')
  .addIntegerOption(option => option
    .setName('amount')
    .setDescription('Amount of messages to clear [integer 1~100]')
    .setRequired(true)
  ),
  
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount')
    await interaction.channel.bulkDelete(amount)
      .then(console.log(`Cleared ${amount} messages`))
      .catch(console.error);
    await interaction.reply({ content: `Cleared \`${amount}\` messages`, ephemeral: true })
	}
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "<amount [int 1~100]>",
  usage: '`/' + module.exports.data.name + '<amount>`'
}