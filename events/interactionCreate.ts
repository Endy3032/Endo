import os from "os"
import "dotenv/config"
import stripAnsi from "strip-ansi"
import { emojis, nordChalk, rep } from "../modules"
import { Interaction, BaseGuildTextChannel, MessageComponentInteraction } from "discord.js"

module.exports = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    const isLocal = os.hostname().includes("local")
    const isTestGuild = interaction.guildId == process.env.TestGuild
    const isReplitTest = interaction.channelId == process.env.TestChannel
    if ((isLocal && (!isTestGuild || isReplitTest)) || (!isLocal && isTestGuild && !isReplitTest)) return

    const commandName: never =
    interaction.isChatInputCommand() || interaction.isAutocomplete() ? interaction.commandName
    : interaction.isButton() || interaction.isSelectMenu() || interaction.isModalSubmit() ? (interaction as MessageComponentInteraction).message.interaction.commandName
    : interaction.isContextMenuCommand() ? interaction.commandName.replace("[D] ", "")
    : null

    if (!interaction.isAutocomplete()) {
      const author = nordChalk.bright.cyan(`[${interaction.user.tag} | ${`${interaction.guild?.name}#${(interaction.channel as BaseGuildTextChannel).name}` || "DM"}] `)

      const intLog =
      interaction.isChatInputCommand() && interaction.options._group ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._group}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() && interaction.options._subcommand ? `Triggered ${nordChalk.bright.cyan(`[${commandName}/${interaction.options._subcommand}]`)}`
      : interaction.isChatInputCommand() || interaction.isContextMenuCommand() ? `Triggered ${nordChalk.bright.cyan(`[${commandName}]`)}`
      : interaction.isButton() ? `Pushed ${nordChalk.bright.cyan(`[${commandName}/${interaction.customId}]`)}`
      : interaction.isSelectMenu() ? `Selected ${nordChalk.bright.cyan(`[${commandName}/[${interaction.values.join("|")}]]`)}`
      : interaction.isModalSubmit() ? `Submitted ${nordChalk.bright.cyan(`[${commandName}/${interaction.customId}]`)}`
      : "Unknown Interaction"

      const discordTimestamp = Math.floor(interaction.createdTimestamp / 1000)
      const embed = {
        description: stripAnsi(`**Epoch** • ${discordTimestamp}\n**Interaction** • ${intLog}`),
        author: { name: interaction.user.tag, icon_url: interaction.user.avatarURL() },
        footer: { text: interaction.guild ? `${interaction.guild.name} #${interaction.channel.name}` : "**DM**", icon_url: interaction.guild.iconURL() },
        timestamp: new Date(interaction.createdTimestamp).toISOString()
      }

      console.botLog(author + intLog, "INFO", embed)
    }

    const command = interaction.client.commands.get(commandName)
    console.log(typeof command)

    const handleError = (err: Error, type: string) => {
      try {rep(interaction, { content: `${emojis.error.shorthand} This interaction failed [${type} Error]`, ephemeral: true })}
      catch {rep(interaction, { content: `${emojis.error.shorthand} This interaction failed [Unknown Error]`, ephemeral: true })}
      console.botLog(nordChalk.error(err.stack), "ERROR")
    }

    let execute: any
    let type: string
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
    } catch (err: any) {
      console.botLog(nordChalk.error(err.stack), "ERROR")
      return await interaction.reply({ content: `${emojis.error.shorthand} This interaction failed [Unknown Error]`, ephemeral: true })
    }

    try {await execute(interaction)}
    catch (err) {return handleError(err, type)}

    process.once("uncaughtException", handleError)
    process.once("unhandledRejection", handleError)
  }
}