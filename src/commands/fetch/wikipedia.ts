import { ApplicationCommandOptionTypes } from "discordeno"
import { InteractionHandler, ReadonlyOption } from "modules"

export const cmd = {
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
} as const satisfies ReadonlyOption

export const main: InteractionHandler<typeof cmd.options> = async (bot, interaction, args) => {
}
