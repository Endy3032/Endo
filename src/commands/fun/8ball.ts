import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { colors, defer, edit, getValue, pickArray, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "8ball",
	description: "Get a response from the magic 8-Ball",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "question",
		description: "The question to ask [String]",
		type: ApplicationCommandOptionTypes.String,
		required: true,
	}],
}

export async function main(bot: Bot, interaction: Interaction) {
	const responses = {
		yes: [
			"It's certain.",
			"It's decidedly so.",
			"Without a doubt.",
			"Yes, definitely.",
			"You may rely on it.",
			"As i see it, yes.",
			"Most likely.",
			"Outlook good.",
			"Yes.",
			"Signs point to Yes.",
		],
		neutral: [
			"Reply hazy, try again.",
			"Ask again later.",
			"Better not tell you now.",
			"Can't predict now",
			"Concentrate and ask again",
		],
		no: [
			"Don't count on it.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good.",
			"Very doubtful",
		],
	}

	const question = getValue(interaction, "question", "String") ?? ""
	const response = question.match(/^[\u200a]|[\u200a]$/)
		? pickArray(responses.yes)
		: question.match(/^[\u200b]|[\u200b]$/)
		? pickArray(responses.no)
		: pickArray(pickArray(Object.values(responses)))

	respond(bot, interaction, {
		embeds: [{
			title: "Magic 8-Ball",
			color: pickArray(colors),
			fields: [
				{ name: ":question: Question", value: question, inline: false },
				{ name: ":8ball: Response", value: response, inline: false },
			],
		}],
	})
}
