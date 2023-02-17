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

	for await (const file of getFiles(new URL(dirname(importMeta.url)))) {
		const { cmd: option } = await import(`file://${join(dirname(fromFileUrl(importMeta.url)), file)}`)
		cmd.options?.push(option)
	}

	return cmd
}
