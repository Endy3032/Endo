import axiod from "axiod"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, InteractionCallbackData } from "discordeno"
import { Embed, Field, Option, SelectMenu } from "jsx"
import { AutocompleteHandler, capitalize, defaultChoice, InteractionHandler, ReadonlyOption, saveCache, SelectHandler } from "modules"
import { Temporal } from "temporal"
import wtf from "wtf_wiki"
import { getCache } from "../../modules/cache.ts"
import { shorthand } from "../../modules/emojis.ts"
import { WikiRestSearch } from "./_common.ts"

export const cmd = {
	name: "wikipedia",
	description: "Fetch a Wikipedia article",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "query",
			description: "The query to search for",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
	],
} as const satisfies ReadonlyOption

const excludedInfobox = ["title", "logo", "image", "image_size", "alt", "caption", "platforms", "released", "subsid"]

export const main: InteractionHandler<typeof cmd.options> = async (_, interaction, args) => {
	await interaction.defer()
	const { query } = args

	const cache = await getCache("wikipedia", `${query}.json`)
	let response: InteractionCallbackData = cache ? JSON.parse(cache) : undefined

	if (!cache || Temporal.Now.instant().until(Temporal.Instant.from(response?.embeds!.at(-1)!.timestamp!)).days >= 7) {
		await interaction.edit(`${shorthand("loading")} Fetching and caching article...`)
		response = await refreshCache(query)
	}

	await interaction.edit({ ...response, content: "" })
}

export const select: SelectHandler = async (bot, interaction, args) => {
	await interaction.defer()
	const [query] = args.values

	const cache = await getCache("wikipedia", `${query}.json`)
	let response: InteractionCallbackData = cache ? JSON.parse(cache) : undefined

	if (!cache || Temporal.Now.instant().until(Temporal.Instant.from(response?.embeds!.at(-1)!.timestamp!)).days >= 7) {
		await interaction.edit({ content: `${shorthand("loading")} Fetching and caching article...`, embeds: [] })
		response = await refreshCache(query)
	}

	await interaction.edit({ embeds: response.embeds, content: "" })
}

export const autocomplete: AutocompleteHandler<typeof cmd.options> = async (_, interaction, args) => {
	const value = args.focused.value?.toString() ?? "",
		response: ApplicationCommandOptionChoice[] = []

	if (value?.length === 0) return interaction.respond(defaultChoice("KeepTyping"))

	const { data: { pages } } = await axiod.get<WikiRestSearch>("https://en.wikipedia.org/w/rest.php/v1/search/title", {
		params: {
			q: value,
			limit: 25,
		},
	})

	if (!pages || pages.length === 0) return interaction.respond(defaultChoice("NoResults"))
	response.push(...pages.map(result => ({ name: result.title, value: result.id.toString() })))

	return interaction.respond({ choices: response.slice(0, 25) })
}

const refreshCache = async (query: string): Promise<InteractionCallbackData> => {
	const { data } = await axiod.get<WikiQueryPageInfo>("https://en.wikipedia.org/w/api.php", {
		params: {
			action: "query",
			format: "json",
			prop: "description|revisions",
			pageids: query,
			rvprop: "content",
			rvslots: "main",
			rvsection: "0",
			formatversion: 2,
			utf8: true,
		},
	})

	const page = data.query.pages[0]
	const parsed = wtf(page.revisions[0].slots.main.content)
	const infobox = parsed.infobox()

	const { data: { pages: related } } = await axiod.get<WikiRelated>(
		`https://en.wikipedia.org/api/rest_v1/page/related/${page.title}`,
	)

	const response: InteractionCallbackData = {
		embeds: [
			infobox
				? (
					<Embed title={`Infobox`} footerText="Information might be off from parsing issues">
						{...Object.entries(infobox.keyValue()).filter(([k]) => !excludedInfobox.includes(k)).map(([k, v]) => (
							<Field
								inline
								name={capitalize(k.replaceAll("_", " "))}
								value={v instanceof Array ? v.join(", ") : v.split("\n\n").join("\n")}
							/>
						))}
					</Embed>
				)
				: undefined,
			(
				<Embed
					title={parsed.title() || undefined}
					url={parsed.url() || undefined}
					description={`### ${page.description || "Wikipedia Article"}\n${parsed.text().split("\n")[0]}`}
					authorIcon="https://wikipedia.org/static/apple-touch/wikipedia.png"
					authorName="Wikipedia"
					authorUrl="https://en.wikipedia.org"
					thumbnail={infobox?.image()?.url()}
					footerText={"Last Updated"}
					timestamp={Temporal.Now.instant().epochMilliseconds}
				/>
			),
		].filter(e => !!e),
		components: [(
			<SelectMenu customId="related" placeholder="Related Articles">
				{...related.map(page => (
					<Option
						label={page.titles.normalized}
						description={page.description}
						value={page.pageid!.toString()}
					/>
				))}
			</SelectMenu>
		)],
	}

	await saveCache("wikipedia", `${query}.json`, response)
	return response
}

interface WikiQueryPageInfo {
	batchcomplete: boolean
	query: {
		pages: {
			pageid: number
			ns: number
			title: string
			description: string
			descriptionsource: string
			revisions: {
				slots: {
					main: {
						contentmodel: string
						contentformat: string
						content: string
					}
				}
			}[]
		}[]
	}
}

interface WikiSummary {
	type: string
	/** @deprecated */
	title: string
	/** @deprecated */
	displaytitle: string
	namespace: {
		id: number
		text: string
	}
	wikibase_item: string
	titles: {
		canonical: string
		normalized: string
		display: string
	}
	pageid?: number
	thumbnail?: {
		source: string
		width: number
		height: number
	}
	originalimage?: {
		source: string
		width: number
		height: number
	}
	lang: string
	dir: string
	revision: string
	tid: string
	timestamp?: string
	description?: string
	description_source?: string
	content_urls: {
		desktop: {
			page: string
			revisions: string
			edit: string
			talk: string
		}
		mobile: {
			page: string
			revisions: string
			edit: string
			talk: string
		}
	}
	extract: string
	extract_html?: string
	coordinates?: {
		lat: number
		lon: number
	}
}

interface WikiRelated {
	pages: WikiSummary[]
}
