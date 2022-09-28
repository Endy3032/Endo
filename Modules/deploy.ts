import { ApplicationCommandOption, ApplicationCommandTypes, Bot, CreateApplicationCommand } from "discordeno"
import { BotApplicationCommand, getFiles } from "modules"

const { TestGuild } = Deno.env.toObject()

const replaceDescription = (cmd: BotApplicationCommand, tag: string) => {
	if (cmd.type == ApplicationCommandTypes.Message || cmd.type == ApplicationCommandTypes.User) {
		cmd.name = `[${tag.charAt(0)}] ${cmd.name}`
		return cmd
	}

	cmd = cmd as CreateApplicationCommand
	cmd.description = `[${tag}] ${cmd.description}`
	cmd.options?.forEach((opt: ApplicationCommandOption) => {
		opt.description = `[${tag}] ${opt.description} [${tag}]`
		opt.options?.forEach((subopt: ApplicationCommandOption) => {
			subopt.description = `[${tag}] ${subopt.description} [${tag}]`
		})
	})
	return cmd
}

export const deploy = async (bot: Bot, args: string[]) => {
	if (args.includes("guilds")) {
		const guildFolders = getFiles("./Commands/Guilds", "folders")

		for await (const guildID of guildFolders) {
			const commands: BotApplicationCommand[] = []
			const commandFiles = getFiles(`./Commands/Guilds/${guildID}`)

			for await (const command of commandFiles) {
				if (command == "mod.ts") continue
				const { cmd } = await import(`/Commands/Guilds/${guildID}/${command}`)
				commands.push(replaceDescription(cmd, "G"))
			}

			const deployed = await bot.helpers.upsertApplicationCommands(commands, BigInt(guildID))
			console.tagLog("Deploy", `${deployed.size} commands to ${guildID}`)
		}
	}

	if (args.some(arg => ["global", "test"].includes(arg))) {
		const { commands } = await import("/Commands/mod.ts")
		const botCommands = commands.array().map(command => command.cmd)

		if (args.includes("global")) {
			const deployed = await bot.helpers.upsertApplicationCommands(botCommands)
			console.tagLog("Deploy", `${deployed.size} global commands`)
		}

		if (args.includes("test")) {
			if (TestGuild === undefined) return console.tagLog("Deploy", "Failed to register test commands [Test Guild ID Not Provided]")
			const testCommands = [...botCommands.map(command => replaceDescription(command, "Dev"))]
			const deployed = await bot.helpers.upsertApplicationCommands(testCommands, BigInt(TestGuild))
			console.tagLog("Deploy", `${deployed.size} test commands`)
		}
	}
}
