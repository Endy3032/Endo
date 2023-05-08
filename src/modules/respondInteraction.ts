// TODO Fix file for api changes
import { stripIndents } from "commonTags"
import { Bot, Interaction, InteractionCallbackData, InteractionResponseTypes, InteractionTypes } from "discordeno"
import { MessageFlags } from "./exports.ts"

export async function respond(bot: Bot, interaction: Interaction, response: InteractionCallbackData | string, ephemeral = false) {
	let type = InteractionResponseTypes.ChannelMessageWithSource

	if (typeof response !== "string") {
		type = response.title
			? InteractionResponseTypes.Modal
			: interaction.type === InteractionTypes.ApplicationCommandAutocomplete
			? InteractionResponseTypes.ApplicationCommandAutocompleteResult
			: InteractionResponseTypes.ChannelMessageWithSource
	}

	const data = typeof response === "string" ? { content: response } : response
	// if (ephemeral) data.flags = MessageFlags.Ephemeral

	await interaction.respond(data, { isPrivate: ephemeral })
		.catch(err => console.botLog(err, { logLevel: "ERROR" }))
}

export async function edit(bot: Bot, interaction: Interaction, response: InteractionCallbackData | string) {
	if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) throw new Error("Cannot edit autocomplete interactions")

	const data = typeof response === "string" ? { content: response } : response
	await bot.rest.editOriginalInteractionResponse(interaction.token, data)
		.catch(err => console.botLog(err, { logLevel: "ERROR" }))
}

export async function defer(bot: Bot, interaction: Interaction, ephemeral = false) {
	if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) throw new Error("Cannot defer autocomplete interactions")

	const type = interaction.type === InteractionTypes.MessageComponent
		? InteractionResponseTypes.DeferredUpdateMessage
		: InteractionResponseTypes.DeferredChannelMessageWithSource

	await interaction.defer(ephemeral).catch(err => console.botLog(err, { logLevel: "ERROR" }))
}

export async function error(bot: Bot, interaction: Interaction, err: Error, options: { type?: string; isEdit?: boolean }) {
	const { isEdit, type } = Object.assign(options, { type: "Unknown" })

	const content = stripIndents`This \`${InteractionTypes[interaction.type]}\` interaction failed [${type}]
	\`\`\`ts
	${err.name}: ${err.message}
	\`\`\``

	await console.botLog(err)
	isEdit ? edit(bot, interaction, content) : respond(bot, interaction, content, true)
}

enum Choices {
	KeepTyping = "Keep typing to search...",
	NoResults = "No results found.",
}

export const defaultChoice = (message: keyof typeof Choices | string, value = "…") =>
	({
		choices: [{ name: Choices[message] ?? message, value }],
	}) as InteractionCallbackData
