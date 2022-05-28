import { emojis, respond } from "modules"
import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction } from "discordeno"

export const cmd: CreateContextApplicationCommand = {
  name: "Delete Direct Message",
  description: "",
  type: ApplicationCommandTypes.Message,
  defaultMemberPermissions: ["USE_SLASH_COMMANDS"]
}

export async function execute(bot: Bot, interaction: Interaction) {
  if (interaction.guildId) return await respond(bot, interaction, {
    content: `${emojis.warn.shorthand} This command can only be used in my DM.`,
  }, true)

  const message = interaction.data?.resolved?.messages?.array()[0]
  if (message?.authorId != bot.id) return await respond(bot, interaction, {
    content: `${emojis.warn.shorthand} This command can only be used on my messages.`,
  }, true)

  const channel = await bot.helpers.getDmChannel(interaction.user.id)
  await bot.helpers.deleteMessage(channel.id, message.id)
  await respond(bot, interaction, {
    content: `${emojis.success.shorthand} Deleted the message!`,
  }, true)
}
