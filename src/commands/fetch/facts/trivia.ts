import { axiod } from "axiod"
import { ApplicationCommandOptionTypes } from "discordeno"
import { InteractionHandler, ReadonlyOption } from "modules"
import { respond } from "./_respond.tsx"

export const cmd = {
	name: "trivia",
	description: "Get a random trivia fact",
	type: ApplicationCommandOptionTypes.SubCommand,
} as const satisfies ReadonlyOption

export const main: InteractionHandler = async (_, interaction, args) => {
	const { data } = await axiod.get("https://facts-by-api-ninjas.p.rapidapi.com/v1/facts", {
		headers: {
			"X-RapidAPI-Key": Deno.env.get("RapidAPI") ?? "",
			"X-RapidAPI-Host": "facts-by-api-ninjas.p.rapidapi.com",
		},
	})

	await respond(interaction, args, data[0].fact)
}
