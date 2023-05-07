import { BitwisePermissionFlags, Interaction, rgb24 } from "discordeno"
import { shorthand } from "./emojis.ts"
import { Nord } from "./exports.ts"
import { getCmd, getGroup, getSubcmd } from "./interactionName.ts"
import { capitalize } from "./utils.ts"

export const permissionNames = Object.fromEntries(new Map(
	Object.entries(BitwisePermissionFlags).filter(([k]) => !parseInt(k)).map(([k, v]) => [
		v,
		k.split("_")
			.map(word => capitalize(word, true))
			.join(" ")
			.replace(/vad/i, "Voice Activity")
			.replace(/tts/i, "Text To Speech"),
	]),
))

export function checkPermission(interaction: Interaction, ...permissions: BitwisePermissionFlags[]) {
	const memberPerm = interaction.member?.permissions
	if (!memberPerm) return false

	let block = false
	let consoleLog = `${rgb24("Permissions:", Nord.yellow)}`
	let response = `Required permissions for \`/${
		[getCmd(interaction), getGroup(interaction), getSubcmd(interaction)].join(" ").replace(/ {2,}/, " ")
	}\`:`

	const perms = [...new Set(permissions)].map(e => BitwisePermissionFlags[e]) as Array<keyof typeof BitwisePermissionFlags>

	if (memberPerm.hasAll(perms)) return false

	perms.forEach(perm => {
		const hasPerm = memberPerm.has(perm)
		const permName = permissionNames[perm]

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
