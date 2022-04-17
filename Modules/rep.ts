import { CommandInteraction, InteractionReplyOptions, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js"

export default async (interaction: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction, object: InteractionReplyOptions) => {
  if (interaction.isAutocomplete() || !interaction.isRepliable()) return
  try {
    interaction.deferred
      ? interaction.editReply(object)
      : interaction.replied
        ? interaction.followUp(object)
        : interaction.reply(object)
  } catch (err) {
    return console.error(`Can't respond to the interaction\n\`\`\`${(err as Error).stack}\`\`\``)
  }
}
