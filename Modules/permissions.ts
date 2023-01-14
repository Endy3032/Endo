import { rgb24 } from "colors"
import { BitwisePermissionFlags, Bot, Interaction } from "discordeno"
import { shorthand } from "./emojis.ts"
import { getCmdName, getSubcmd, getSubcmdGroup } from "./getInteractionData.ts"
import { Nord } from "./types.ts"
import { capitalize } from "./utils.ts"

export const permissions = Object.fromEntries(new Map(
	Object.entries(BitwisePermissionFlags).filter(([k]) => !parseInt(k)).map(([k, v]) => [
		v,
		k.split("_")
			.map(word => capitalize(word, true))
			.join(" ")
			.replace(/vad/i, "Voice Activity")
			.replace(/tts/i, "Text To Speech"),
	]),
))

export async function checkPermission(interaction: Interaction, ...perms: BitwisePermissionFlags[]) {
	const memberPerm = interaction.member?.permissions ?? 0n

	let block = false
	let consoleLog = `${rgb24("Permissions:", Nord.yellow)}`
	let response = `Required permissions for \`/${
		[getCmdName(interaction), getSubcmdGroup(interaction), getSubcmd(interaction)].join(" ").replace(/ {2,}/, " ")
	}\`:`

	perms.forEach(permission => {
		const perm = BigInt(permission)
		const hasPerm = (memberPerm & perm) === perm
		const permName = permissions[permission.toString()]

		if (!hasPerm) block = true
		consoleLog += `\n  ${rgb24(permName, hasPerm ? Nord.green : Nord.red)}`
		response += `\n${shorthand(hasPerm ? "success" : "error")} \`${permName}\``
	})

	if (block) {
		console.botLog(consoleLog, { logLevel: "WARN" })
		return response
	}
	return false
}
