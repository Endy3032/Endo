import { rgb24 } from "colors"
import { emojis } from "./emojis.ts"
import { permissions } from "./permissions.ts"
import { Nord, MessageFlags } from "./types.ts"
import { Bot, Interaction, InteractionResponseTypes } from "discordeno"
import { getCmdName, getSubcmdGroup, getSubcmd } from "./getInteractionData.ts"

export const checkPermission = async (bot: Bot, interaction: Interaction, ...perms: bigint[]) => {
  if (!interaction.guildId) {
    await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: `${emojis.warn.shorthand} This command can only be used in servers.`,
        flags: MessageFlags.Ephemeral
      }
    })
    return true
  }
  const memberPermission = interaction.member?.permissions ?? 0n
  let block = false
  let consoleLog = `${rgb24("Permissions", Nord.yellow)} [`
  let repContent = `Permissions needed to use \`${getCmdName(interaction)}/${getSubcmdGroup(interaction) || "_"}/${getSubcmd(interaction) || "_"}\`:`
  perms.forEach(permission => {
    const permName = permissions[permission.toString()]
    const hasPerm = (memberPermission & permission) === permission
    if (!hasPerm) block = true

    consoleLog += ` ${hasPerm ? rgb24(permName, Nord.green) : rgb24(permName, Nord.red)},`
    repContent += `\n${hasPerm ? emojis.success.shorthand : emojis.error.shorthand} \`${permName}\``
  })

  if (block) {
    console.botLog(`${consoleLog.slice(0, -1)} ]`, "WARN")
    await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: repContent,
        flags: MessageFlags.Ephemeral
      }
    })
  }
  return block
}
