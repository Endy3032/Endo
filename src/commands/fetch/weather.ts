import {} from "modules"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"

export const cmd: ApplicationCommandOption = {
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
}

export async function main(bot: Bot, interaction: Interaction) {
}
