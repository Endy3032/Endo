import "dotenv/config"
import keepAlive from "./server"
import stripAnsi from "strip-ansi"
import { RateLimitData } from "@discordjs/rest"
import { APIEmbed } from "discord-api-types/v10"
import { Temporal } from "@js-temporal/polyfill"
import { capitalize, nordChalk } from "./Modules"
import { createWriteStream, readdirSync } from "fs"
import { Client, Collection, GatewayIntentBits, Options, Partials, BaseGuildTextChannel, WebhookEditMessageOptions } from "discord.js"

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
const send = async (body: WebhookEditMessageOptions, channel: BaseGuildTextChannel, epoch: number) => channel.send(body).catch((err: Error) => channel.send(`**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\``))

console.localLog = (content: string, logLevel = "info", doLog = true) => {
  const temporalTime = Temporal.Now.instant()
  const logTime = temporalTime.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, fractionalSecondDigits: 2
  }).replace(",", "")

  logLevel = logLevel.toLowerCase()
  content = content.replaceAll(process.cwd(), "EndyJS").replaceAll("    ", "  ").replaceAll("\n", "\n                             | ")

  const log = nordChalk.blue(`${logTime} ${nordChalk[logLevel](logLevel.padEnd(5, " ").toUpperCase())} ${`| ${content}`}`)
  if (doLog) console.log(log)
  return { content: log, temporal: temporalTime }
}

console.botLog = async (content: string, logLevel = "info", embed?: APIEmbed) => {
  const { content: consoleLog, temporal: date } = console.localLog(content, logLevel, false)
  const epoch = date.epochMilliseconds
  const channel = client.channels.cache.get(process.env.Log as string) as BaseGuildTextChannel

  console.log(consoleLog)
  logStream.write(stripAnsi(`${consoleLog}\n`))
  content = stripAnsi(content)

  if (logLevel == "error") return await send({ content: `**Timestamp** • ${epoch}\`\`\`${content}\`\`\`` }, channel, epoch)
  if (content.includes("youtu.be")) return await send({ content: `**Timestamp** • ${epoch}\n**Status** • Streaming lofi - ${content.split(" Streaming lofi ")[1]}` }, channel, epoch)
  if (!embed) {
    embed = {
      description: `**Timestamp** • ${epoch}\n**${capitalize(logLevel)}**${logLevel.includes("WARN") ? `\`\`\`${content}\`\`\`` : ` • ${content}`}`,
      timestamp: date.toString()
    }
  }
  if (!embed.timestamp) embed.timestamp = date.toString()
  if (!embed.description?.includes("**Timestamp** • ")) embed.description = `**Timestamp** • ${epoch}\n${embed.description}`
  send({ embeds: [embed] }, channel, epoch)
}

console.localTagLog = (tag: string, content: string, logLevel = "info") => console.localLog(`${nordChalk.bright.cyan(`[${tag}]`)} ${content}`, logLevel)
console.tagLog = async (tag: string, content: string, logLevel = "info") => console.botLog(`${nordChalk.bright.cyan(`[${tag}]`)} ${content}`, logLevel)

client.commands = new Collection()
readdirSync("./Commands").filter((file) => file.endsWith(".ts")).forEach(async file => {
  const command = await import(`./Commands/${file}`)
  client.commands.set(command.cmd.name, command)
})

readdirSync("./Events").filter((file) => file.endsWith(".ts")).forEach(async file => {
  const event = await import(`./Events/${file}`)
  event.once
    ? client.once(event.name, (...args) => event.execute(...args))
    : client.on(event.name, (...args) => event.execute(...args))
})

client.rest.on("rateLimited", (rateLimit: RateLimitData) => console.botLog(`${nordChalk.cyan("[RateLimit]")} Ends in: ${(rateLimit.timeToReset/1000).toFixed(2)}s\nRequests left ${rateLimit.limit}\nGlobal: ${rateLimit.global}`, "WARN"))

client.login(process.env.Token as string)
keepAlive()

process.setMaxListeners(0)
// DELETE ALL COMMANDS: client.application.commands.set([])
