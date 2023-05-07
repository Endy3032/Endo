import axiod from "axiod"
import { stripIndents } from "commonTags"
import commonTags from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Embed, Interaction, MessageComponentTypes,
	TextStyles } from "discordeno"
import * as discordeno from "discordeno"
import { format } from "duration"
import Fuse from "fuse"
import * as googleTranslate from "googleTranslate"
import mathjs from "mathjs"
import { capitalize, defer, edit, getValue, respond } from "modules"
import { TOTP } from "otpauth"
import otpauth from "otpauth"
import progressbar from "progressbar"
import { Temporal } from "temporal"
import * as time from "time"
import * as urban from "urban"
import * as wikipedia from "wikipedia"

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
	// if (otp.validate({ token, window: 1 }) === null) return respond(bot, interaction, "Invalid OTP, try again", true)

	await respond(bot, interaction, {
		title: "Eval",
		customId: "manage/eval",
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

	const embed: Embed = {
		description: stripIndents`\
		**Code**
		\`\`\`ts
		${code}
		\`\`\`
		**Output**
		\`\`\`ts
		`,
		timestamp: Temporal.Now.instant().epochMilliseconds,
	}

	try {
		const start = Temporal.Now.instant().epochMicroseconds
		const evalOutput = await eval(code ?? "")
		const end = Temporal.Now.instant().epochMicroseconds

		let output = Deno.inspect(evalOutput, { compact: false })
		embed.description += "\n" + output
		embed.footer = {
			text: `Time: ${format(Number((end - start) / 1000n), { style: "narrow", ignoreZero: true })} | Type: ${
				capitalize(typeof evalOutput)
			}`,
		}
	} catch (err) {
		embed.description?.replace("**Output**", "**Error**")
		embed.description += "\n" + err.stack.replaceAll(Deno.cwd(), "Endo")
	}

	if ((embed.description?.length ?? 0) > 4096) embed.description = embed.description?.slice(0, 4090) + "...\`\`\`"
	else embed.description += "\`\`\`"

	edit(bot, interaction, { embeds: [bot.transformers.reverse.embed(bot, embed)] })
}
