import { ApplicationCommandTypes, Bot, CreateApplicationCommand } from "discordeno"
import { getFiles } from "./utils.ts"

const testGuild = Deno.env.get("TestGuild")

export async function deploy(bot: Bot) {
	const args = Deno.args

	// TODO Finalize this later
	if (args.includes("guilds")) {
		const guildFolders = getFiles("./commands/guilds", { fileTypes: "folders" })

		for await (const guildID of guildFolders) {
			const { commands } = await import(`../commands/guilds/${guildID}/mod.ts`)
			const guildCommands: CreateApplicationCommand[] = commands.map(command => replaceDescription(command.cmd, "G"))
			const deployed = await bot.helpers.upsertGuildApplicationCommands(BigInt(guildID), guildCommands)
			console.botLog(`${deployed.size} guild commands [${guildID}]`, { tag: "Deploy", noSend: true })
		}
	}

	if (!args.some(arg => ["global", "test"].includes(arg))) return

	const { commands } = await import("../commands/mod.ts")

	if (args.includes("global")) {
		bot.helpers.upsertGlobalApplicationCommands(commands)
			.then(deployed => console.botLog(`${deployed.size} commands`, { tag: "GlobalDeploy", noSend: true }))
	}

	if (args.includes("test")) {
		if (!testGuild) return console.botLog("Dev Guild ID Not Provided", { tag: "DevDeploy", noSend: true })

		bot.helpers.upsertGuildApplicationCommands(BigInt(testGuild), commands.map(command => replaceDescription(command, "DEV")))
			.then(deployed => console.botLog(`${deployed.size} commands`, { tag: "DevDeploy", noSend: true }))
	}
}

function replaceDescription(cmd: CreateApplicationCommand, tag: string) {
	if (cmd.type && cmd.type !== ApplicationCommandTypes.ChatInput) {
		cmd.name = `[${tag.charAt(0)}] ${cmd.name}`
		return cmd
	}

	cmd.description = `${tag}_${cmd.description}`
	cmd.options?.forEach(opt => {
		opt.description = `${tag}_${opt.description}_${tag}`
		opt.options?.forEach(subopt => subopt.description = `${tag}_${subopt.description}_${tag}`)
	})
	return cmd
}
