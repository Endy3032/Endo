import "log"
import "jsx"
import bot from "bot"
import { deploy } from "modules"
import eventHandlers from "./events/mod.ts"
import { fixGatewayWebsocket } from "./fixGateway.ts"

// console.clear()
bot.events = eventHandlers
fixGatewayWebsocket(bot.gateway)

await deploy(bot)
await bot.start()

const listener = Deno.listen({ port: 8080 })
console.botLog("Server", { tag: "Ready", noSend: true })

for await (const conn of listener) {
	for await (const req of Deno.serveHttp(conn)) {
		req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
	}
}
