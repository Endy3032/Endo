import axiod from "axiod"
import { ApplicationCommandOptionTypes } from "discordeno"
import { getCache, InteractionHandler, pickArray, ReadonlyOption, saveCache, TimeMetric } from "modules"
import { Temporal } from "temporal"
import { respond } from "./_respond.tsx"

export const cmd = {
	name: "useless",
	description: "Get a random useless fact",
	type: ApplicationCommandOptionTypes.SubCommand,
} as const satisfies ReadonlyOption

export const main: InteractionHandler = async (_, interaction, args) => {
	const cache = await getCache("facts", "useless.json")
	const cachedData: CachedFacts = JSON.parse(cache ?? "{}")

	if (!cache || cachedData.timestamp < Temporal.Now.instant().epochSeconds - 14 * TimeMetric.sec_day) {
		const { data } = await axiod.get<GitHubGist>("https://api.github.com/gists/74f66bcce364c02aa091110f48e86e55")

		cachedData.timestamp = Temporal.Now.instant().epochSeconds
		cachedData.data = JSON.parse(data.files["useless-facts.json"].content)

		await saveCache("facts", "useless.json", JSON.stringify(cachedData, null, 2))
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
		"useless-facts.json": {
			[key: string]: any
			content: string
		}
	}
}
