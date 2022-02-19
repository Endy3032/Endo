const index = require("../index.js")
const { rep } = require("../other/misc.js")
const dotenv = require("dotenv")
const os = require("os")
dotenv.config()

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (os.hostname().indexOf("local") > -1) {
      if (interaction.guildId !== process.env.GUILD) {return}
    } else {
      if (interaction.guildId == process.env.GUILD) {return}
    }

    console.log(interaction)

    commandName =
    interaction.isChatInputCommand() || interaction.isAutocomplete() ? interaction.commandName
      : interaction.isButton() ? interaction.message.interaction.commandName || interaction.message.interaction.name
        : interaction.isSelectMenu() ? interaction.customId.slice(0, -5)
          : interaction.isContextMenuCommand() ? interaction.commandName.replace("[G] ", "")
            : null

    if (!interaction.isAutocomplete()) {
      message = `[${interaction.user.tag} - `
      message +=
      interaction.guildId
        ? `${interaction.guild.name} #${interaction.channel.name}] - `
        : "DM] - "
      
      message +=
      interaction.isChatInputCommand() && interaction.options._group ? `Ran the [${commandName}:${interaction.options._group}:${interaction.options._subcommand}] command`
        : interaction.isChatInputCommand() && interaction.options._subcommand ? `Ran the [${commandName}:${interaction.options._subcommand}] command`
          : interaction.isChatInputCommand() ? `Ran the [${commandName}] command`
            : interaction.isButton() ? `Pushed the [${commandName}]'s command [${interaction.customId}] button`
              : interaction.isSelectMenu() ? `Chose the [${commandName}] command's [${interaction.values[0]}] option`
                : interaction.isContextMenuCommand() ? `Ran the [${commandName}] context menu command`
                  : (console.log(interaction), "This interaction type hasn't been logged yet. <@554680253876928512>")

      index.log(message)
    }

    const command = interaction.client.commands.get(commandName)
    
    if (interaction.isChatInputCommand()) {
      try {await command.execute(interaction)}
      catch (err) {
        console.error(err)
        rep(interaction, { content: "This interaction failed (without the red coloring :D) [Command Error]", ephemeral: true })
      }
    }

    if (interaction.isButton()) {
      try {await command.button(interaction)}
      catch (err) {
        console.error(err)
        rep(interaction, { content: "This interaction failed (without the red coloring :D) [Button Error]", ephemeral: true })
      }
    }

    if (interaction.isSelectMenu()) {
      try {await command.selectMenu(interaction)}
      catch (err) {
        console.error(err)
        rep(interaction, { content: "This interaction failed (without the red coloring :D) [SelectMenu Error]", ephemeral: true })
      }
    }

    if (interaction.isContextMenuCommand()) {
      try {await command.ctxMenu(interaction)}
      catch (err) {
        console.error(err)
        rep(interaction, { content: "This interaction failed (without the red coloring :D) [CtxMenu Error]", ephemeral: true })
      }
    }

    if (interaction.isAutocomplete()) {
      try {await command.autocomplete(interaction)}
      catch (err) {
        console.error(err)
        rep(interaction, { content: "This interaction failed (without the red coloring :D) [Autocomplete Error]", ephemeral: true })
      }
    }
  },
}