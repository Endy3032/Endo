// import "./log.ts"
import { createBot, EventHandlers, Intents, startBot } from "discordeno"
import { activities, getFiles, InspectConfig } from "modules"

const token = Deno.env.get("DiscordToken")
if (token === undefined) throw new Error("Missing Token")

const bot = createBot({
	token,
	intents: Intents.Guilds | Intents.DirectMessages,
	events: {},
})

const activity = activities()
bot.gateway.manager.createShardOptions.makePresence = () => activity

for await (const file of getFiles("./events")) {
	const { name, main } = await import(`./events/${file}`)
	bot.events[name as keyof EventHandlers] = main
}

if (Deno.args.includes("debug")) {
	bot.rest.debug = (text: string) => {
		const tag = text.match(/(?<=\[)\S.*?(?=\])/)?.[0]
		let content = text.match(/(?<=(^\[\S.*?] )).*/)?.[0]

		if (tag?.includes("RequestCreate")) {
			const json = content?.match(/(?<=( \| Body: )).*/)?.[0] ?? ""
			content = content?.replace(" | Body: " + json, "\n") + Deno.inspect(JSON.parse(json != "undefined" ? json : "{}"), InspectConfig)
		} else if (tag?.includes("FetchSuccess")) {
			const matched = content?.match(/(?<=^(URL: .*? \| )).*/)?.[0] ?? ""
			content = content?.replace(" | " + matched, "\n")

			const json = JSON.parse(matched)
			if (json.payload?.body) {
				try {
					json.payload.body = JSON.parse(json.payload.body)
				} catch {}
			}
			content += Deno.inspect(json, InspectConfig)
		} else if (tag?.includes("fetchSuccess") || tag?.includes("Add To Global Queue")) {
			const json = JSON.parse(content ?? "\n")
			if (json.payload?.body) {
				try {
					json.payload.body = JSON.parse(json.payload.body)
				} catch {}
			}
			content = Deno.inspect(json, InspectConfig)
		}

		console.botLog(content, { noSend: true, logLevel: "DEBUG", tag })
	}
}

export { bot }
