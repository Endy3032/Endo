import "dotenv/config"
import keepAlive from "./server"
import stripAnsi from "strip-ansi"
import { RateLimitData } from "@discordjs/rest"
import { APIEmbed } from "discord-api-types/v10"
import { Temporal } from "@js-temporal/polyfill"
import { createWriteStream, readdirSync } from "fs"
import { capitalize, nordChalk, nordLog } from "./Modules"
import { Client, Collection, GatewayIntentBits, Options, Partials, BaseGuildTextChannel } from "discord.js"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages], partials: [Partials.Channel],
  makeCache: Options.cacheWithLimits({
    BaseGuildEmojiManager: 25,
    GuildEmojiManager: 25,
    GuildMemberManager: 25,
    MessageManager: 50,
    ThreadManager: 10,
    ThreadMemberManager: 25,
    UserManager: 50,
    VoiceStateManager: 0
  })
})

const logStream = createWriteStream("./Resources/discord.log", { flags: "a" })
console.botLog = async (content: string, logLevel = "info", embed?: APIEmbed) => {
  const date = Temporal.Now.instant()
  const epoch = date.epochMilliseconds
  const channel = client.channels.cache.get(process.env.Log as string) as BaseGuildTextChannel
  content = content.replaceAll(process.cwd(), "EndyJS").replaceAll("    ", "  ")
  logLevel = logLevel.toLowerCase()

  const logTime = date.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, fractionalSecondDigits: 2
  }).replace(",", "")

  const consoleLog = nordChalk.blue(`${logTime} ${nordChalk[logLevel](logLevel.padEnd(5, " ").toUpperCase() as string)} ${`| ${content}`}`.replaceAll("\n", "\n                             | "))
  console.log(consoleLog)
  logStream.write(stripAnsi(`${consoleLog}\n`))

  content = stripAnsi(content.replaceAll("[ ", "[").replaceAll(" ]", "]"))

  if (logLevel == "error") {
    return channel.send(`**Timestamp** • ${epoch}\`\`\`${content}\`\`\``)
      .catch((err: Error) => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``))
  }

  if (content.includes("youtu.be")) {
    return channel.send(`**Timestamp** • ${epoch}\n**Status** • Streaming lofi - ${content.split(" Streaming lofi ")[1]}`)
      .catch((err: Error) => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``))
  }

  if (!embed) {
    embed = {
      description: `**Timestamp** • ${epoch}\n**${capitalize(logLevel)}**${logLevel.includes("WARN") ? `\`\`\`${content}\`\`\`` : ` • ${content}`}`,
      timestamp: date.toString()
    }
  }

  if (!embed.timestamp) embed.timestamp = date.toString()
  if (!embed.description?.includes("**Timestamp** • ")) embed.description = `**Timestamp** • ${epoch}\n${embed.description}`
  try {channel.send({ embeds: [embed] })}
  catch {(err: { stack: any }) => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``)}
}

console.tagLog = async (tag: string, content: string) => {
  console.botLog(`${nordChalk.bright.cyan(`[${tag}]`)} ${content}`)
}

client.commands = new Collection()
const commandFiles = readdirSync("./Commands").filter((file) => file.endsWith(".ts"))
commandFiles.forEach(async file => {
  const command = await import(`./Commands/${file}`)
  client.commands.set(command.cmd.name, command)
})

const eventFiles = readdirSync("./Events").filter((file) => file.endsWith(".ts"))
eventFiles.forEach(async file => {
  const event = await import(`./Events/${file}`)
  event.once
    ? client.once(event.name, (...args) => event.execute(...args))
    : client.on(event.name, (...args) => event.execute(...args))
})

client.rest.on("rateLimited", (rateLimit: RateLimitData) => {
  console.botLog(`${nordChalk.cyan("[RateLimit]")} Ends in: ${(rateLimit.timeToReset/1000).toFixed(2)}s\nRequests left ${rateLimit.limit}\nGlobal: ${rateLimit.global}`, "WARN")
})

client.login(process.env.Token as string)
keepAlive()

process.setMaxListeners(0)

// console.log(client.commands)
// DELETE ALL COMMANDS: client.application.commands.set([])