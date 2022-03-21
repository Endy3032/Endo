const fs = require("fs")
const keepAlive = require("./server")
const stripAnsi = require("strip-ansi")
const { nordChalk } = require("./modules")
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] })
var logStream = fs.createWriteStream("./logs/botlog.log", { flags: "a" })

console.botLog = async (content, logLevel = "INFO", embed = null) => {
  const date = new Date()
  const epoch = Math.floor(date.getTime() / 1000)
  const channel = client.channels.cache.get(process.env.Log)

  logLevelColors = {
    INFO: nordChalk.info,
    WARN: nordChalk.warn,
    ERROR: nordChalk.error,
    DEBUG: nordChalk.debug,
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
  }).replace(",", "")

  content = content.replaceAll("\n    ", "\n  ").replaceAll("/Users/enderhoang", "~")
  consoleLog = `${nordChalk.blue(logTime)} ${logLevelColors[logLevel](logLevel.padEnd(5, " "))} ${nordChalk.blue(`| ${content}`)}`.replaceAll("\n", nordChalk.blue("\n                             | "))

  console.log(consoleLog)
  logStream.write(stripAnsi(`${consoleLog}\n`))

  content = stripAnsi(content.replaceAll("[ ", "[").replaceAll(" ]", "]"))

  if (logLevel == "ERROR") {
    try {channel.send(`<t:${epoch}:d> <t:${epoch}:T>\`\`\`${content}\`\`\``)} catch {null}
    return
  }

  if (content.includes("youtu.be")) {
    try {channel.send(`**Timestamp** • <t:${epoch}:d> <t:${epoch}:T>\n**Status** • Streaming lofi - ${content.split(" Streaming lofi ")[1]}`)} catch {null}
    return
  }

  if (embed == null) {
    embed = {
      description: `**Timestamp** • <t:${epoch}:d> <t:${epoch}:T>\n**${logLevel.charAt(0).toUpperCase() + logLevel.slice(1).toLowerCase()}**${logLevel.includes("WARN") ? `\`\`\`${content}\`\`\`` : ` • ${content}`}`,
      timestamp: date.toISOString()
    }
  }

  if (embed.timestamp == null) embed.timestamp = date.toISOString()

  if (!embed.description.includes("**Timestamp** • ")) embed.description = `**Timestamp** • <t:${epoch}:d> <t:${epoch}:T>\n${embed.description}`
  try {channel.send({ embeds: [embed] })} catch {null}
}

console.tagLog = async (tag, content) => {
  console.botLog(`${nordChalk.bright.cyan(`[${tag}]`)} ${content}`)
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

client.login(process.env.Token)
keepAlive()

process.setMaxListeners(0)

// console.log(client.commands)
// DELETE ALL COMMANDS
// client.application.commands.set([])