import "dotenv/config"
var flags = require("flags")

import fs from "fs"
import { deployLog } from "./modules"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"

flags.defineString("mode", "global", "The mode to deploy the commands.")
flags.parse()

const mode = flags.get("mode")
const rest = new REST({ version: "10" }).setToken(process.env.Token as string)
deployLog("Deploy", "Refreshing application commands...")

if (mode != "guilds") {
  let commands = [] as any //.map(command => command.toJSON());
  const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

  commandFiles.forEach(command => {
    let { cmd } = require(`./commands/${command}`)

    if (mode == "test") {
      if (cmd.type == 1 || cmd.type == null) {
        cmd.description = `[Development] ${cmd.description} [Development]`
        if (cmd.options) {cmd.options.forEach((option: { description: string; options: any[] }) => {
          option.description = `[Development] ${option.description} [Development]`
          if (option.options) option.options.forEach(option => {option.description = `[Development] ${option.description} [Development]`})
        })}
      } else if (cmd.type == 2 || cmd.type == 3) cmd.name = `[D] ${cmd.name}`
    }

    commands.push(cmd)
  });

  (async () => {
    try {
      await rest.put(
        mode == "global"
          ? Routes.applicationCommands(process.env.Client as string)
          : Routes.applicationGuildCommands(process.env.Client as string, process.env.TestGuild as string),
        { body: commands },
      )
      deployLog("Deploy", `Registered ${commandFiles.length} ${mode} commands.`)
    } catch (err) {console.error(err)}
  })()
} else {
  const guildFolders = fs.readdirSync("./commands/guilds")

  guildFolders.forEach(guildId => {
    let commands = [] as any
    const commandFiles = fs.readdirSync(`./guilds/${guildId}`).filter(file => file.endsWith(".js"))

    commandFiles.forEach(command => {
      let { cmd } = require(`./commands/guilds/${guildId}/${command}`)

      if (cmd.type == 1 || cmd.type == null) {
        cmd.description = `[G] ${cmd.description}`
        if (cmd.options) {cmd.options.forEach(option => {
          option.description = `[G] ${option.description}`
          if (option.options) option.options.forEach(option => {option.description = `[G] ${option.description}`})
        })}
      } else if (cmd.type == 2 || cmd.type == 3) cmd.name = `[G] ${cmd.name}`

      commands.push(cmd)
    });

    (async () => {
      try {
        await rest.put(
          Routes.applicationGuildCommands(process.env.Client as string, guildId),
          { body: commands },
        )
        deployLog("Deploy", `Registered ${commandFiles.length} guild[${guildId}] commands.`)
      }
      catch (error) {console.error(error)}
    })()
  })
}
