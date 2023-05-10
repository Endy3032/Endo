import { ApplicationCommandOption, ApplicationCommandOptionTypes, CreateApplicationCommand } from "discordeno"
import { dirname, fromFileUrl, join } from "std:path"
import { getFiles } from "./getFiles.ts"

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

	for await (const folder of getFiles(new URL(dirname(importMeta.url)), { fileTypes: "folders" })) {
		const { cmd: option } = await import(`file://${join(dirname(fromFileUrl(importMeta.url)), folder, "mod.ts")}`)
		cmd.options?.push(option)
	}

	return cmd
}

export async function createGroup(name: string, description: string, importMeta: ImportMeta) {
	const cmd: ApplicationCommandOption = {
		name,
		description,
		type: ApplicationCommandOptionTypes.SubCommandGroup,
		options: [],
	}

	const path = dirname(importMeta.url)

	for await (const file of getFiles(new URL(path))) {
		const { cmd: option } = await import(`file://${join(fromFileUrl(path), file)}`)
		cmd.options?.push(option)
	}

	return cmd
}
