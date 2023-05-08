import axiod from "axiod"
import { ActionRow, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, delay, type Embed as EmbedObj,
	SelectMenuComponent } from "discordeno"
import { Button, Embed, Field, Row } from "jsx"
import { AutocompleteHandler, ButtonHandler, colors, defaultChoice, defer, getCache, InspectConfig, InteractionHandler, pickArray,
	ReadonlyOption, saveCache, SelectHandler, TimeMetric } from "modules"
import { Temporal } from "temporal"
import { Option, SelectMenu } from "../../jsx/menu.ts"

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

			await interaction.edit("Wiktionary coming later")

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
			const cachedResults: Record<string, CachedUrbanResults> = cache ? JSON.parse(cache) : {}

			if (!cachedResults[word] || cachedResults[word].timestamp < Temporal.Now.instant().epochMilliseconds - 14 * TimeMetric.sec_day) {
				const { data } = await axiod.get<{ list: UrbanDefinition[] }>(
					"https://api.urbandictionary.com/v0/define",
					{ params: { term: word } },
				)

				if (data.list.length === 0) return interaction.edit("No results found.")

				cachedResults[word] = {
					timestamp: Temporal.Now.instant().epochMilliseconds,
					definitions: data.list.map(def => ({ word: def.word, author: def.author, defid: def.defid })),
				}
				await saveCache(["definitions", "urban"], `results.json`, cachedResults)

				for await (const def of data.list) await saveCache(["definitions", "urban"], `${def.defid}.json`, def)
			}

			const cachedDefs = await getCache("definitions/urban", `${cachedResults[word].definitions[0].defid}.json`)!
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
				embeds: [bot.transformers.reverse.embed(bot, urbanEmbed(definition))],
				components,
			})
		}
	}
}

export const select: SelectHandler = async (bot, interaction, args) => {
	await interaction.defer()

	const row = interaction.message!.components[0] as ActionRow
	const menu = row.components[0] as SelectMenuComponent

	const cachedDefs = await getCache("definitions/urban", `${args.values[0]}.json`)!
	const definition: UrbanDefinition = JSON.parse(cachedDefs!)

	await interaction.edit({
		embeds: [bot.transformers.reverse.embed(bot, urbanEmbed(definition))],
		components: [<Row>{menu}</Row>],
	})
}

export const autocomplete: AutocompleteHandler<typeof cmd.options> = async (_bot, interaction, args) => {
	const { dictionary } = args,
		value = args.focused.value?.toString() ?? "",
		response: ApplicationCommandOptionChoice[] = []

	if (!dictionary) return interaction.respond(defaultChoice("Choose a dictionary first"))
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

function urbanEmbed(definition: UrbanDefinition) {
	const defContent = `**Definition(s)**\n${definition.definition}`
		.replaceAll(/\[(.*?)\]/g, (_, p1) => `[${p1}](https://${encodeURI(p1)}.urbanup.com)`)

	const embed: EmbedObj = (
		<Embed
			title={definition.word}
			url={definition.permalink}
			color={pickArray(colors)}
			description={defContent.length > 4096 ? defContent.slice(0, 4095) + "…" : defContent}
			authorName={`Urban Dictionary | ${definition.author}`}
			footerText={`ID: ${definition.defid} | Written on`}
			timestamp={Temporal.Instant.from(definition.written_on).epochMilliseconds}
		>
			<Field
				name="Examples"
				value={definition.example.replaceAll(/\[(.*?)\]/g, (_, p1) => `[${p1}](https://${encodeURI(p1)}.urbanup.com)`)}
				inline
			/>
			<Field name="Ratings" value={`${definition.thumbs_up} :+1: / ${definition.thumbs_down} :-1:`} inline />
		</Embed>
	)

	return embed
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

type CachedUrbanResults = {
	timestamp: number
	definitions: Pick<UrbanDefinition, "word" | "author" | "defid">[]
}
