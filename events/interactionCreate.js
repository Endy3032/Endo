module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Triggered the ${interaction.commandName} command.`)
    /* if (!interaction.isCommand()) return;
	  console.log(interaction); */
	},
};