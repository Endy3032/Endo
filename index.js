const fs = require("fs")
const dotenv = require("dotenv")
const keepAlive = require("./server.js")
const { Client, Collection, GatewayIntentBits } = require("discord.js")

dotenv.config()

var logStream = fs.createWriteStream("./other/botlog.log", { flags: "a" })

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ]
})

async function log(content) {
  const channel = client.channels.cache.get(process.env.LOG)
  const date = new Date()

  rtime = date.toLocaleString("default", {
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  })

  epoch = Math.floor(date.getTime() / 1000)
  console_log = `[${rtime}] ${content}`

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

module.exports.log = log

// console.log(client.commands)
// DELETE ALL COMMANDS
// client.application.commands.set([])