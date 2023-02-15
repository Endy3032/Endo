import { rgb24, stripColor } from "colors"
import { stripIndents } from "commonTags"
import { createBot, EventHandlers, Intents, startBot } from "discordeno"
import { activities, deploy, getFiles, InspectConfig, LogLevel, LogOptions, Nord } from "modules"
import { Temporal } from "temporal"

import "./log.ts"
import "jsx"
import { bot } from "bot"

console.clear()
await deploy(bot, Deno.args)
await startBot(bot)

const listener = Deno.listen({ port: 8080 })
console.botLog("Server", { tag: "Ready", noSend: true })

async function http(conn: Deno.Conn) {
	for await (const req of Deno.serveHttp(conn)) req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
}

for await (const conn of listener) http(conn)
