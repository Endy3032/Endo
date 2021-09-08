const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get the bot latency info'),
	async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nWebsocket Latency: ${interaction.client.ws.ping}ms\nRoundtrip Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};