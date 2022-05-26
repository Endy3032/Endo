import { escapeMarkdown, MessageFlags } from "modules"
import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction, InteractionResponseTypes } from "discordeno"

export const cmd: CreateContextApplicationCommand = {
  name: "Copy Content",
  type: ApplicationCommandTypes.Message,
  description: ""
}

export async function execute(bot: Bot, interaction: Interaction) {
  const message = interaction.data?.resolved?.messages?.array()[0]

  const attachments = message?.attachments.map(attachment => attachment.proxyUrl) ?? []
  const messageContent = escapeMarkdown(message?.content ?? "")
  let content = messageContent.length == 0 ? "**Content**\nNone" : `**Content**\n${messageContent}`
  content += `\n\n**Attachment(s): ${attachments.length}**\n${attachments.map(attachment => `<${attachment}>`).join("\n")}`

  await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: `${content}`,
      flags: MessageFlags.Ephemeral
    }
  })
}
