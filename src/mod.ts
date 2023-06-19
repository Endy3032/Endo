import "log"
import "jsx"
import bot from "bot"
import { activities, deploy } from "modules"
import eventHandlers from "./events/mod.ts"

if (!Deno.args.includes("noClear")) console.clear()
bot.events = eventHandlers

const activity = activities()
const baseSet = bot.gateway.shards.set.bind(bot.gateway.shards)

bot.gateway.shards.set = (key, value) => {
	value.makePresence = () => Promise.resolve(activity)
	return baseSet(key, value)
}

await deploy(bot)
await bot.start()

const listener = Deno.listen({ port: 8080 })
console.botLog("Server", { tag: "Ready", noSend: true })

for await (const conn of listener) {
	for await (const req of Deno.serveHttp(conn)) {
		req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
	}
}
