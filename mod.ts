import { Temporal } from "temporal"
import { rgb24, stripColor } from "colors"
import { activities, BrightNord, capitalize, deploy, getFiles, LogLevel, Nord } from "Modules"
import { createBot, CreateMessage, Embed, EventHandlers, sendMessage, startBot } from "discordeno"

const [token, botId] = [Deno.env.get("DiscordToken"), Deno.env.get("DiscordClient")]
if (token === undefined) { throw new Error("Missing Token") }
if (botId === undefined) { throw new Error("Missing Bot ID") }

const bot = createBot({
  token,
  botId: BigInt(botId),
  intents: ["Guilds", "DirectMessages"],
  events: {},
})

// #region Logging stuff
const send = async (body: CreateMessage, epoch: number) => {
  const channelID = Deno.env.get("Log")
  if (channelID === undefined) throw new Error("Log Channel ID Not Found")
  sendMessage(bot, BigInt(channelID), body)
    .catch((err: Error) => {
      console.log(err)
      sendMessage(bot, BigInt(channelID), { content: `**Timestamp** • ${epoch}\`\`\`${err.stack}\`\`\`` })
    })
}

console.localLog = (content: string, logLevel: LogLevel = "INFO", log = true) => {
  const temporal = Temporal.Now.instant()

  const logTime = temporal.toLocaleString("default", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, fractionalSecondDigits: 2
  }).replace(",", "")

  const logColor = Nord[logLevel.toLowerCase()]

  content.replaceAll(Deno.cwd(), "EndyJS").replaceAll("    ", "  ").replaceAll("\n", "\n                             | ")
  content = rgb24(`${logTime} ${rgb24(logLevel.padStart(5, " "), logColor)} | ${content}`, Nord.blue)

  if (log) console.log(content)
  return { content, temporal }
}

console.tagLog = (tag: string, content: string, logLevel: LogLevel = "INFO") => console.localLog(`${rgb24(`[${tag}]`, BrightNord.cyan)} ${content}`, logLevel)

console.botLog = async (content: string, logLevel: LogLevel = "INFO", embed?: Embed) => {
  const { content: consoleLog, temporal } = console.localLog(content, logLevel, false)
  const epoch = temporal.epochMilliseconds

  console.log(consoleLog)
  await Deno.writeTextFile("./Resources/discord.log", stripColor(`${consoleLog}\n`), { append: true })
  content = stripColor(content)

  if (logLevel == "ERROR") return await send({ content: `**Timestamp** • ${epoch}\`\`\`${content}\`\`\`` }, epoch)
  if (content.includes("youtu.be")) return await send({ content: `**Timestamp** • ${epoch}\n**Status** • Streaming lofi - ${content.split(" Streaming lofi ")[1]}` }, epoch)
  if (!embed) {
    embed = {
      description: `**Timestamp** • ${epoch}\n**${capitalize(logLevel)}**${logLevel.includes("WARN") ? `\`\`\`${content}\`\`\`` : ` • ${content}`}`,
      timestamp: epoch
    }
  }
  if (!embed.timestamp) embed.timestamp = epoch
  if (!embed.description?.includes("**Timestamp** • ")) embed.description = `**Timestamp** • ${epoch}\n${embed.description}`
  send({ embeds: [embed] }, epoch)
}
// #endregion

for await (const file of getFiles("./Events")) {
  const { name, execute } = await import(`./Events/${file}`)
  bot.events[name as keyof EventHandlers] = execute
}

bot.gateway.presence = activities

await deploy(bot, Deno.args)
await startBot(bot)

const listener = Deno.listen({ port: 8080 })
console.tagLog("Ready", "Server")

for await (const conn of listener) {
  for await (const req of Deno.serveHttp(conn)) {
    req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
  }
}