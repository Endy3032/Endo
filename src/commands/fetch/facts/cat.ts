import axiod from "axiod"
import { ApplicationCommandOptionTypes } from "discordeno"
import { getCache, InteractionHandler, pickArray, ReadonlyOption, saveCache, TimeMetric } from "modules"
import { Temporal } from "temporal"
import { respond } from "./_respond.tsx"

export const cmd = {
	name: "cat",
	description: "Get a random cat fact",
	type: ApplicationCommandOptionTypes.SubCommand,
} as const satisfies ReadonlyOption

export const main: InteractionHandler = async (_, interaction, args) => {
	const cache = await getCache("facts", "cat.json")
	const cachedData: CachedFacts = JSON.parse(cache ?? "{}")

	if (!cache || cachedData.timestamp < Temporal.Now.instant().epochSeconds - 14 * TimeMetric.sec_day) {
		const { data } = await axiod.get<GitHubGist>("https://api.github.com/gists/d58b496761fa7c1d63436d884ad2cfc4")

		cachedData.timestamp = Temporal.Now.instant().epochSeconds
		cachedData.data = JSON.parse(data.files["cat-facts.json"].content)

		await saveCache("facts", "cat.json", JSON.stringify(cachedData, null, 2))
	}

	const key = pickArray(Object.keys(cachedData.data)) as keyof typeof cachedData.data
	const facts = cachedData.data[key]
	const fact = pickArray<string>(facts.facts)

	await respond(interaction, args, fact, { name: facts.source, url: facts.url, icon: facts.icon })
}

interface CachedFacts {
	timestamp: number
	data: {
		[key: string]: {
			source: string
			url: string
			icon?: string
			facts: string[]
		}
	}
}

interface GitHubGist {
	[key: string]: any
	files: {
		"cat-facts.json": {
			[key: string]: any
			content: string
		}
	}
}
