import { stripIndents } from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { evaluate } from "mathjs"
import { colors, escapeMarkdown, getValue, pickArray, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "calculate",
	description: "Get the result of a mathematical expression",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "expression",
		description: "The expression [String]",
		type: ApplicationCommandOptionTypes.String,
		required: true,
	}],
}

export async function main(bot: Bot, interaction: Interaction) {
	const expression = getValue(interaction, "expression", "String") ?? ""

	const scope = {
		π: Math.PI,
		τ: Math.PI * 2,
		e: Math.E,
	}

	try {
		let result = evaluate(expression, scope)
		if (typeof result === "number") result = result.toString()
		else if (typeof result === "object") result = result.entries.join("; ")

		await respond(bot, interaction, {
			embeds: [{
				color: pickArray(colors),
				fields: [
					{ name: "Expression", value: `${escapeMarkdown(expression)}`, inline: false },
					{ name: "Result", value: `${escapeMarkdown(result)}`, inline: false },
				],
			}],
		})
	} catch (e) {
		console.botLog(e, { logLevel: "ERROR" })
		await respond(bot, interaction, stripIndents`Cannot evaluate \`${expression}\` - \`${e.message}\`
			${e.message.includes("Undefined symbol") ? "Declare variables by writing `a = 1; a + 1` => 2" : ""}`, true)
	}
}
