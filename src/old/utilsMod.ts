import { Bot, Collection, CreateApplicationCommand, Interaction } from "discordeno"
import { CommandHandler, getFiles, getSubcmd, getSubcmdGroup, respond } from "modules"
import { join } from "std:path"

const cmd: CreateApplicationCommand = {
	name: "utils",
	description: "Random utilities",
	defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
	options: [],
}

const handlers = new Collection<string, CommandHandler>()
for await (let file of getFiles(join(Deno.cwd(), "Commands", "utils"))) {
	const { cmd, main, button, select, autocomplete, modal } = await import(`./utils/${file}`)
	cmd.options?.push(cmd)
	handlers.set(cmd.name, { main, button, select, autocomplete, modal })
}

export async function main(bot: Bot, interaction: Interaction) {
	const handler = handlers.get(getSubcmdGroup(interaction) ?? getSubcmd(interaction) ?? "undefined")
	if (handler?.main) await handler.main(bot, interaction)
	else throw new Error("No handler found for this command")
}

export { cmd }
