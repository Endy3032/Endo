import axiod from "axiod"
import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import Fuse from "fuse"
import { capitalize, colors, defer, edit, getFocused, getValue, pickArray, respond, shorthand } from "modules"
import { Temporal } from "temporal"
import * as urban from "urban"

export const cmd: ApplicationCommandOption = {
	name: "definition",
	description: "Fetch a definition from dictionaries",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "dictionary",
			description: "The dictionary to use",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Dictionary API", value: "dictapi" },
				{ name: "Urban Dictionary", value: "urban" },
			],
			required: true,
		},
		{
			name: "word",
			description: "The word to fetch the definition",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)
	const dictionary = getValue(interaction, "dictionary", "String")
	const word = getValue(interaction, "word", "String") ?? ""
	if (word == "…") return respond(bot, interaction, "You must specify a word to define.")

	switch (dictionary) {
		case "dictapi": {
			await axiod.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
				.then(response => {
					const { data } = response
					let desc = ""
					data.forEach((entry: { meanings: any[] }) => {
						entry.meanings.forEach(
							(meaning: { partOfSpeech: string; synonyms: any[]; antonyms: any[]; definitions: any[] }) => {
								desc += `\`\`\`${capitalize(meaning.partOfSpeech)}\`\`\``
								desc += meaning.synonyms.length > 0 ? `**Synonyms:** ${meaning.synonyms.join(", ")}\n` : ""
								desc += meaning.antonyms.length > 0 ? `**Antonyms:** ${meaning.antonyms.join(", ")}\n` : ""
								desc += "\n**Meanings:**\n"

								meaning.definitions.forEach(
									(def: { definition: any; synonyms: any[]; antonyms: string | any[]; examples: any[]; example: any },
										ind: number) =>
									{
										desc += `\`[${ind + 1}]\` ${def.definition}\n`
										desc += def.synonyms.length > 0 ? `**• Synonyms:** ${def.synonyms.join(", ")}\n` : ""
										desc += def.antonyms.length > 0 ? `**• Antonyms:** ${def.examples.join(", ")}\n` : ""
										desc += def.example ? `**• Example:** ${def.example}\n` : ""
										desc += "\n"
									},
								)
							},
						)
					})

					const phonetics = [
						...new Set(
							data[0].phonetics.filter((phonetic: { text: any }) => phonetic.text).map((phonetic: { text: any }) => phonetic.text),
						),
					].join(" - ")

					edit(bot, interaction, {
						embeds: [{
							title: `${data[0].word} - ${phonetics ?? "//"}`,
							color: pickArray(colors),
							description: desc,
							footer: { text: "Source: DictionaryAPI.dev & Wiktionary" },
						}],
					})
				})
				.catch(() => edit(bot, interaction, `${shorthand("warn")} The word \`${word}\` was not found in the dictionary`))
			break
		}

		case "urban": {
			await urban.define(word)
				.then(results => {
					const [result] = results.list
					let descriptionBefore = `**Definition(s)**\n${result.definition}`
					const descriptionAfter =
						`\n\n**Example(s)**\n${result.example}\n\n**Ratings** • ${result.thumbs_up} :+1: • ${result.thumbs_down} :-1:`

					if (descriptionBefore.length + descriptionAfter.length > 4096) {
						descriptionBefore = descriptionBefore.slice(0, 4095 - descriptionAfter.length) + "…"
					}

					const description = descriptionBefore + descriptionAfter

					edit(bot, interaction, {
						embeds: [{
							title: word,
							url: result.permalink,
							color: pickArray(colors),
							description,
							author: { name: `Urban Dictionary - ${result.author}` },
							footer: { text: `Definition ID • ${result.defid} | Written on` },
							timestamp: Temporal.Instant.from(result.written_on).epochMilliseconds,
						}],
					})
				})
				.catch(() => edit(bot, interaction, `${shorthand("warn")} The word \`${word}\` was not found in the dictionary`))
			break
		}
	}
}

export async function autocomplete(bot: Bot, interaction: Interaction) {
	const current = getFocused(interaction) ?? ""
	const response: ApplicationCommandOptionChoice[] = []
	const initial = { name: "Keep typing to continue…", value: "…" }
	const filled = { name: current ?? "Keep typing to continue…", value: current ?? "…" }

	const dict = getValue(interaction, "dictionary", "String")
	if (dict == "dictapi") return respond(bot, interaction, { choices: [filled] })

	await urban.autocomplete(current)
		.then(results => {
			const fuse = new Fuse(results, { distance: 5 })
			response.push(...fuse.search(current).map(option => ({ name: option.item, value: option.item })))
			respond(bot, interaction, { choices: response.slice(0, 25) })
		})
}
