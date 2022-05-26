import { emojis, MessageFlags } from "modules"
import { ApplicationCommandTypes, Bot, Interaction, InteractionResponseTypes } from "discordeno"

export const cmd = {
  name: "Delete Direct Message",
  description: "",
  type: ApplicationCommandTypes.Message
}

export async function execute(bot: Bot, interaction: Interaction) {
  if (interaction.guildId) return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: `${emojis.warn.shorthand} This command can only be used in my DM.`,
      flags: MessageFlags.Ephemeral
    }
  })

  const message = interaction.data?.resolved?.messages?.array()[0]
  if (message?.authorId != bot.id) return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: `${emojis.warn.shorthand} This command can only be used on my messages.`,
      flags: MessageFlags.Ephemeral
    }
  })

  const channel = await bot.helpers.getDmChannel(interaction.user.id)
  await bot.helpers.deleteMessage(channel.id, message.id)
  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: `${emojis.success.shorthand} Deleted the message!`,
      flags: MessageFlags.Ephemeral
    }
  })
}
