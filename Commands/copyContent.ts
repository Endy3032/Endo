import { escapeMarkdown, respond } from "modules"
import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction } from "discordeno"

export const cmd: CreateContextApplicationCommand = {
  name: "Copy Content",
  type: ApplicationCommandTypes.Message,
  description: "",
  defaultMemberPermissions: ["USE_SLASH_COMMANDS"]
}

export async function execute(bot: Bot, interaction: Interaction) {
  const message = interaction.data?.resolved?.messages?.array()[0]

  const attachments = message?.attachments.map(attachment => attachment.proxyUrl) ?? []
  const messageContent = escapeMarkdown(message?.content ?? "")
  let content = messageContent.length == 0 ? "**Content**\nNone" : `**Content**\n${messageContent}`
  content += `\n\n**Attachment(s): ${attachments.length}**\n${attachments.map(attachment => `<${attachment}>`).join("\n")}`

  await respond(bot, interaction, `${content}`, true)
}
