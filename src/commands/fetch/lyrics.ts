import {} from "modules"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"

export const cmd: ApplicationCommandOption = {
	name: "lyrics",
	description: "Fetch lyrics from Genius",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "song",
		description: "The song to search for",
		type: ApplicationCommandOptionTypes.String,
		autocomplete: true,
		required: true,
	}],
}

export async function main(bot: Bot, interaction: Interaction) {
}
