import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { evaluate } from "mathjs"
import { colors, escapeMarkdown, getValue, pickArray, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "calculate",
	description: "Calculate an expression and return the result",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "expression",
		description: "The expression to calculate [String]",
		type: ApplicationCommandOptionTypes.String,
		required: true,
	}],
}

export async function main(bot: Bot, interaction: Interaction) {
	const expression = getValue(interaction, "expression", "String") ?? ""
	const symbols = ["π", "τ"]
	const symvals = [Math.PI, Math.PI * 2]

	const scope = new Map(symbols.map((v, i) => [v, symvals[i]]))

	try {
		let result = evaluate(expression, scope)
		if (typeof result === "number") result = result.toString()
		if (typeof result === "object") result = result.entries.join("; ")

		await respond(bot, interaction, {
			embeds: [{
				title: "Calculation",
				color: pickArray(colors),
				fields: [
					{ name: "Expression", value: `${escapeMarkdown(expression)}`, inline: false },
					{ name: "Result", value: `${escapeMarkdown(result)}`, inline: false },
				],
			}],
		})
	} catch (err) {
		console.botLog(err, { logLevel: "ERROR" })
		await respond(
			bot,
			interaction,
			`Cannot evaluate \`${expression}\`\n\`\`\`${err}\`\`\`${
				String(err).includes("Undefined symbol") ? "You may want to declare variables like `a = 9; a * 7` => 63" : ""
			}`,
			true,
		)
	}
}
