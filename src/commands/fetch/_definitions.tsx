import { ActionRow, DiscordEmbed } from "discordeno"
import { Embed, Field, Option, SelectMenu } from "jsx"
import { Temporal } from "temporal"

// #region Wiktionary
const definitionToDescription = (definitions: WDefinition[]) =>
	definitions.map((d, i: number) =>
		`${i + 1}. ${d.definition}`
		+ (d.parsedExamples?.map(e =>
			`\n  - ${e.example}`
			+ (e.literally ? `  \n    ┣ **Literally** ${e.literally}` : "")
			+ (e.translation ? `  \n    ╰ ${e.translation}` : "")
		).join("") || "")
	).join("\n")

export function wiktionaryEmbed(word: string, partOfSpeech: string, definitions: WDefinition[] | WLanguage): DiscordEmbed {
	const embed = (
		<Embed
			title={`${word} - ${partOfSpeech}`}
			authorName="Wiktionary"
			authorIcon="https://wiktionary.org/static/apple-touch/wiktionary/en.png"
			authorUrl="https://en.wiktionary.org/"
			url={`https://en.wiktionary.org/wiki/${encodeURI(word)}`}
		>
		</Embed>
	)

	embed.description = definitions instanceof Array
		? definitionToDescription(definitions)
		: Object.entries(definitions).map(([pos, defs]) => `## ${pos}\n${definitionToDescription(defs)}`).join("\n")

	return embed
}

const languageMenu = (word: string, definitions: { [key: string]: WLanguage }, language: string) =>
	Object.entries(definitions).map(([lang, pos], i) => (
		<Option
			label={lang.replace(/ \[.*\]/, "")}
			value={`${lang}_${word}_${Object.keys(pos)[0]}`}
			description={Object.keys(pos).reduce((a, b) => a.length + b.length > 100 ? a : `${a}, ${b}`)}
			default={language ? language === lang : i === 0}
		/>
	))

export function wiktionaryMenus(
	word: string,
	definitions: WResultCache["definitions"],
	language?: string,
	partOfSpeech?: string,
): ActionRow[] {
	const isOther = language && !Object.keys(definitions).includes(language)

	return [
		(
			<SelectMenu customId="language" placeholder="Language">
				{...languageMenu(word, definitions, isOther ? "Other" : language ?? "English [en]")}
			</SelectMenu>
		),
		isOther
			? (
				<SelectMenu customId="sublanguage" placeholder="Other Languages">
					{...languageMenu(word, definitions.Other, language)}
				</SelectMenu>
			)
			: (
				<SelectMenu customId="part" placeholder="Part of Speech">
					{...Object.keys(language ? definitions[language] : Object.values(definitions)[0]).map((pos, i) => (
						<Option
							label={pos}
							value={`${language ?? Object.keys(definitions)[0]}_${word}_${pos}`}
							default={partOfSpeech ? partOfSpeech === pos : i === 0}
						/>
					))}
				</SelectMenu>
			),
	]
}

const replace = new Map([
	[/&amp;?/g, "&"],
	[/&nbsp;?/g, " "],
	[/<\/?br\/?>/g, "\n"],
	[/<i.*?>(.*?)<\/i>/g, "*$1*"],
	[/<b.*?>(.*?)<\/b>/g, "**$1**"],
	[/<s.*?>(.*?)<\/s>/g, "~~$1~~"],
	[/<u.*?>(.*?)<\/u>/g, "__$1__"],
	[/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, "[$2](https://en.wiktionary.org$1)"],
	[/<.*?>/g, ""],
])

export function toMarkdown(value: string | any[] | Record<string, any>) {
	if (value instanceof Array) return value.map(toMarkdown)
	else if (value instanceof Object) {
		for (const key in value) value[key] = toMarkdown(value[key])
		return value
	} else if (typeof value === "string") {
		for (const [regex, replacement] of replace) {
			value = value.replaceAll(regex, (_, group1, group2) =>
				replacement
					.replaceAll("$1", group1.toString().trim())
					.replaceAll("$2", group2.toString().trim()))
		}
		return value
	}

	return value
}

interface WDefinition {
	definition: string
	examples?: string[]
	parsedExamples?: {
		example: string
		translation?: string
		literally?: string
	}[]
}

interface WLanguage {
	[key: string]: WDefinition[]
}

export interface WResult {
	[key: string]: {
		partOfSpeech: string
		language: string
		definitions: WDefinition[]
	}[]
}

export interface WResultCache {
	timestamp: number
	definitions: {
		[key: string]: WLanguage
	} & {
		Other: {
			[key: string]: WLanguage
		}
	}
}
// #endregion

// #region Urban Dictionary
export function urbanEmbed(definition: UrbanDefinition) {
	const defContent = `**Definition(s)**\n${definition.definition}`
		.replaceAll(/\[(.*?)\]/g, (_, p1) => `[${p1}](https://${encodeURI(p1)}.urbanup.com)`)

	const embed: DiscordEmbed = (
		<Embed
			title={definition.word}
			url={definition.permalink}
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

export interface UrbanDefinition {
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

export interface UrbanSearchCache {
	timestamp: number
	definitions: Pick<UrbanDefinition, "word" | "author" | "defid">[]
}
// #endregion
