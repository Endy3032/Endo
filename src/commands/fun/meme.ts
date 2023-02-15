import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import Fuse from "fuse"
import { error, getFiles, getFocused, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "meme",
	description: "Make your own meme",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "text",
			description: "The meme's caption",
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
		{
			name: "variant",
			description: "The meme's variant (leave blank for random)",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: false,
		},
		{
			name: "custom_image",
			description: "Custom image (overrides variant)",
			type: ApplicationCommandOptionTypes.Attachment,
			required: false,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
}

export async function autocomplete(bot: Bot, interaction: Interaction) {
	const current = getFocused(interaction) ?? ""
	const memeFiles = getFiles("./assets/Meme/", { fileTypes: "png" })

	const choices: ApplicationCommandOptionChoice[] = [
		...memeFiles.map(file => ({ name: file.split(".")[0].replaceAll("_", " "), value: file.split(".")[0] })),
	]

	const response: ApplicationCommandOptionChoice[] = []
	const fuse = new Fuse(choices, { distance: 5, keys: ["name", "value"] })
	if (current.length > 0) response.push(...fuse.search(current).map(choice => choice.item))
	else response.push(...choices)

	await respond(bot, interaction, { choices: response.slice(0, 25) }).catch(err => error(bot, interaction, err, "Autocomplete"))
}
