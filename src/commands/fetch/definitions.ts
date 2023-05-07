import axiod from "axiod"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes } from "discordeno"
import { colors, defaultChoice, defer, edit, getCache, InteractionHandler, pickArray, ReadonlyOption, saveCache,
	shorthand } from "modules"
import { Temporal } from "temporal"
import * as urban from "urban"

export const cmd = {
	name: "definition",
	description: "Fetch a definition from dictionaries",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "dictionary",
			description: "The dictionary to use",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Wiktionary", value: "wiktionary" },
				{ name: "Urban Dictionary", value: "urban" },
			],
			required: true,
		},
		{
			name: "word",
			description: "The search query",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
	],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
	const { dictionary, word } = args
	if (word === "…") return interaction.respond("You must specify a word to define.", { isPrivate: true })

	await defer(bot, interaction)

	switch (dictionary) {
		case "wiktionary": {
			const cache = await getCache(["definitions", "wiktionary"], `${word}.json`)
			let parse: Record<string, any>

			if (cache) parse = JSON.parse(cache)
			else {
				console.log("fetching")
				const { data } = await axiod.get(`https://en.wiktionary.org/w/api.php`, {
					params: {
						action: "parse",
						format: "json",
						pageid: word,
						prop: "sections|wikitext|langlinks",
						disabletoc: 1,
						utf8: 1,
					},
				})

				parse = data.parse
				if (parse === undefined) return interaction.edit("No results found.")
				await saveCache(["definitions", "wiktionary"], `${word}.json`, parse)
			}

			console.log(parse.sections)
			console.log(parse.wikitext["*"])

			// #region wiktionary
			// await axiod.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
			// 	.then(response => {
			// 		const { data } = response
			// 		let desc = ""
			// 		data.forEach((entry: { meanings: any[] }) => {
			// 			entry.meanings.forEach(
			// 				(meaning: { partOfSpeech: string; synonyms: any[]; antonyms: any[]; definitions: any[] }) => {
			// 					desc += `\`\`\`${capitalize(meaning.partOfSpeech)}\`\`\``
			// 					desc += meaning.synonyms.length > 0 ? `**Synonyms:** ${meaning.synonyms.join(", ")}\n` : ""
			// 					desc += meaning.antonyms.length > 0 ? `**Antonyms:** ${meaning.antonyms.join(", ")}\n` : ""
			// 					desc += "\n**Meanings:**\n"

			// 					meaning.definitions.forEach(
			// 						(def: { definition: any; synonyms: any[]; antonyms: string | any[]; examples: any[]; example: any },
			// 							ind: number) =>
			// 						{
			// 							desc += `\`[${ind + 1}]\` ${def.definition}\n`
			// 							desc += def.synonyms.length > 0 ? `**• Synonyms:** ${def.synonyms.join(", ")}\n` : ""
			// 							desc += def.antonyms.length > 0 ? `**• Antonyms:** ${def.examples.join(", ")}\n` : ""
			// 							desc += def.example ? `**• Example:** ${def.example}\n` : ""
			// 							desc += "\n"
			// 						},
			// 					)
			// 				},
			// 			)
			// 		})

			// 		const phonetics = [
			// 			...new Set(
			// 				data[0].phonetics.filter((phonetic: { text: any }) => phonetic.text).map((phonetic: { text: any }) => phonetic.text),
			// 			),
			// 		].join(" - ")

			// 		edit(bot, interaction, {
			// 			embeds: [{
			// 				title: `${data[0].word} - ${phonetics ?? "//"}`,
			// 				color: pickArray(colors),
			// 				description: desc,
			// 				footer: { text: "Source: DictionaryAPI.dev & Wiktionary" },
			// 			}],
			// 		})
			// 	})
			// 	.catch(() => edit(bot, interaction, `${shorthand("warn")} The word \`${word}\` was not found in the dictionary`))
			// #endregion
			break
		}

		case "urban": {
			const cache = await getCache(["definitions", "urban"], `results.json`)
			const cachedResults: Record<string, Pick<UrbanDefinition, "word" | "author" | "defid">[]> = cache ? JSON.parse(cache) : {}

			if (!cachedResults[word]) {
				const { data } = await axiod.get<{ list: UrbanDefinition[] }>("https://api.urbandictionary.com/v0/define", {
					params: { term: word },
				})

				if (data.list.length === 0) return interaction.edit("No results found.")

				cachedResults[word] = data.list.map(def => ({ word: def.word, author: def.author, defid: def.defid }))
				await saveCache(["definitions", "urban"], `results.json`, cachedResults)

				for await (const def of data.list) await saveCache(["definitions", "urban"], `${def.defid}.json`, def)
			}

			const cachedResult = await getCache("definitions/urban", `${cachedResults[word][0].defid}.json`)!
			const result: UrbanDefinition = JSON.parse(cachedResult!)

			
			let descriptionBefore = `**Definition(s)**\n${result.definition}`
			const descriptionAfter =
				`\n\n**Example(s)**\n${result.example}\n\n**Ratings** • ${result.thumbs_up} :+1: • ${result.thumbs_down} :-1:`

			if (descriptionBefore.length + descriptionAfter.length > 4096) {
				descriptionBefore = descriptionBefore.slice(0, 4095 - descriptionAfter.length) + "…"
			}

			const description = descriptionBefore + descriptionAfter

			await interaction.edit({
				embeds: [bot.transformers.reverse.embed(bot, {
					title: word,
					url: result.permalink,
					color: pickArray(colors),
					description,
					author: { name: `Urban Dictionary - ${result.author}` },
					footer: { text: `Definition ID • ${result.defid} | Written on` },
					timestamp: Temporal.Instant.from(result.written_on).epochMilliseconds,
				})],
			})
		}
	}
}

export const autocomplete: InteractionHandler<typeof cmd.options> = async (_bot, interaction, args) => {
	const { dictionary } = args,
		value = args.focused.value?.toString() ?? "",
		response: ApplicationCommandOptionChoice[] = []

	if (value?.length === 0) return interaction.respond(defaultChoice("KeepTyping"))

	switch (dictionary) {
		case "wiktionary": {
			const { data: { query } } = await axiod.get<WiktionarySearch>(`https://en.wiktionary.org/w/api.php`, {
				params: {
					action: "query",
					list: "search",
					srsearch: value,
					format: "json",
					srlimit: 25,
					srprop: "",
					utf8: 1,
				},
			})

			if (!query || query.search.length === 0) return interaction.respond(defaultChoice("NoResults"))
			response.push(...query.search.map(result => ({ name: result.title, value: result.pageid.toString() })))
			return interaction.respond({ choices: response.slice(0, 25) })
		}

		case "urban": {
			const { data: results } = await axiod.get<string[]>("https://api.urbandictionary.com/v0/autocomplete", {
				params: { term: value },
			})

			if (!results || results.length === 0) return interaction.respond(defaultChoice("NoResults"))
			response.push(...results.map(option => ({ name: option, value: option })))
			return interaction.respond({ choices: response.slice(0, 25) })
		}
	}
}

type WiktionarySearch = {
	query: {
		searchinfo: { totalhits: number }
		search: { ns: number; title: string; pageid: number }[]
	}
}

type UrbanDefinition = {
	word: string
	author: string
	definition: string
	example: string
	thumbs_up: number
	thumbs_down: number
	current_vote: string
	defid: number
	permalink: string
	written_on: string
}
