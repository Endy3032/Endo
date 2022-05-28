import { rgb24 } from "colors"
import { Nord } from "./types.ts"
import { emojis } from "./emojis.ts"
import { permissions } from "./permissions.ts"
import { respond } from "./respondInteraction.ts"
import { BitwisePermissionFlags, Bot, Interaction } from "discordeno"
import { getCmdName, getSubcmdGroup, getSubcmd } from "./getInteractionData.ts"

export const checkPermission = (bot: Bot, interaction: Interaction, ...perms: BitwisePermissionFlags[]) => {
  if (!interaction.guildId) {
    respond(bot, interaction, {
      content: `${emojis.warn.shorthand} This command can only be used in servers.`
    }, true)
    return true
  }
  const memberPermission = interaction.member?.permissions ?? 0n
  let block = false
  let consoleLog = `${rgb24("Permissions", Nord.yellow)} [`
  let repContent = `Permissions needed to use \`/${[getCmdName(interaction), getSubcmdGroup(interaction), getSubcmd(interaction)].join(" ").replaceAll("  ", " ")}\`:`
  perms.forEach(permission => {
    const perm = BigInt(permission)
    const permName = permissions[permission.toString()]
    const hasPerm = (memberPermission & perm) === perm
    if (!hasPerm) block = true

    consoleLog += ` ${hasPerm ? rgb24(permName, Nord.green) : rgb24(permName, Nord.red)},`
    repContent += `\n${hasPerm ? emojis.success.shorthand : emojis.error.shorthand} \`${permName}\``
  })

  if (block) {
    console.botLog(`${consoleLog.slice(0, -1)} ]`, "WARN")
    respond(bot, interaction, { content: repContent }, true)
  }
  return block
}
