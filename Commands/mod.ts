import { Collection } from "discordeno"
import { Command, getFiles } from "modules"

const commands = new Collection<string, Command>()

for await (const file of getFiles("./Commands")) {
	if (file == "mod.ts" || file.includes("$")) continue
	const command: Command = await import(`./${file}`)
	commands.set(command.cmd.name, command)
}

export { commands }
