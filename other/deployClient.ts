import dotenv from "dotenv"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import fs from "fs"

dotenv.config()
// const commands = [].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN)

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

commandFiles.forEach(command => {
  const cmd = require(`../commands/${command}`)
  commands.push(cmd.cmd)
});

(async () => {
  try {
    console.log("Started refreshing commands.")
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT),
      { body: commands },
    )

    console.log(`Successfully registered ${commandFiles.length} application commands.`)
  } catch (err) {console.error(err)}
})()