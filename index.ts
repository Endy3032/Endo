import * as fs from "fs"
import * as chalk from "chalk"
import keepAlive from "./server"
import { Client, Collection, GatewayIntentBits, TextChannel } from "discord.js"
import * as dotenv from "dotenv"
dotenv.config()

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>
  }
}

const logStream = fs.createWriteStream("./logs/botlog.log", { flags: "a" })
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

async function log(content: String, logLevel: String = "INFO") {
  const channel = client.channels.cache.get(process.env.LOG as string) as TextChannel
  const date = new Date()

  const epoch = Math.floor(date.getTime() / 1000)
  const rtime = date.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  const console_log = `${chalk.blue(rtime)} ${logLevel} > ${content}`
  console.log(console_log)
  logStream.write(console_log + "\n")
  channel.send(`[<t:${epoch}:d> <t:${epoch}:T>] ${content}`)
}

client.commands = new Collection()
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`)
  client.commands.set(command.cmd.name, command)
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
eventFiles.forEach((file) => {
  const event = require(`./events/${file}`)

  event.once
    ? client.once(event.name, (...args) => event.execute(...args))
    : client.on(event.name, (...args) => event.execute(...args))
})

keepAlive()
client.login(process.env.TOKEN)

export default log

// console.log(client.commands)
// DELETE ALL COMMANDS
// client.application.commands.set([])