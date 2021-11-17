const index = require("../index.js")
const dotenv = require('dotenv')
dotenv.config()


module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.guildId !== process.env.GUILD) {return}
    // console.log(interaction)

    message = `[${interaction.user.tag} - #`
    interaction.guildId
    ? message += `${interaction.channel.name}] - `
    : message += `DM] - `

    interaction.isCommand() ? message += `Triggered the [${interaction.commandName}] command`
    : interaction.isCommand() && interaction.options._group && interaction.options._subcommand ? message += `Triggered the [${interaction.commandName} - ${interation.options._group} - ${interaction.options._subcommand}] command`
    : interaction.isCommand() && interaction.options._subcommand ? message += `Triggered the [${interaction.commandName}]'s ${interaction.options._subcommand}] command`
    : interaction.isButton() ? message += `Pushed the [${interaction.message.interaction.commandName}]'s command [${interaction.customId}] button`
    : interaction.isSelectMenu() ? message += `Chose the [${interaction.customId.slice(0, -5)}] command's [${interaction.values[0]}] option`
    : (console.log(interaction), message += 'THIS INTERACTION IS NOT RECORDED PLEASE DO IT IMMEDIATELY')

    index.log(message)

    let commandName
    if (interaction.isCommand()) {
      commandName = interaction.commandName
    } else if (interaction.isButton()) {
      commandName = interaction.message.interaction.commandName
    } else if (interaction.isSelectMenu()) {
      commandName = interaction.customId.slice(0, -5)
    }
    
    const command = interaction.client.commands.get(commandName)

    // console.log(interaction)
    // console.log(command)
    
    if (interaction.isCommand()) {
      try {await command.execute(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Command]', ephemeral: true })}
        catch (error) {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [Command]', ephemeral: true })}
      }
    }

    if (interaction.isButton()) {
      try {await command.buttonclick(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Button]', ephemeral: true })}
        catch (error) {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [Button]', ephemeral: true })}
      }
    }

    if (interaction.isSelectMenu()) {
      try {await command.menu(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [SelectMenu]', ephemeral: true })}
        catch (error) {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [SelectMenu]', ephemeral: true })}
      }
    }
    /* if (!interaction.isCommand()) return;
	  console.log(interaction); */
	},
};