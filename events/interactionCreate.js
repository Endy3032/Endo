const os = require("os")
const dotenv = require("dotenv")
const index = require("../index.js")
const { emojis, nordChalk, rep } = require("../other/misc.js")
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
      message = nordChalk.bright.cyan(`[${interaction.user.tag} | ${interaction.guildId ? `${interaction.guild.name}#${interaction.channel.name}` : "DM"}] `)

      message +=
      interaction.isChatInputCommand() && interaction.options._group ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._group}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() && interaction.options._subcommand ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() || interaction.isContextMenuCommand() ? `Triggered ${nordChalk.bright.cyan(`[${commandName}]`)}`
      : interaction.isSelectMenu() ? `Selected ${nordChalk.bright.cyan(`[${commandName}/${interaction.values[0]}]`)}`
      : interaction.isButton() ? `Pushed ${nordChalk.bright.cyan(`[${commandName}/${interaction.customId}]`)}`
      : index.log(`${interaction}\nThis interaction type hasn't been logged yet. <@554680253876928512>`)

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
      index.log(err, "ERROR")
      // try {
      //   const msg = await interaction.fetchReply()
      //   console.log(msg.content)
      // } catch {
      //   console.log("Unable to fetch response")
      // }
    }

    process.once("unhandledRejection", (err) => {
      index.log(nordChalk.error(`Unhandled Rejection - ${String(err).replaceAll("\n", nordChalk.blue("\n                             | "))}`), "ERROR")
      rep(interaction, { content: `${emojis.crossmark.shorthand} This interaction failed [${type} Error]`, ephemeral: true })
    })
  }
}