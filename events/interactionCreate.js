const index = require("../index.js")
const dotenv = require('dotenv')
const os = require('os')
dotenv.config()

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (os.hostname().indexOf('local') > -1) {
      if (interaction.guildId !== process.env.GUILD) {return}
    } else {
      if (interaction.guildId == process.env.GUILD) {return}
    }

    message = `[${interaction.user.tag} - `
    interaction.guildId
    ? message += `${interaction.guild.name} #${interaction.channel.name}] - `
    : message += `DM] - `

    interaction.isCommand() && interaction.options._group && interaction.options._subcommand ? message += `Ran the [${interaction.commandName}:${interaction.options._group}:${interaction.options._subcommand}] command`
    : interaction.isCommand() && interaction.options._subcommand ? message += `Ran the [${interaction.commandName}:${interaction.options._subcommand}] command`
    : interaction.isCommand() ? message += `Ran the [${interaction.commandName}] command`
    : interaction.isButton() ? message += `Pushed the [${interaction.message.interaction.commandName}]'s command [${interaction.customId}] button`
    : interaction.isSelectMenu() ? message += `Chose the [${interaction.customId.slice(0, -5)}] command's [${interaction.values[0]}] option`
    : (console.log(interaction), message += 'This interaction type hasn\'t been logged yet. <@554680253876928512>')

    index.log(message)

    let commandName
      interaction.isCommand() ? commandName = interaction.commandName
    : interaction.isButton() ? commandName = interaction.message.interaction.commandName
    : interaction.isSelectMenu() ? commandName = interaction.customId.slice(0, -5)
    : null

    const command = interaction.client.commands.get(commandName)

    // console.log(command)
    
    if (interaction.isCommand()) {
      try {await command.execute(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Command Error]', ephemeral: true })}
        catch (error) {
          try {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [Command Error]', ephemeral: true })}
          catch (err) {
            try {await interaction.followUp({ content: 'This interaction failed (without the red coloring :D) [Command Error]', ephemeral: true })}
            catch (err) {console.error(err)}
          }
        }
      }
    }

    if (interaction.isButton()) {
      try {await command.btnpress(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [Button Error]', ephemeral: true })}
        catch (error) {
          try {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [Button Error]', ephemeral: true })}
          catch (err) {
            try {await interaction.followUp({ content: 'This interaction failed (without the red coloring :D) [Button Error]', ephemeral: true })}
            catch (err) {console.error(err)}
          }
        }
      }
    }

    if (interaction.isSelectMenu()) {
      try {await command.menuchoose(interaction)}
      catch (error) {
        console.error(error);
        try {await interaction.reply({ content: 'This interaction failed (without the red coloring :D) [SelectMenu Error]', ephemeral: true })}
        catch (error) {
          try {await interaction.editReply({ content: 'This interaction failed (without the red coloring :D) [SelectMenu Error]', ephemeral: true })}
          catch (err) {
            try {await interaction.followUp({ content: 'This interaction failed (without the red coloring :D) [SelectMenu Error]', ephemeral: true })}
            catch (err) {console.error(err)}
          }
        }
      }
    }
	},
};