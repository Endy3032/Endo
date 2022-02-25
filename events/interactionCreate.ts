import os from "os"
import dotenv from "dotenv"
import log from "../index"
import { emojis, rep } from "../other/misc"
dotenv.config()

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if ((os.hostname().includes("local") && interaction.guildId !== process.env.GUILD) || (interaction.guildId == process.env.GUILD && !os.hostname().includes("local"))) {
      return
    }

    const commandName =
    interaction.isChatInputCommand() || interaction.isAutocomplete() ? interaction.commandName
      : interaction.isButton() || interaction.isSelectMenu() ? interaction.message.interaction.commandName || interaction.message.interaction.name
        : interaction.isContextMenuCommand() ? interaction.commandName.replace("[G] ", "")
          : null

    if (!interaction.isAutocomplete()) {
      let message = `[${interaction.user.tag} - `
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

      log(message)
    }

    const command = interaction.client.commands.get(commandName)

    if (interaction.isChatInputCommand()) {
      var execute = command.execute
      var type = "Command"
    } else if (interaction.isButton()) {
      var execute = command.button
      var type = "Button"
    } else if (interaction.isSelectMenu()) {
      var execute = command.selectMenu
      var type = "Select"
    } else if (interaction.isContextMenuCommand()) {
      var execute = command.ctxMenu
      var type = "CtxMenu"
    } else if (interaction.isAutocomplete()) {
      var execute = command.autocomplete
      var type = "Autocomplete"
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