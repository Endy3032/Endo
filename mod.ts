import { deploy, getFiles } from "Modules"
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

for await (const file of getFiles("./Events")) {
  const { name, execute } = await import(`./Events/${file}`)
  bot.events[name as keyof EventHandlers] = execute
}

await deploy(bot, Deno.args)
await startBot(bot)

const listener = Deno.listen({ port: 8080 })
console.log("Server Ready")

for await (const conn of listener) {
  for await (const req of Deno.serveHttp(conn)) {
    req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
  }
}
