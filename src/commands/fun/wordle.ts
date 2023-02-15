import {} from "modules"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"

export const cmd: ApplicationCommandOption = {
	name: "wordle",
	description: "Play a game of Wordle!",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "daily",
			description: "Play today's word from Wordle",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "replay",
			description: "Replay a game of Worlde",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "id",
					description: "The ID of the game to replay [Integer 0~2308]",
					type: ApplicationCommandOptionTypes.Integer,
					required: true,
					minValue: 0,
					maxValue: 2308,
				},
			],
		},
		{
			name: "random",
			description: "Play any random word",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "mode",
					description: "The random mode to play",
					type: ApplicationCommandOptionTypes.String,
					required: true,
					choices: [
						{ name: "Random Words", value: "random" },
						{ name: "Random Daily Wordle", value: "daily" },
					],
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
}
