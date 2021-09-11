const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get the bot latency info [G]'),
	async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nWebsocket Latency: ${interaction.client.ws.ping}ms\nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "none",
  usage: '`/' + module.exports.data.name + '`'
}