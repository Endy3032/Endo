import { ApplicationCommandOptionTypes } from "discordeno"
import { InteractionHandler, ReadonlyOption } from "modules"

export const cmd = {
	name: "weather",
	description: "Fetch the current weather for any places from www.weatherapi.com",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "location",
			description: "The location to fetch the weather data [string]",
			type: ApplicationCommandOptionTypes.String,
			required: true,
			autocomplete: true,
		},
		{
			name: "options",
			description: "Options to change the output",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Use Imperial (˚F)", value: "imp" },
				{ name: "Includes Air Quality", value: "aq" },
				{ name: "Both", value: "both" },
			],
			required: false,
		},
	],
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {}
