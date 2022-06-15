import { emojis } from "./emojis.ts"
import { MessageFlags } from "./types.ts"
import { Bot, Interaction, InteractionApplicationCommandCallbackData, InteractionResponseTypes, InteractionTypes } from "discordeno"

export async function respond(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData | string, ephemeral = false) {
  let type = InteractionResponseTypes.ChannelMessageWithSource
  const data = typeof response === "string" ? { content: response } : response

  if (typeof response != "string") {
    type = response.title
      ? InteractionResponseTypes.Modal
      : interaction.type == InteractionTypes.ApplicationCommandAutocomplete && response.choices
        ? InteractionResponseTypes.ApplicationCommandAutocompleteResult
        : InteractionResponseTypes.ChannelMessageWithSource
  }

  if (ephemeral) data.flags = MessageFlags.Ephemeral

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, { type, data }).catch(err => console.botLog(err, "ERROR"))
}

export async function update(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData) {
  if (![InteractionTypes.MessageComponent, InteractionTypes.ModalSubmit].includes(interaction.type)) throw new Error("Interaction is not a message component interaction.")

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.UpdateMessage,
    data: response,
  }).catch(err => console.botLog(err, "ERROR"))
}

export async function defer(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData, ephemeral = false) {
  if (interaction.type == InteractionTypes.ApplicationCommandAutocomplete) throw new Error("Cannot defer an autocomplete interaction.")

  const responseType = interaction.type == InteractionTypes.ApplicationCommand
    ? InteractionResponseTypes.DeferredChannelMessageWithSource
    : InteractionResponseTypes.DeferredUpdateMessage

  if (ephemeral) response.flags = MessageFlags.Ephemeral

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: responseType,
    data: response,
  }).catch(err => console.botLog(err, "ERROR"))
}

export async function error(bot: Bot, interaction: Interaction, err: Error, type?: string) {
  const content = `${emojis.error.shorthand} This interaction failed [${type || "Unknown"}]\`\`\`\n${err.name}: ${err.message}\n\`\`\``
  await respond(bot, interaction, content, true)
  console.botLog(content, "ERROR")
}
