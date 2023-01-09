import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { getSubcmd, getValue, pickArray, randRange, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "random",
	description: "Feeling lucky?",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "coin",
			description: "Feeling lucky? Flip some coins",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [{
				name: "amount",
				description: "Coins count [Integer 1~10] (Fallback: 3)",
				type: ApplicationCommandOptionTypes.Integer,
				minValue: 1,
				maxValue: 10,
				required: true,
			}],
		},
		{
			name: "dice",
			description: "Feeling lucky? Roll some dice",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [{
				name: "amount",
				description: "Dice count [Integer 1~10] (Fallback: 3)",
				type: ApplicationCommandOptionTypes.Integer,
				minValue: 1,
				maxValue: 10,
				required: true,
			}],
		},
		{
			name: "number",
			description: "Feeling lucky? Generate some random numbers",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "amount",
					description: "Random number count [Integer 1~10] (Fallback: 3)",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 1,
					maxValue: 10,
					required: true,
				},
				{
					name: "min",
					description: "The numbers' lower bound [Integer] (Default: 0)",
					type: ApplicationCommandOptionTypes.Integer,
				},
				{
					name: "max",
					description: "The numbers' upper bound [Integer] (Default: 100)",
					type: ApplicationCommandOptionTypes.Integer,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const mode = getSubcmd(interaction)
	const amount = getValue(interaction, "amount", "Integer") ?? 3
	const min = getValue(interaction, "min", "Integer") ?? 0
	const max = getValue(interaction, "max", "Integer") ?? 100

	const embed = {
		title: mode === "coin" ? "Coin flip" : mode === "dice" ? "Dice roll" : "Random numbers",
		description: "",
	}
	let choices: (string | number)[] = []
	const results: (string | number)[] = []

	if (mode === "coin") choices = ["Head", "Tail"]
	else if (mode === "dice") choices = [1, 2, 3, 4, 5, 6]
	else if (mode === "number") {
		for (let i = 0; i < amount; i++) results.push(randRange(min, max))
		embed.description = results.join(", ")

		return await respond(bot, interaction, { embeds: [embed] })
	}

	for (let i = 0; i < amount; i++) results.push(pickArray(choices))
	embed.description = results.join(", ")

	await respond(bot, interaction, { embeds: [embed] })
}
