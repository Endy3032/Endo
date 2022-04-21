import {
  configSync as dotenv, // dotenv
  readdirSync, // fs
  ApplicationCommandOption, ApplicationCommandOptionTypes, ApplicationCommandTypes, Bot,
  CreateApplicationCommand, CreateContextApplicationCommand, upsertApplicationCommands, // discordeno
} from "../deps.ts"

dotenv({ export: true })
const env = Deno.env.toObject()

type ApplicationCommand = CreateApplicationCommand | CreateContextApplicationCommand

function replaceDescription(cmd: ApplicationCommand, tag: string) {
  if (cmd.type == ApplicationCommandTypes.Message || cmd.type == ApplicationCommandTypes.User) {
    cmd.name = `[${tag.charAt(0)}] ${cmd.name}`
    return cmd
  }

  cmd = cmd as CreateApplicationCommand
  cmd.description = `[${tag}] ${cmd.description} [${tag}]`
  cmd.options?.forEach((option: ApplicationCommandOption) => {
    if (option.type == ApplicationCommandOptionTypes.SubCommandGroup) {
      option.options?.forEach((suboption: ApplicationCommandOption) => {
        suboption.description = `[${tag}] ${suboption.description} [${tag}]`
      })
    } else if (option.type == ApplicationCommandOptionTypes.SubCommand) {
      option.description = `[${tag}] ${option.description} [${tag}]`
    }
  })

  return cmd
}

export const deploy = async (bot: Bot, args: string[]) => {
  if (args.includes("guilds")) {
    const guildFolders = readdirSync("../Commands/Guilds")
    guildFolders.forEach((guildID: string) => {
      var commands = [] as ApplicationCommand[]
      const commandFiles = readdirSync(`../Commands/Guilds/${guildID}`).filter(file => file.endsWith(".ts"))

      commandFiles.forEach(async command => {
        const { cmd } = await import(`../Commands/Guilds/${guildID}/${command}`)
        commands.push(replaceDescription(cmd, "G"))
      })

      upsertApplicationCommands(bot, commands, BigInt(guildID))
    })
  }

  if (args.includes("global") || args.includes("test")) {
    var testCommands = [] as ApplicationCommand[]
    var globalCommands = [] as ApplicationCommand[]
    const commandFiles = readdirSync("../Commands").filter(file => file.endsWith(".ts"))

    commandFiles.forEach(async command => {
      const { cmd } = await import(`../Commands/${command}`)
      globalCommands.push(cmd)
      if (args.includes("test")) testCommands.push(replaceDescription(cmd, "Dev"))
    })

    upsertApplicationCommands(bot, globalCommands)
    if (args.includes("test")) upsertApplicationCommands(bot, globalCommands, BigInt(env.TestGuild))
  }
}