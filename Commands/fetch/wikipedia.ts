import {} from "modules"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"

export const cmd: ApplicationCommandOption = {
	name: "wikipedia",
	description: "Fetch a Wikipedia article",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "article",
			description: "Search for a Wikipedia article",
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
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
}
