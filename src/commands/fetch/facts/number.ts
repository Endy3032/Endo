import axiod from "axiod"
import { ApplicationCommandOptionTypes } from "discordeno"
import { InteractionHandler, ReadonlyOption } from "modules"
import { respond } from "./_respond.tsx"

export const cmd = {
	name: "number",
	description: "Get a fact about a number",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "number",
			description: "The fact's number [Integer]",
			type: ApplicationCommandOptionTypes.Integer,
			required: true,
		},
		{
			name: "type",
			description: "The fact's type (Default: Trivia)",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Trivia", value: "trivia" },
				{ name: "Math", value: "math" },
				{ name: "Year", value: "year" },
			],
			required: true,
		},
	],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (_, interaction, args) => {
	const type = args.type ?? "trivia", number = args.number ?? 1
	const { data } = await axiod.get(`http://numbersapi.com/${number}/${type}`)

	await respond(interaction, args, data, {
		name: "Numbers API",
		url: "http://numbersapi.com/",
		icon: "http://numbersapi.com/img/favicon.ico",
	})
}
