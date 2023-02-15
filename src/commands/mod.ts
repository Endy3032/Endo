import { Bot, Collection, CreateApplicationCommand, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { Command, getCmdName, getFiles, getSubcmd, getSubcmdGroup, InspectConfig, InteractionHandler, respond,
	shorthand } from "modules"

const commands: CreateApplicationCommand[] = []
const handlers = new Collection<string, Command>()

for await (const file of getFiles("./commands")) {
	const command: Command = await import(`./${file}`)
	handlers.set(command.cmd.name, command)
	commands.push(command.cmd)
}

for (const folder of getFiles("./commands", { fileTypes: "folders" })) {
	const { cmd } = await import(`./${folder}/mod.ts`)
	commands.push(cmd)

	for await (const file of getFiles(`./commands/${folder}`)) {
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
		console.botLog(interaction, { noSend: true })

		const name = [cmd, group ?? subcmd].join("/")
		const type = interaction.type === InteractionTypes.MessageComponent
			? MessageComponentTypes[interaction.data?.componentType ?? 2]
			: InteractionTypes[interaction.type]

		console.botLog(`No ${type} handler found for \`${name}\``, { logLevel: "ERROR" })
		return respond(bot, interaction, `${shorthand("error")} No ${type} handler found for \`${name}\``, true)
	}

	try {
		await handle(bot, interaction)
	} catch (e) {
		console.botLog(e, { logLevel: "ERROR" })
		let content = `${shorthand("error")} Something failed back here... Techy debug stuff below\`\`\`${
			Deno.inspect(e, InspectConfig).replaceAll(Deno.cwd(), "Endo")
		}`

		if (content.length > 1997) content = content.slice(0, 1994) + "..."
		content += "```"
		await respond(bot, interaction, content, true)
	}
}

export { commands }
