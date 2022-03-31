/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs"
import "dotenv/config"
import flags from "flags"
import { deployLog } from "./Modules"
import { REST } from "@discordjs/rest"
import { APIApplicationCommand, APIApplicationCommandOption } from "discord-api-types/v10"
import { ApplicationCommandOptionType } from "discord.js"

flags.defineString("mode", "global", "The mode to deploy the commands.")
flags.parse()
const mode = flags.get("mode")

const rest = new REST({ version: "10" }).setToken(process.env.Token as string)
deployLog("Deploy", "Refreshing application commands...")

function replaceDescription(cmd: APIApplicationCommand, tag: string) {
  if (cmd.type == 2 || cmd.type == 3) {cmd.name = `[${tag.charAt(0)}] ${cmd.name}`; return cmd}
  cmd.description = `[${tag}] ${cmd.description} [${tag}]`
  cmd.options?.forEach((sub1: APIApplicationCommandOption) => {
    if (sub1.type == ApplicationCommandOptionType.Subcommand) {
      sub1.description = `[${tag}] ${sub1.description} [${tag}]`
    } else if (sub1.type == ApplicationCommandOptionType.SubcommandGroup) {
      sub1.options?.forEach(sub2 => {
        sub2.description = `[${tag}] ${sub2.description} [${tag}]`
      })
    }
  })

  return cmd
}

async function registerCommands(cmd: APIApplicationCommand[], client: string, guildID: string | null = null) {
  const route: `/${string}` = `/applications/${client}/${guildID != null ? `guilds/${guildID}/` : ""}commands`
  try {
    await rest.put(route, { body: cmd })
      .then(() => deployLog("Deploy", `Registered ${cmd.length} ${mode} commands.`))
  } catch (err) {
    console.error(err)
  }
}

if (mode != "guilds") {
  var commands = [] as APIApplicationCommand[] //.map(command => command.toJSON());
  const commandFiles = fs.readdirSync("./Commands").filter(file => file.endsWith(".ts"))

  commandFiles.forEach(command => {
    let { cmd } = require(`./Commands/${command}`)
    if (mode == "test") cmd = replaceDescription(cmd, "Dev")
    commands.push(cmd)
  })

  registerCommands(commands, process.env.Client as string, mode == "test" ? process.env.TestGuild as string : null)
} else {
  const guildFolders = fs.readdirSync("./Commands/guilds")
  guildFolders.forEach(guildID => {
    var commands = [] as APIApplicationCommand[]
    const commandFiles = fs.readdirSync(`./Commands/guilds/${guildID}`).filter(file => file.endsWith(".ts"))

    commandFiles.forEach(command => {
      let { cmd } = require(`./Commands/guilds/${guildID}/${command}`)
      cmd = replaceDescription(cmd, "G")
      commands.push(cmd)
    })

    registerCommands(commands, process.env.Client as string, guildID)
  })
}
