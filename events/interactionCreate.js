module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		interaction.isCommand() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Triggered the [${interaction.commandName}] command`)
    : interaction.isButton() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Pushed the [${interaction.message.interaction.commandName}]'s command [${interaction.customId}] button`)
    : interaction.isSelectMenu() ? console.log(`[${interaction.user.tag} - #${interaction.channel.name}] - Chose the [${interaction.message.interaction.commandName}] command's [${interaction.values[0]}] option`)
    : console.log(interaction + '\nTHIS INTERACTION IS NOT RECORDED PLEASE DO IT IMMEDIATELY')

    if (interaction.isCommand()) {
      commandName = interaction.commandName
    } else if (interaction.isButton() || interaction.isSelectMenu()) {
      commandName = interaction.message.interaction.commandName
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