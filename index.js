const fs = require("fs")
const chalk = require("chalk")
const keepAlive = require("./server.js")
const { Client, Collection, GatewayIntentBits } = require("discord.js")

var logStream = fs.createWriteStream("./logs/botlog.log", { flags: "a" })
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

async function log(content, logLevel = "INFO") {
  const channel = client.channels.cache.get(process.env.LOG)
  const date = new Date()
  epoch = Math.floor(date.getTime() / 1000)

  logLevelColors = {
    INFO: chalk.green(logLevel),
    WARN: chalk.yellow(logLevel),
    ERROR: chalk.red(logLevel),
    DEBUG: chalk.blue(logLevel),
  }

  logTime = date.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 2
  })

  console.log(`${chalk.blue(logTime)} ${logLevelColors[logLevel]} > ${content}`)
  logStream.write(`${logTime.replace(",", "")} ${logLevel} > ${content}\n`)
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