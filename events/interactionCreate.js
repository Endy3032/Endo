const os = require("os")
require("dotenv").config()
const { emojis, nordChalk, rep } = require("../other/misc.js")

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    isLocal = os.hostname().includes("local")
    isTestGuild = interaction.guildId == process.env.Guild
    isReplitTest = interaction.channelId == "952520918645755924"
    if ((isLocal && !isTestGuild) || !(isLocal && !isTestGuild)) {
      if ((isLocal && isReplitTest) || (!isLocal && !isReplitTest)) {
        return
      }
    }

    commandName =
    interaction.isChatInputCommand() || interaction.isAutocomplete() ? interaction.commandName
    : interaction.isButton() || interaction.isSelectMenu() || interaction.isModalSubmit() ? interaction.message.interaction.commandName || interaction.message.interaction.name
    : interaction.isContextMenuCommand() ? interaction.commandName.replace("[D] ", "")
    : null

    if (!interaction.isAutocomplete()) {
      message = nordChalk.bright.cyan(`[${interaction.user.tag} | ${interaction.guildId ? `${interaction.guild.name}#${interaction.channel.name}` : "DM"}] `)

      message +=
      interaction.isChatInputCommand() && interaction.options._group ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._group}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() && interaction.options._subcommand ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() || interaction.isContextMenuCommand() ? `Triggered ${nordChalk.bright.cyan(`[${commandName}]`)}`
      : interaction.isButton() ? `Pushed ${nordChalk.bright.cyan(`[${commandName}/${interaction.customId}]`)}`
      : interaction.isSelectMenu() ? `Selected ${nordChalk.bright.cyan(`[${commandName}/[${interaction.values.join("|")}]]`)}`
      : interaction.isModalSubmit() ? `Submitted ${nordChalk.bright.cyan(`[${commandName}/${interaction.customId}]`)}`
      : "Unknown Interaction", () => {console.botLog(`${interaction}\nThis interaction type hasn't been logged yet. <@554680253876928512>`)}

      console.botLog(message)
    }

    const command = interaction.client.commands.get(commandName)

    handleError = (err) => {
      try {rep(interaction, { content: `${emojis.crossmark.shorthand} This interaction failed [${type} Error]`, ephemeral: true })}
      catch {rep(interaction, { content: `${emojis.crossmark.shorthand} This interaction failed [Unknown Error]`, ephemeral: true })}
      console.botLog(nordChalk.error(String(err)), "ERROR")
    }

    try {
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
      } else if (interaction.isModalSubmit()) {
        execute = command.modal
        type = "Modal"
      }
    } catch (err) {
      console.botLog(nordChalk.error(String(err)), "ERROR")
      return await interaction.reply({ content: `${emojis.crossmark.shorthand} This interaction failed [Unknown Error]`, ephemeral: true })
    }

    process.once("uncaughtException", handleError)
    process.once("unhandledRejection", handleError)

    try {await execute(interaction)}
    catch (err) {handleError(err)}
  }
}