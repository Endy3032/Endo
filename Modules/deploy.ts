import { getFiles } from "Modules"
import { ApplicationCommandOption, ApplicationCommandTypes, Bot, CreateApplicationCommand, CreateContextApplicationCommand, upsertApplicationCommands, } from "discordeno"

const env = Deno.env.toObject()
type ApplicationCommand = CreateApplicationCommand | CreateContextApplicationCommand

const replaceDescription = (cmd: ApplicationCommand, tag: string) => {
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
    const guildFolders = getFiles("./Commands/Guilds")

    for await (const guildID of guildFolders) {
      var commands = [] as ApplicationCommand[]
      const commandFiles = getFiles(`./Commands/Guilds/${guildID}`)

      for await (const command of commandFiles) {
        const { cmd } = await import(`./Commands/Guilds/${guildID}/${command}`)
        commands.push(replaceDescription(cmd, "G"))
      }

      upsertApplicationCommands(bot, commands, BigInt(guildID))
    }
  }

  if (args.includes("global") || args.includes("test")) {
    var commands = [] as ApplicationCommand[]
    var testCommands = [] as ApplicationCommand[]

    const commandFiles = getFiles("./Commands")
    for await (const command of commandFiles) {
      const { cmd } = await import(`./Commands/${command}`)
      if (args.includes("global")) commands.push(cmd)
      if (args.includes("test")) testCommands.push(replaceDescription(cmd, "Dev"))
    }

    if (args.includes("global")) {
      const deployed = await upsertApplicationCommands(bot, commands)
      console.log(`Deployed ${deployed.size} test commands`)
    }

    if (args.includes("test")) {
      const deployed = await upsertApplicationCommands(bot, testCommands, BigInt(env.TestGuild))
      console.log(`Deployed ${deployed.size} test commands`)
    }
  }
}
