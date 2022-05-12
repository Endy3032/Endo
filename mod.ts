import { deploy } from "Modules"
import { configSync as dotenv } from "dotenv"
import { createBot, EventHandlers, startBot } from "discordeno"

dotenv({ export: true })

const [token, botId] = [Deno.env.get("DiscordToken"), Deno.env.get("DiscordClient")]
if (token === undefined) { throw new Error("Missing Token") }
if (botId === undefined) { throw new Error("Missing Bot ID") }

const bot = createBot({
  token,
  botId: BigInt(botId),
  intents: ["Guilds", "DirectMessages"],
  events: {},
})

for await (const { name: file } of Deno.readDir("./Events")) {
  if (!file.endsWith(".ts")) continue
  const { name, execute } = await import(`./Events/${file}`)
  bot.events[name as keyof EventHandlers] = execute
}

deploy(bot, Deno.args)
await startBot(bot)
