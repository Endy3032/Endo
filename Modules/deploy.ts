import { ApplicationCommandOption, ApplicationCommandOptionTypes, ApplicationCommandTypes, Bot, CreateApplicationCommand, CreateContextApplicationCommand, upsertApplicationCommands, } from "discordeno"

const env = Deno.env.toObject()

type ApplicationCommand = CreateApplicationCommand | CreateContextApplicationCommand

const replaceDescription = (cmd: ApplicationCommand, tag: string) => {
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
    const guildFolders = Deno.readDir("./Commands/Guilds")
    for await (const { name: guildID } of guildFolders) {
      var commands = [] as ApplicationCommand[]
      const commandFiles = [...Deno.readDirSync(`./Commands/Guilds/${guildID}`)].filter((file: Deno.DirEntry) => file.name.endsWith(".ts")).map((file: Deno.DirEntry) => file.name)

      for await (const command of commandFiles) {
        const { cmd } = await import(`./Commands/Guilds/${guildID}/${command}`)
        commands.push(replaceDescription(cmd, "G"))
      }

      upsertApplicationCommands(bot, commands, BigInt(guildID))
    }
  }

  if (args.includes("global") || args.includes("test")) {
    var testCommands = [] as ApplicationCommand[]
    var globalCommands = [] as ApplicationCommand[]
    const commandFiles = [...Deno.readDirSync("./Commands")].filter((file: Deno.DirEntry) => file.name.endsWith(".ts")).map((file: Deno.DirEntry) => file.name)

    for await (const command of commandFiles) {
      const { cmd } = await import(`./Commands/${command}`)
      if (args.includes("global")) globalCommands.push(cmd)
      if (args.includes("test")) testCommands.push(replaceDescription(cmd, "Dev"))
    }

    if (args.includes("global"))
      upsertApplicationCommands(bot, globalCommands)
        .then(collection => console.log(`Deployed ${collection.size} test commands`))

    if (args.includes("test"))
      upsertApplicationCommands(bot, globalCommands, BigInt(env.TestGuild))
        .then(collection => console.log(`Deployed ${collection.size} test commands`))
  }
}
