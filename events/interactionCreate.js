const os = require("os")
const dotenv = require("dotenv")
const index = require("../index.js")
const { emojis, rep } = require("../other/misc.js")
dotenv.config()

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if ((os.hostname().includes("local") && interaction.guildId !== process.env.GUILD) || (interaction.guildId == process.env.GUILD && !os.hostname().includes("local"))) {
      return
    }

    commandName =
    interaction.isChatInputCommand() || interaction.isAutocomplete() ? interaction.commandName
    : interaction.isButton() || interaction.isSelectMenu() ? interaction.message.interaction.commandName || interaction.message.interaction.name
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
      : interaction.isButton() ? `Pushed the [${commandName}] command's [${interaction.customId}] button`
      : interaction.isSelectMenu() ? `Chose the [${commandName}] command's [${interaction.values[0]}] option`
      : interaction.isContextMenuCommand() ? `Ran the [${commandName}] context menu command`
      : (console.log(interaction), "This interaction type hasn't been logged yet. <@554680253876928512>")

      index.log(message)
    }

    const command = interaction.client.commands.get(commandName)

    if (interaction.isChatInputCommand()) {
      execute = command.execute
      type = "Command"
    } else if (interaction.isButton()) {
      execute = command.button
      type = "Button"
    } else if (interaction.isSelectMenu()) {
      execute = command.selectMenu
      type = "Select"
    } else if (interaction.isContextMenuCommand()) {
      execute = command.ctxMenu
      type = "CtxMenu"
    } else if (interaction.isAutocomplete()) {
      execute = command.autocomplete
      type = "Autocomplete"
    }

    try {await execute(interaction)}
    catch (err) {
      rep(interaction, { content: `${emojis.crossmark.shorthand} This interaction failed [${type} Error]`, ephemeral: true })
      console.error(err)
      // try {
      //   const msg = await interaction.fetchReply()
      //   console.log(msg.content)
      // } catch {
      //   console.log("Unable to fetch response")
      // }
    }

    process.once("unhandledRejection", err => {
      console.error("Unhandled promise rejection:", err)
      rep(interaction, { content: `${emojis.crossmark.shorthand} This interaction failed [${type} Error]`, ephemeral: true })
    })
  }
}