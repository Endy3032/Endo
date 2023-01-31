import { rgb24, stripColor } from "colors"
import { stripIndents } from "commonTags"
import { createBot, EventHandlers, Intents, startBot } from "discordeno"
import { activities, deploy, getFiles, InspectConfig, LogLevel, LogOptions, Nord } from "modules"
import { Temporal } from "temporal"

const [token, logChannel] = [Deno.env.get("DiscordToken"), Deno.env.get("Log")]
if (token === undefined) throw new Error("Missing Token")

const bot = createBot({
	token,
	intents: Intents.Guilds | Intents.DirectMessages,
	events: {},
})

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

console.botLog = async (content: any, options?: LogOptions) => {
	options = options ?? {}
	const { tag, noSend } = options
	const embed = options.embed ?? {}
	let logLevel: LogLevel = options.logLevel ?? "INFO"

	// Time
	const temporal = Temporal.Now.instant()

	const logTime = temporal.toLocaleString("default", {
		timeZone: "Asia/Ho_Chi_Minh",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h24",
		fractionalSecondDigits: 2,
	}).replace(",", "")

	// Sanitization & Formatting
	if (content instanceof Error) {
		content = content.stack ?? "Unable to capture Error stack"
		logLevel = "ERROR"
	} else if (typeof content !== "string") {
		content = Deno.inspect(content, InspectConfig)
	}

	content = content.replaceAll(Deno.cwd(), "Endo")

	if (tag) content = `${rgb24(`[${tag}]`, Nord.brightOrange)} ${content}`

	const plainLog = stripColor(content)

	const formattedLog = rgb24(logTime, Nord.blue)
		+ rgb24(logLevel.padStart(6, " "), Nord[logLevel.toLowerCase()])
		+ rgb24(" │ ", Nord.blue)
		+ content.replaceAll("\n", "\n" + " ".repeat(29) + rgb24("│ ", Nord.blue))

	// Local logging
	console[logLevel.toLowerCase()](formattedLog)

	Deno.writeTextFileSync(
		`./Resources/${logLevel.toLowerCase()}.log`,
		stripColor(formattedLog) + "\n",
		{ append: true },
	)

	// Discord logging
	if (logChannel === undefined || noSend) return

	try {
		if (!embed.timestamp) embed.timestamp = temporal.epochMilliseconds

		const descriptionInfo = `**${logLevel}**│\`${temporal.epochMilliseconds}\``
		if (!embed.description) {
			embed.description = stripIndents`${descriptionInfo}
			${logLevel !== "ERROR" ? `\`\`\`${plainLog}\`\`\`\n` : ""}${embed.description ? `\`\`\`${embed.description}\`\`\`` : ""}`
		}

		if (!embed.description?.startsWith(descriptionInfo)) embed.description = `${descriptionInfo}\n${embed.description}`

		if (logLevel === "ERROR") {
			content = stripIndents`\`\`\`ts
			${plainLog.length > 2015 ? plainLog.slice(0, 2012) + "..." : plainLog}
			[${temporal.epochMilliseconds}]\`\`\``
		}

		await bot.helpers.sendMessage(
			logChannel,
			(!embed.description.includes(plainLog) && !embed.description.includes("Interaction")) || embed.description.includes("Streaming")
				? { content: stripColor(content) }
				: { embeds: [embed] },
		)
	} catch (err) {
		console.botLog(err, { logLevel: "ERROR" })
	}
}

const activity = activities()
bot.gateway.manager.createShardOptions.makePresence = () => activity

for await (const file of getFiles("./Events")) {
	const { name, main } = await import(`./Events/${file}`)
	bot.events[name as keyof EventHandlers] = main
}

console.clear()
await deploy(bot, Deno.args)
await startBot(bot)

const listener = Deno.listen({ port: 8080 })
console.botLog("Server", { tag: "Ready", noSend: true })

async function http(conn: Deno.Conn) {
	for await (const req of Deno.serveHttp(conn)) req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
}

for await (const conn of listener) http(conn)
