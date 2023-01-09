import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction, MessageComponentTypes,
	TextStyles } from "discordeno"
import { capitalize, defer, getValue, respond } from "modules"
import { TOTP } from "otpauth"

const otp = new TOTP({
	algorithm: "SHA1",
	digits: 8,
	period: 30,
	secret: Deno.env.get("OTP"),
})

export const cmd: ApplicationCommandOption = {
	name: "eval",
	description: "Evaluate a code [Bot Owner Only]",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
		name: "otp",
		description: "One Time Password for validation",
		type: ApplicationCommandOptionTypes.String,
		required: true,
	}],
}

export async function main(bot: Bot, interaction: Interaction) {
	const app = await bot.helpers.getApplicationInfo()
	const ownerID = (app.team ? app.team.ownerUserId : app.owner?.id) ?? bot.id
	if (interaction.user.id !== ownerID) return respond(bot, interaction, "You aren't allowed to use this command", true)

	const token = getValue(interaction, "otp", "String")
	if (!token) return respond(bot, interaction, "Cannot retrieve OTP, try again", true)
	if (otp.validate({ token, window: 1 }) === null) return respond(bot, interaction, "Invalid OTP, try again", true)

	await respond(bot, interaction, {
		title: "Eval",
		customId: "manage_eval",
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.InputText,
				style: TextStyles.Paragraph,
				customId: "code",
				label: "Code",
				required: true,
			}],
		}],
	})
}

export async function modal(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)
	const code = getValue(interaction, "code", "Modal")
	var response = `**Code**\n\`\`\`ts\n${code}\`\`\`\n`
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const discordeno = await import("discordeno")

	try {
		let output = Deno.inspect(await eval(code?.replaceAll("await ", "") ?? ""), { compact: false })
		for (const brack of ["()", "[]", "{}"]) {
			output = output.replaceAll(new RegExp(`(\\${brack.charAt(0)}\\n\\s+\\${brack.charAt(1)},)`, "gm"), `${brack},`)
		}
		if (output !== undefined) response += `**Output**\n\`\`\`ts\n${output} [typeof ${capitalize(typeof output)}]\`\`\``
	} catch (err) {
		response += `**Error**\n\`\`\`ts\n${err.stack.replaceAll(Deno.cwd(), "Endo").replaceAll("    ", "  ")}\`\`\``
	}

	respond(bot, interaction, response)
}
