module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
    // if (interaction.guildId !== '864972641219248140') {return}

    interaction.guildId
    ? message = `[${interaction.user.tag} - #${interaction.channel.name}] - `
    : message = `[${interaction.user.tag} - DM] - `

		interaction.isCommand() ? message += `Triggered the [${interaction.commandName}] command`
    : interaction.isButton() ? message += `Pushed the [${interaction.message.interaction.commandName}]'s command [${interaction.customId}] button`
    : interaction.isSelectMenu() ? message += `Chose the [${interaction.message.interaction.commandName}] command's [${interaction.values[0]}] option`
    : console.log(interaction + '\nTHIS INTERACTION IS NOT RECORDED PLEASE DO IT IMMEDIATELY')

    console.log(message)

    if (interaction.isCommand()) {
      commandName = interaction.commandName
    } else if (interaction.isButton()) {
      commandName = interaction.message.interaction.commandName
    } else if (interaction.isSelectMenu()) {
      try {commandName = interaction.message.interaction.commandName}
      catch (e) {commandName = interaction.customId.slice(0, -5)}
    }
    
    const command = interaction.client.commands.get(commandName)
    if (interaction.isCommand()) {
      try {await command.execute(interaction)}
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Command]', ephemeral: true });
      }
    }

    if (interaction.isButton()) {
      try {await command.buttonclick(interaction)}
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Button]', ephemeral: true });
      }
    }

    if (interaction.isSelectMenu()) {
      try {await command.menu(interaction)}
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [SelectMenu]', ephemeral: true });
      }
    }
    /* if (!interaction.isCommand()) return;
	  console.log(interaction); */
	},
};