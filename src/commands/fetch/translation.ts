import {} from "modules"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"

export const cmd: ApplicationCommandOption = {
	name: "translation",
	description: "Fetch a translation from Google Translate",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "to",
			description: "The translated language",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
		{
			name: "text",
			description: "The text to translate",
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
		{
			name: "from",
			description: "The source language",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: false,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
}
