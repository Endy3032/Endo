import dotenv from "dotenv"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import fs from "fs"

dotenv.config()
// const commands = [].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
console.log(commandFiles)
commandFiles.forEach(command => {
  const cmd = require(`../commands/${command}`)
  commands.push(cmd.cmd)
})

commands.forEach(command => {
  if (command.type == 1 || command.type == null) {
    command.description = `[GUILD!!!!!] ${command.description} [GUILD!!!!!]`
    if (command.options) {command.options.forEach(option => {
      option.description = `[GUILD!!!!!] ${option.description} [GUILD!!!!!]`
      if (option.options) {
        option.options.forEach(option => {
          option.description = `[GUILD!!!!!] ${option.description} [GUILD!!!!!]`
        })
      }
    })}

    // console.log(command)
  } else if (command.type == 2 || command.type == 3) {
    command.name = `[G] ${command.name}`
  }
});

(async () => {
  try {
    console.log("Started refreshing commands.")
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD),
      { body: commands },
    )

    console.log(`Successfully registered ${commandFiles.length} application commands.`)
  } catch (err) {console.error(err)}
})()