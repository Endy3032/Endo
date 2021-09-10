module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		interaction.isCommand() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Triggered the ${interaction.commandName} command`)
    : interaction.isButton() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Pushed the ${interaction.message.interaction.commandName}'s command ${interaction.customId} button`)
    : interaction.isSelectMenu() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Chose the ${interaction.message.interaction.commandName} command's ${interaction.values[0]} option`)
    : null
    /* if (!interaction.isCommand()) return;
	  console.log(interaction); */
	},
};