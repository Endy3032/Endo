import axiod from "axiod"
import { ActionRow, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, SelectMenuComponent } from "discordeno"
import { Option, SelectMenu } from "jsx"
import { AutocompleteHandler, defaultChoice, getCache, InteractionHandler, ReadonlyOption, saveCache, SelectHandler,
	TimeMetric } from "modules"
import { Temporal } from "temporal"
import { toMarkdown, UrbanDefinition, urbanEmbed, UrbanSearchCache, wiktionaryEmbed, wiktionaryMenus, WRestSearch, WResult,
	WResultCache } from "./_definitions.tsx"

export const cmd = {
	name: "definition",
	description: "Fetch dictionary definitions",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "dictionary",
			description: "Dictionary source",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Wiktionary", value: "wiktionary" },
				{ name: "Urban Dictionary", value: "urban" },
			],
			required: true,
		},
		{
			name: "word",
			description: "Search query",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
	],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (_, interaction, args) => {
	const { dictionary, word } = args
	if (word === "…") return interaction.respond("Specify a word to define", { isPrivate: true })

	await interaction.defer()

	switch (dictionary) {
		case "wiktionary": {
			const cache = await getCache(["definitions", "wiktionary"], `${word}.json`)
			let def: WResultCache = cache ? JSON.parse(cache) : undefined

			if (!def || def.timestamp < Temporal.Now.instant().epochSeconds - 7 * TimeMetric.sec_day) {
				const { data } = await axiod.get<WResult>(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`)
				if (data === undefined) return interaction.edit("No results found")

				const cache: Partial<WResultCache> = {}
				for (const [langCode, def] of Object.entries(data)) {
					if (langCode === "other") {
						cache["Other"] = def.reduce((acc, cur) => {
							if (!acc[cur.language]) acc[cur.language] = {}
							if (!acc[cur.language][cur.partOfSpeech]) acc[cur.language][cur.partOfSpeech] = []
							acc[cur.language][cur.partOfSpeech].push(...cur.definitions)
							return acc
						}, {})
						continue
					}

					cache[`${def[0].language} [${langCode}]`] = def.reduce((acc, cur) => {
						if (!acc[cur.partOfSpeech]) acc[cur.partOfSpeech] = []
						acc[cur.partOfSpeech].push(...cur.definitions)
						return acc
					}, {})
				}

				def = {
					timestamp: Temporal.Now.instant().epochMilliseconds,
					definitions: toMarkdown(cache),
				}
				await saveCache(["definitions", "wiktionary"], `${word}.json`, def)
			}

			const [part, definition] = Object.entries(Object.values(def.definitions)[0])[0]
			await interaction.edit({ components: wiktionaryMenus(word, def.definitions), embeds: [wiktionaryEmbed(word, part, definition)] })
			break
		}

		case "urban": {
			const cache = await getCache(["definitions", "urban"], `results.json`)
			const cachedResults: Record<string, UrbanSearchCache> = cache ? JSON.parse(cache) : {}

			if (!cachedResults[word] || cachedResults[word].timestamp < Temporal.Now.instant().epochSeconds - 14 * TimeMetric.sec_day) {
				const { data } = await axiod.get<{ list: UrbanDefinition[] }>(
					"https://api.urbandictionary.com/v0/define",
					{ params: { term: word } },
				)

				if (data.list.length === 0) return interaction.edit("No results found.")

				cachedResults[word] = {
					timestamp: Temporal.Now.instant().epochSeconds,
					definitions: data.list.map(def => ({ word: def.word, author: def.author, defid: def.defid })),
				}
				await saveCache(["definitions", "urban"], `results.json`, cachedResults)

				for await (const def of data.list) await saveCache(["definitions", "urban"], `${def.defid}.json`, def)
			}

			const cachedDefs = await getCache(["definitions", "urban"], `${cachedResults[word].definitions[0].defid}.json`)!
			const definition: UrbanDefinition = JSON.parse(cachedDefs!)

			const components: ActionRow[] = [
				<SelectMenu customId="result" placeholder={`${cachedResults[word].definitions.length} results found`}>
					{...cachedResults[word].definitions.map(def => (
						<Option
							label={def.word}
							description={def.author}
							value={def.defid.toString()}
						/>
					))}
				</SelectMenu>,
			]

			await interaction.edit({
				embeds: [urbanEmbed(definition)],
				components,
			})
		}
	}
}

export const select: SelectHandler = async (bot, interaction, args) => {
	// await interaction.defer()

	const rows = interaction.message!.components as ActionRow[]
	const partSelect = rows[1].components[0] as SelectMenuComponent

	switch (args.customId) {
		case "result": {
			const cachedDefs = await getCache(["definitions", "urban"], `${args.values[0]}.json`)!
			const definition: UrbanDefinition = JSON.parse(cachedDefs!)

			await interaction.edit({
				embeds: [urbanEmbed(definition)],
			})
			break
		}

		default: {
			const values = args.values[0].split("_")
			const [lang, word] = values

			const cache = await getCache(["definitions", "wiktionary"], `${word}.json`)
			const defs: WResultCache = JSON.parse(cache!)

			const def = defs.definitions.Other[lang] ?? defs.definitions[lang]

			const [part, definition] = args.customId === "part" ? [values[2], def?.[values[2]]] : Object.entries(def)[0]

			await interaction.edit({
				embeds: [wiktionaryEmbed(word, part, definition)],
				components: wiktionaryMenus(word, defs.definitions, lang, part),
			})
			break
		}
	}
}

export const autocomplete: AutocompleteHandler<typeof cmd.options> = async (_bot, interaction, args) => {
	const { dictionary } = args,
		value = args.focused.value?.toString() ?? "",
		response: ApplicationCommandOptionChoice[] = []

	if (!dictionary) return interaction.respond(defaultChoice("Choose a dictionary source first"))
	if (value?.length === 0) return interaction.respond(defaultChoice("KeepTyping"))

	switch (dictionary) {
		case "wiktionary": {
			const { data: { pages } } = await axiod.get<WRestSearch>("https://en.wiktionary.org/w/rest.php/v1/search/title", {
				params: {
					q: value,
					limit: 25,
				},
			})

			if (!pages || pages.length === 0) return interaction.respond(defaultChoice("NoResults"))
			response.push(...pages.map(result => ({ name: result.title, value: result.key })))
			break
		}

		case "urban": {
			const { data: results } = await axiod.get<string[]>("https://api.urbandictionary.com/v0/autocomplete", {
				params: { term: value },
			})

			if (!results || results.length === 0) return interaction.respond(defaultChoice("NoResults"))
			response.push(...results.map(option => ({ name: option, value: option })))
			break
		}
	}

	await interaction.respond({ choices: response.slice(0, 25) })
}
