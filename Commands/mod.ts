import { Bot, Collection, CreateApplicationCommand, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { Command, DenoInspectConfig, getCmdName, getFiles, getSubcmd, getSubcmdGroup, InteractionHandler, respond,
	shorthand } from "modules"

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
	const [cmd, group, subcmd] = [getCmdName(interaction), getSubcmdGroup(interaction), getSubcmd(interaction)]
	const command = handlers.get(cmd) ?? handlers.get(`${[cmd, group ?? subcmd].join("/")}`)

	let handle: InteractionHandler | undefined = command?.main
	if (interaction.type === InteractionTypes.MessageComponent) {
		if (interaction.data?.componentType === MessageComponentTypes.Button) {
			handle = command?.button
		} else {
			handle = command?.select
		}
	} else if (interaction.type === InteractionTypes.ModalSubmit) {
		handle = command?.modal
	} else if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) {
		handle = command?.autocomplete
	}

	if (!command || !handle) {
		console.botLog(`No handler found for \`${[cmd, group ?? subcmd].join("/")}\``, { logLevel: "ERROR" })
		return respond(bot, interaction, `${shorthand("error")} No handler found for \`${cmd}\``, true)
	}

	try {
		await handle(bot, interaction)
	} catch (e) {
		console.botLog(e, { logLevel: "ERROR" })
		let content = `${shorthand("error")} Something failed back here... Techy debug stuff below\`\`\`${
			Deno.inspect(e, DenoInspectConfig)
				.replaceAll(Deno.cwd(), "Endo")
		}`

		if (content.length > 1997) content = content.slice(0, 1994) + "..."
		content += "```"
		await respond(bot, interaction, content, true)
	}
}

export { commands }
