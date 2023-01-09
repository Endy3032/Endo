import { Bot, Collection, CreateApplicationCommand, Interaction } from "discordeno"
import { Command, getCmdName, getFiles, getSubcmd, getSubcmdGroup, respond, shorthand } from "modules"

const commands: CreateApplicationCommand[] = []
const handlers = new Collection<string, Command>()

for await (const file of getFiles("./Commands")) {
	const command: Command = await import(`./${file}`)
	handlers.set(command.cmd.name, command)
	commands.push(command.cmd)
}

for (const folder of getFiles("./Commands", { fileTypes: "folders" })) {
	const { cmd } = await import(`./${folder}/mod.ts`)
	commands.push(cmd)

	for await (const file of getFiles(`./Commands/${folder}`)) {
		const command: Command = await import(`./${folder}/${file}`)
		handlers.set(`${folder}/${command.cmd.name}`, command)
	}
}

export async function handleInteraction(bot: Bot, interaction: Interaction) {
	const [group, subcmd, cmd] = [getSubcmdGroup(interaction), getSubcmd(interaction), getCmdName(interaction)]
	const command = handlers.get(cmd) ?? handlers.get(`${cmd}/${group ?? subcmd}`)
	if (!command) {
		// console.botLog(`No ${type} handler found for \`${commandName}\``, { logLevel: "ERROR" })
		return respond(bot, interaction, `${shorthand("error")} No handler found for \`${cmd}\``, true)
	}
	/**
	 * const handler = handlers.get(commandName ?? "undefined") as Command
	 * let exec: InteractionHandler | undefined = handler.main, type = "Command"
	 * if (interaction.type === InteractionTypes.MessageComponent) {
	 * 	if (interaction.data?.componentType === MessageComponentTypes.Button) {
	 * 		exec = handler?.button
	 * 		type = "Button"
	 * 	} else {
	 * 		exec = handler?.select
	 * 		type = "Select Menu"
	 * 	}
	 * } else if (interaction.type === InteractionTypes.ModalSubmit) {
	 * 	exec = handler?.modal
	 * 	type = "Modal"
	 * } else if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) {
	 * 	exec = handler?.autocomplete
	 * 	type = "Autocomplete"
	 * }
	 * if (!exec || !handler) {
	 * 	console.botLog(`No ${type} handler found for \`${commandName}\``, { logLevel: "ERROR" })
	 * 	return respond(bot, interaction, `${shorthand("error")} No handler found for ${commandName}`, true)
	 * }
	 * try {
	 * 	await exec(bot, interaction)
	 * } catch (e) {
	 * 	console.botLog(e, { logLevel: "ERROR" })
	 * 	let content = stripIndents`${shorthand("error")} Something failed back here... Techy debug stuff below\`\`\`
	 * 			${Deno.inspect(e, { colors: false, compact: true, depth: 6, iterableLimit: 200 })}`
	 * 		.replaceAll("    ", "  ")
	 * 		.replaceAll(Deno.cwd(), "Endo")
	 * 	if (content.length > 1997) content = content.slice(0, 1994) + "..."
	 * 	content += "```"
	 * 	await respond(bot, interaction, content, true)
	 * }
	 */
}

export { commands, handlers }
