import { MessageFlags } from "./types.ts"
import { Bot, Interaction, InteractionApplicationCommandCallbackData, InteractionResponseTypes, InteractionTypes } from "discordeno"

export async function respond(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData, ephemeral = false) {
  const responseType =
    interaction.type == InteractionTypes.ModalSubmit
      ? InteractionResponseTypes.Modal
      : interaction.type == InteractionTypes.ApplicationCommandAutocomplete
        ? InteractionResponseTypes.ApplicationCommandAutocompleteResult
        : InteractionResponseTypes.ChannelMessageWithSource

  if (ephemeral) response.flags = MessageFlags.Ephemeral

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: responseType,
    data: response
  })
}

export async function update(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData) {
  if (![InteractionTypes.MessageComponent, InteractionTypes.ModalSubmit].includes(interaction.type))
    throw new Error("Interaction is not a message component interaction.")

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.UpdateMessage,
    data: response
  })
}

export async function defer(bot: Bot, interaction: Interaction, response: InteractionApplicationCommandCallbackData, ephemeral = false) {
  if (interaction.type == InteractionTypes.ApplicationCommandAutocomplete)
    throw new Error("Cannot defer an autocomplete interaction.")

  const responseType =
    interaction.type == InteractionTypes.ApplicationCommand
      ? InteractionResponseTypes.DeferredChannelMessageWithSource
      : InteractionResponseTypes.DeferredUpdateMessage

  if (ephemeral) response.flags = MessageFlags.Ephemeral

  return bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: responseType,
    data: response
  })
}
