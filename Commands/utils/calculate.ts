import { stripIndents } from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { parse } from "mathjs"
import { colors, getValue, pickArray, respond } from "modules"

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
	const subexpressions = expression.split(";").map(e => e.trim()).filter(e => e.length > 0)
	const nodes = parse(subexpressions)

	const scope = {
		π: Math.PI,
		τ: Math.PI * 2,
		e: Math.E,
	}

	try {
		let result = nodes.map(node => node.compile().evaluate(scope))

		await respond(bot, interaction, {
			embeds: [{
				color: pickArray(colors),
				fields: [{
					name: "Result",
					value: `\`\`\`${subexpressions.map((e, i) => `${e}: ${result[i]}`).join("\n")}\`\`\``,
					inline: false,
				}],
			}],
		})
	} catch (e) {
		console.botLog(e, { logLevel: "ERROR" })
		await respond(bot, interaction, stripIndents`Cannot evaluate \`${expression}\` - \`${e.message}\``)
	}
}
