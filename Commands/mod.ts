import { Bot, Collection, Interaction } from "discordeno"
import { Command, getCmdName, getFiles, getSubcmd, getSubcmdGroup, respond, shorthand } from "modules"

const commands = new Collection<string, Command>()

for await (const file of getFiles("./Commands")) {
	const command: Command = await import(`./${file}`)
	commands.set(command.cmd.name, command)
}

for (const folder of getFiles("./Commands", { fileTypes: "folders" })) {
	for await (const file of getFiles(`./Commands/${folder}`)) {
		const command: Command = await import(`./${folder}/${file}`)
		commands.set(`${folder}/${command.cmd.name}`, command)
	}
}

export async function main(bot: Bot, interaction: Interaction) {
	const [group, subcmd, cmd] = [getSubcmdGroup(interaction), getSubcmd(interaction), getCmdName(interaction)]
	const command = commands.get(cmd) ?? commands.get(`${cmd}/${group ?? subcmd}`)
	if (!command) {
		// console.botLog(`No ${type} handler found for \`${commandName}\``, { logLevel: "ERROR" })
		return respond(bot, interaction, `${shorthand("error")} No handler found for \`${cmd}\``, true)
	}
}

export { commands }
