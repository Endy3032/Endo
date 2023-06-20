import { ApplicationCommandTypes, Bot, CreateApplicationCommand } from "discordeno"
import { getFiles } from "./getFiles.ts"

const testGuild = Deno.env.get("TestGuild")

export async function deploy(bot: Bot) {
	const args = Deno.args

	// TODO Finalize this later
	if (args.includes("guilds")) {
		const guildFolders = getFiles("./commands/guilds", { fileTypes: "folders" })

		for await (const guildID of guildFolders) {
			const { commands } = await import(`../commands/guilds/${guildID}/mod.ts`)
			const guildCommands: CreateApplicationCommand[] = commands.map(command => replaceDescription(command.cmd, "G"))
			const deployed = await bot.rest.upsertGuildApplicationCommands(BigInt(guildID), guildCommands)
			console.botLog(`${deployed.length} guild commands [${guildID}]`, { tag: "Deploy", noSend: true })
		}
	}

	if (!args.some(arg => ["global", "test"].includes(arg))) return

	const { commands } = await import("../commands/mod.ts")

	if (args.includes("global")) {
		const deployed = await bot.rest.upsertGlobalApplicationCommands(commands)
		console.botLog(`${deployed.length} commands`, { tag: "🌐 Deploy", noSend: true })
	}

	if (args.includes("test")) {
		let content = "No Development Guild"

		if (testGuild) {
			const deployed = await bot.rest.upsertGuildApplicationCommands(
				BigInt(testGuild),
				[...commands].map(c => replaceDescription(c, "DEV")),
			)
			content = `${deployed.length} commands`
		}

		console.botLog(content, { tag: "🛠  Deploy", noSend: true })
	}
}

function replaceDescription(cmd: CreateApplicationCommand, tag: string) {
	if (cmd.type && cmd.type !== ApplicationCommandTypes.ChatInput) {
		cmd.name = `[${tag.charAt(0)}] ${cmd.name}`
		return cmd
	}

	cmd.description = `${tag}_${cmd.description}_${tag}`
	cmd.options?.forEach(opt => {
		opt.description = `${tag}_${opt.description}_${tag}`
		opt.options?.forEach(subopt => subopt.description = `${tag}_${subopt.description}_${tag}`)
	})
	return cmd
}
