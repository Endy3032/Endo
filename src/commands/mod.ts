import { Collection, CreateApplicationCommand, Interaction, InteractionTypes, MessageComponentTypes, stripColor } from "discordeno"
import { Command, CommandHandler, getCmd, getFiles, getGroup, getSubcmd, InspectConfig, interactionName, parseOptions } from "modules"

const commands: CreateApplicationCommand[] = []
const handlers = new Collection<string, Command>()

for await (const file of getFiles("commands")) {
	const command: Command = await import(`./${file}`)
	handlers.set(command.cmd.name, command)
	commands.push(command.cmd)
}

for await (const folder of getFiles("commands", { fileTypes: "folders" })) {
	const { cmd } = await import(`./${folder}/mod.ts`)
	commands.push(cmd)
	getHandlers(folder)

	const subfolders = getFiles(`commands/${folder}`, { fileTypes: "folders" })
	for await (const subfolder of subfolders) await getHandlers(`${folder}/${subfolder}`)
}

async function getHandlers(folder: string) {
	for await (const file of getFiles(`commands/${folder}`)) {
		const command: Command = await import(`./${folder}/${file}`)
		handlers.set(`${folder}/${command.cmd.name}`, command)
	}
}

export { commands }

export async function handleInteraction(interaction: Interaction) {
	const name = interactionName(interaction)?.join(" ").replace(/^\[\w\] /, ""),
		cmd = getCmd(interaction),
		group = getGroup(interaction),
		subcmd = getSubcmd(interaction)

	const command = handlers.get(cmd ?? "")
		?? handlers.get(name ?? "")
		?? handlers.get([cmd, group ?? subcmd].join("/"))
		?? handlers.get([cmd, group, subcmd].filter(e => e).join("/"))

	const handler = handlerMap(interaction)[interaction.type] as keyof CommandHandler

	if (!command || !command[handler]) {
		console.botLog(interaction, { logLevel: "DEBUG", noSend: true })

		const name = [cmd, group ?? subcmd].join("/")
		const type = interaction.type === InteractionTypes.MessageComponent
			? MessageComponentTypes[interaction.data?.componentType ?? 2]
			: InteractionTypes[interaction.type]

		const content = `No ${type} handler found for \`${name}\``

		console.botLog(content, { logLevel: "ERROR" })
		return await interaction.respond(content, { isPrivate: true })
	}

	try {
		// @ts-expect-error parseOptions
		await command[handler]?.(interaction.bot, interaction, parseOptions(interaction))
	} catch (e) {
		let content = cleanToken(`Something failed back here... Debug info below\`\`\`${Deno.inspect(e, InspectConfig)}`)

		if (content.length > 1997) content = content.slice(0, 1996) + "…"
		content += "```"

		console.botLog(e, { logLevel: "ERROR", tag: "HandleError" })

		if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) return
		await interaction.respond(stripColor(content).replaceAll(Deno.cwd(), "Endo"), { isPrivate: true }).catch()
	}
}

function cleanToken(content: string) {
	for (const token of ["DiscordToken", "Weather", "Nomics", "Genius", "ScrapingAnt", "RapidAPI"]) {
		content = content.replaceAll(Deno.env.get(token) ?? "", `[${token}]`)
	}

	return content
}

const handlerMap = (interaction: Interaction) => ({
	[InteractionTypes.ApplicationCommand]: "main",
	[InteractionTypes.ApplicationCommandAutocomplete]: "autocomplete",
	[InteractionTypes.MessageComponent]: interaction.data?.componentType === MessageComponentTypes.Button ? "button" : "select",
	[InteractionTypes.ModalSubmit]: "modal",
})
