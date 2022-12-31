import { Bot, Interaction, InteractionCallbackData, InteractionResponseTypes, InteractionTypes } from "discordeno"
import { shorthand } from "./emojis.ts"
import { MessageFlags } from "./types.ts"

export async function respond(bot: Bot, interaction: Interaction, response: InteractionCallbackData | string, ephemeral = false) {
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

	return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, { type, data }).catch(err => console.botLog(err, "ERROR"))
}

export async function edit(bot: Bot, interaction: Interaction, response: InteractionCallbackData | string) {
	if (interaction.type == InteractionTypes.ApplicationCommandAutocomplete) {
		return await bot.helpers.editOriginalInteractionResponse(interaction.token, typeof response === "string" ? { content: response } : response)
			.catch(err => console.botLog(err, "ERROR"))
	}
}

export async function defer(bot: Bot, interaction: Interaction, ephemeral = false) {
	if (interaction.type == InteractionTypes.ApplicationCommandAutocomplete) throw new Error("Cannot defer an autocomplete interaction.")

	const responseType = [InteractionTypes.ApplicationCommand, InteractionTypes.ModalSubmit].includes(interaction.type)
		? InteractionResponseTypes.DeferredChannelMessageWithSource
		: InteractionResponseTypes.DeferredUpdateMessage

	return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
		type: responseType,
		data: { flags: ephemeral ? MessageFlags.Ephemeral : undefined },
	}).catch(err => console.botLog(err, "ERROR"))
}

export async function error(bot: Bot, interaction: Interaction, err: Error, type?: string, isEdit = false) {
	const content = `${shorthand("error")} This interaction failed [${type || "Unknown"}]\`\`\`\n${err.name}: ${err.message}\n\`\`\``
	if (isEdit) await edit(bot, interaction, content)
	else await respond(bot, interaction, content, true)
	console.botLog(err, "ERROR")
}
