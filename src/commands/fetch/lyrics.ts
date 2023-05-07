import axiod from "axiod"
import { IConfig } from "axiodInterfaces"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { DOMParser, NodeList, NodeType } from "dom"
import { colors, defer, edit, InteractionHandler, pickArray, ReadonlyOption, respond } from "modules"

const { Genius: GeniusToken, ScrapingAnt } = Deno.env.toObject()

export const cmd = {
	name: "lyrics",
	description: "Fetch lyrics from Genius",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "song",
		description: "The song to search for",
		type: ApplicationCommandOptionTypes.String,
		autocomplete: true,
		required: true,
	}],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
	if (!GeniusToken) return interaction.respond("No Genius API Token Provided", { isPrivate: true })
	await defer(bot, interaction)

	const { data } = await axiod.get(`https://api.genius.com/songs/${args.song}`, {
		params: {
			text_format: "plain",
			access_token: GeniusToken,
		},
	})

	const request: { url: string; config: IConfig } = ScrapingAnt
		? {
			url: "https://api.scrapingant.com/v2/general",
			config: {
				params: {
					url: `https://webcache.googleusercontent.com/search?strip=1&q=cache:https://genius.com/${
						data.response.song.path.replace(/^\//, "")
					}`,
					browser: "false",
					"x-api-key": ScrapingAnt,
				},
			},
		}
		: {
			url: "http://webcache.googleusercontent.com/search",
			config: {
				params: {
					q: `cache:https://genius.com/${data.response.song.path.replace(/^\//, "")}`,
					strip: 1,
				},
			},
		}

	const lyricsHtml = await axiod.get(request.url, request.config)
		.catch(e => {
			edit(bot, interaction, `Error while fetching lyrics: ${e.response.status} ${e.response.statusText}`)
			throw e
		})

	const doc = new DOMParser().parseFromString(lyricsHtml.data, "text/html")?.querySelectorAll("[data-lyrics-container='true']")
	const lyrics = doc === undefined || doc.length === 0 ? "This song is an instrumental" : nodeListToText(doc)

	const { title_with_featured, song_art_image_url, album, primary_artist, release_date_for_display, url } = data.response.song,
		cont = `[Continue on Genius.com](${url})`

	await edit(bot, interaction, {
		embeds: [{
			author: { name: primary_artist.name, iconUrl: primary_artist.image_url, url: primary_artist.url },
			url,
			title: title_with_featured,
			color: pickArray(colors),
			description: lyrics.length > 4096 ? `${lyrics.slice(0, 4094 - cont.length)}…\n${cont}` : lyrics,
			thumbnail: { url: song_art_image_url },
			footer: {
				text: `${album?.name ?? "No Album"} | ${release_date_for_display}`,
				iconUrl: album?.cover_art_url,
			},
		}],
	})
}

function nodeListToText(nodes: NodeList) {
	let result = ""

	for (const node of nodes) {
		if (node.childNodes.length > 0) result += nodeListToText(node.childNodes)
		else {
			console.log(node.nodeValue)
			result += node.nodeName.toLowerCase() === "br"
				? "\n"
				: node.nodeType === NodeType.TEXT_NODE
				? node.nodeValue?.replaceAll("&nbsp;", " ")
				: node.textContent
		}
	}

	return result
		.replaceAll(/ $/gm, "")
		.replaceAll(/(?<!\n)\n\[/g, "\n\n[")
}

export const autocomplete: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
	if (!GeniusToken) return respond(bot, interaction, { choices: [{ name: "No Genius API Token Provided", value: "…" }] })

	const { song } = args,
		placeholder = { name: "Keep typing to continue...", value: "…" },
		empty = { name: "No results found", value: "…" },
		response: ApplicationCommandOptionChoice[] = []

	if (song.length === 0) return respond(bot, interaction, { choices: [placeholder] })

	const { data } = await axiod.get("https://api.genius.com/search", {
		params: {
			q: song,
			access_token: GeniusToken,
		},
	})

	response.push(...data.response.hits.map(hit => ({
		name: hit.result.full_title.slice(0, 100),
		value: `${hit.result.id}`,
	})))

	if (response.length === 0) response.push(empty)
	await respond(bot, interaction, { choices: response })
}
