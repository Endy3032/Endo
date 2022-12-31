import { rgb24 } from "colors"
import { BitwisePermissionFlags, Bot, Interaction } from "discordeno"
import { capitalize } from "./capitalize.ts"
import { shorthand } from "./emojis.ts"
import { getCmdName, getSubcmd, getSubcmdGroup } from "./getInteractionData.ts"
import { respond } from "./respondInteraction.ts"
import { Nord } from "./types.ts"

const permissions = Object.fromEntries(new Map(
	Object.entries(BitwisePermissionFlags).filter(([key]) => !parseInt(key)).map(([k, v]) => [
		v,
		k.split("_")
			.map(word => capitalize(word, true))
			.join(" ")
			.replace(/vad/i, "Voice Activity")
			.replace(/tts/i, "Text To Speech"),
	]),
))

export const checkPermission = (bot: Bot, interaction: Interaction, ...perms: BitwisePermissionFlags[]) => {
	if (!interaction.guildId) {
		respond(bot, interaction, `${shorthand("warn")} This command can only be used in servers`, true)
		return true
	}

	const memberPerm = interaction.member?.permissions ?? 0n
	let block = false
	let consoleLog = `${rgb24("Permissions:", Nord.yellow)}\n`
	let content = `Required permissions for \`/${
		[getCmdName(interaction), getSubcmdGroup(interaction), getSubcmd(interaction)].join(" ").replaceAll(/ {2,}/, " ")
	}\`:`

	perms.forEach(permission => {
		const perm = BigInt(permission)
		const hasPerm = (memberPerm & perm) === perm
		const permName = permissions[permission.toString()]

		if (!hasPerm) block = true
		consoleLog += `\n  ${rgb24(permName, hasPerm ? Nord.green : Nord.red)}`
		content += `\n${hasPerm ? shorthand("success") : shorthand("error")} \`${permName}\``
	})

	if (block) {
		console.botLog(`${consoleLog} ]`, { logLevel: "WARN" })
		respond(bot, interaction, content, true)
	}
	return block
}
