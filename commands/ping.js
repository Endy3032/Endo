const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the bot latency info'),
	async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

    const pingEmbed = new MessageEmbed()
    .setTitle('Pong!')
    .addFields(
      { name: 'Websocket Latency', value: `${interaction.client.ws.ping}ms`, inline: false },
      { name: 'Roundtrip Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: false }
    )

    await interaction.editReply({content: null, embeds: [pingEmbed]})
  },
};

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "none",
  usage: '`/' + module.exports.data.name + '`'
}