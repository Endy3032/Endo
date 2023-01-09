import { CreateApplicationCommand } from "discordeno"
import { getFiles } from "modules"
import { dirname, fromFileUrl, join } from "path"

export async function createCommand(name: string, description: string, importMeta: ImportMeta) {
	const cmd: CreateApplicationCommand = {
		name,
		description,
		defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
		options: [],
	}

	const dir = dirname(fromFileUrl(importMeta.url))
	for await (const file of getFiles(dir)) {
		const { cmd: option } = await import(`file://${join(dir, file)}`)
		cmd.options?.push(option)
	}

	return cmd
}
