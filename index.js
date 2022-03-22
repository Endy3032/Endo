const fs = require("fs")
const keepAlive = require("./server")
const stripAnsi = require("strip-ansi")
const { capitalize, nordChalk } = require("./modules")
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel] })
const logStream = fs.createWriteStream("./logs/botlog.log", { flags: "a" })

console.botLog = async (content, logLevel = "INFO", embed = null) => {
  const date = new Date()
  const epoch = date.getTime()
  const channel = client.channels.cache.get(process.env.Log)
  content = content.replaceAll("    ", "  ").replaceAll(process.cwd(), "EndyJS")

  logLevelColors = {
    INFO: nordChalk.info,
    WARN: nordChalk.warn,
    ERROR: nordChalk.error,
    DEBUG: nordChalk.debug,
  }

  logTime = date.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, fractionalSecondDigits: 2
  }).replace(",", "")

  console.log(consoleLog = nordChalk.blue(`${logTime} ${logLevelColors[logLevel](logLevel.padEnd(5, " "))} ${`| ${content}`}`.replaceAll("\n", "\n                             | ")))
  logStream.write(stripAnsi(`${consoleLog}\n`))

  content = stripAnsi(content.replaceAll("[ ", "[").replaceAll(" ]", "]"))

  if (logLevel == "ERROR") {
    return channel.send(`**Timestamp** • ${epoch}\`\`\`${content}\`\`\``)
      .catch(err => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``))
  }

  if (content.includes("youtu.be")) {
    return channel.send(`**Timestamp** • ${epoch}\n**Status** • Streaming lofi - ${content.split(" Streaming lofi ")[1]}`)
      .catch(err => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``))
  }

  if (!embed) {
    embed = {
      description: `**Timestamp** • ${epoch}\n**${capitalize(logLevel)}**${logLevel.includes("WARN") ? `\`\`\`${content}\`\`\`` : ` • ${content}`}`,
      timestamp: date.toISOString()
    }
  }

  if (!embed.timestamp) embed.timestamp = date.toISOString()
  if (!embed.description.includes("**Timestamp** • ")) embed.description = `**Timestamp** • ${epoch}\n${embed.description}`
  try {channel.send({ embeds: [embed] })} catch{err => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``)}
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
// DELETE ALL COMMANDS: client.application.commands.set([])