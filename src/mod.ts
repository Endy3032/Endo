import "jsx"
import "log"
import { bot } from "bot"
import { startBot } from "discordeno"
import { deploy } from "modules"

// console.clear()
await deploy(bot)
await startBot(bot)

const listener = Deno.listen({ port: 8080 })
console.botLog("Server", { tag: "Ready", noSend: true })

async function http(conn: Deno.Conn) {
	for await (const req of Deno.serveHttp(conn)) req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
}

for await (const conn of listener) http(conn)
