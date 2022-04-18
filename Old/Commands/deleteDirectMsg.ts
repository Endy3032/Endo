import { emojis } from "../Modules"
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from "discord.js"

export const cmd = {
  name: "Delete DM message",
  description: "",
  type: ApplicationCommandType.Message
}

export async function ctxMenu(interaction: MessageContextMenuCommandInteraction) {
  if (interaction.guild) return await interaction.reply({ content: `${emojis.warn.shorthand} This command can only be used in my DM.`, ephemeral: true })
  if (interaction.targetMessage.author.id != interaction.client.user?.id) return await interaction.reply({ content: `${emojis.warn.shorthand} This command can only be used on my messages.`, ephemeral: true })

  const channel = await interaction.user.createDM()
  const msg = await channel.messages.fetch(interaction.targetMessage.id)
  await msg.delete()
  await interaction.reply({ content: "Deleted the message!", ephemeral: true })
}
