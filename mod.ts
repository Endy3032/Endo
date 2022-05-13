import { deploy } from "Modules"
import { createBot, EventHandlers, startBot } from "discordeno"

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

for await (const conn of Deno.listen({ port: 8080 })) {
  for await (const req of Deno.serveHttp(conn)) {
    req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
  }
}
