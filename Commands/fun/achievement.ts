import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import Fuse from "fuse"
import { colors, error, getFocused, getValue, pickArray, randRange, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "achievement",
	description: "Make your own Minecraft achievement",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "icon",
			description: "The icon of the achievement",
			type: ApplicationCommandOptionTypes.String,
			autocomplete: true,
			required: true,
		},
		{
			name: "content",
			description: "The content of the achievement",
			type: ApplicationCommandOptionTypes.String,
			required: true,
		},
		{
			name: "title",
			description: "The title of the achievement",
			type: ApplicationCommandOptionTypes.String,
			required: false,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const titles = ["Achievement Get!", "Advancement Made!", "Goal Reached!", "Challenge Complete!"]
	const content = getValue(interaction, "content", "String") ?? "I am blank"
	const icon = parseInt(getValue(interaction, "icon", "String") ?? "0") || randRange(39)
	const title = getValue(interaction, "title", "String") ?? pickArray(titles)

	await respond(bot, interaction, {
		embeds: [{
			color: parseInt(pickArray(colors), 16),
			image: { url: `https://minecraftskinstealer.com/achievement/${icon}/${encodeURI(title)}/${encodeURI(content)}` },
		}],
	})
}

export async function autocomplete(bot: Bot, interaction: Interaction) {
	const current = getFocused(interaction) ?? ""
	const choices: ApplicationCommandOptionChoice[] = [
		{ name: "arrow", value: "34" },
		{ name: "bed", value: "9" },
		{ name: "cake", value: "10" },
		{ name: "cobweb", value: "16" },
		{ name: "crafting_table", value: "13" },
		{ name: "creeper", value: "4" },
		{ name: "diamond", value: "2" },
		{ name: "diamond_sword", value: "3" },
		{ name: "arrow", value: "34" },
		{ name: "book", value: "19" },
		{ name: "bow", value: "33" },
		{ name: "bucket", value: "36" },
		{ name: "chest", value: "17" },
		{ name: "coal_block", value: "31" },
		{ name: "cookie", value: "7" },
		{ name: "diamond_armor", value: "26" },
		{ name: "fire", value: "15" },
		{ name: "flint_and_steel", value: "27" },
		{ name: "furnace", value: "18" },
		{ name: "gold_ingot", value: "23" },
		{ name: "grass_block", value: "1" },
		{ name: "heart", value: "8" },
		{ name: "iron_armor", value: "35" },
		{ name: "iron_door", value: "25" },
		{ name: "iron_ingot", value: "22" },
		{ name: "iron_sword", value: "32" },
		{ name: "lava", value: "38" },
		{ name: "milk", value: "39" },
		{ name: "oak_door", value: "24" },
		{ name: "pig", value: "5" },
		{ name: "planks", value: "21" },
		{ name: "potion", value: "28" },
		{ name: "rail", value: "12" },
		{ name: "redstone", value: "14" },
		{ name: "sign", value: "11" },
		{ name: "spawn_egg", value: "30" },
		{ name: "splash", value: "29" },
		{ name: "stone", value: "20" },
		{ name: "tnt", value: "6" },
		{ name: "water", value: "37" },
	]

	const response: ApplicationCommandOptionChoice[] = []
	const fuse = new Fuse(choices, { distance: 5, keys: ["name", "value"] })
	if (current.length > 0) response.push(...fuse.search(current).map(choice => choice.item))
	else response.push(...choices)

	await respond(bot, interaction, { choices: response.slice(0, 25) }).catch(err => error(bot, interaction, err, "Autocomplete"))
}
