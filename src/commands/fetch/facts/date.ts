import axiod from "axiod"
import { ApplicationCommandOptionTypes } from "discordeno"
import { InteractionHandler, ReadonlyOption } from "modules"
import { randRange } from "modules"
import { respond } from "./_respond.tsx"

export const cmd = {
	name: "date",
	description: "Get a fact about a date",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "day",
			description: "The date's day",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 1,
			maxValue: 31,
			required: true,
		},
		{
			name: "month",
			description: "The date's month",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 1,
			maxValue: 12,
			required: true,
		},
	],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (_, interaction, args) => {
	const day = args.day ?? randRange(1, 31), month = args.month ?? randRange(1, 12)
	const { data } = await axiod.get(`http://numbersapi.com/${month}/${day}/date`)

	await respond(interaction, args, data, {
		name: "Numbers API",
		url: "http://numbersapi.com/",
		icon: "http://numbersapi.com/img/favicon.ico",
	})
}
