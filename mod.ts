import { rgb24, stripColor } from "colors"
import { createBot, EventHandlers, Intents, startBot } from "discordeno"
import { activities, BrightNord, capitalize, deploy, getFiles, InspectConfig, LogOptions, Nord } from "modules"
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
			const json = content?.match(/(?<=^(URL: .*? \| )).*/)?.[0] ?? ""
			content = content?.replace(" | " + json, "\n") + Deno.inspect(JSON.parse(json), InspectConfig)
		} else if (tag?.includes("fetchSuccess")) {
			content = Deno.inspect(JSON.parse(content ?? "\n"), InspectConfig)
		}

		console.botLog(content, { noSend: true, logLevel: "DEBUG", tag })
	}
}

console.botLog = async (content: any, options?: LogOptions) => {
	options = Object.assign({ tag: undefined, noSend: false, embed: undefined }, options)
	const { tag, noSend } = options
	let { embed } = options
	let logLevel = options.logLevel ?? "INFO"

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

	const timestamp = `<t:${temporal.epochSeconds}:T> [\`${temporal.epochMilliseconds}\`]`

	// Sanitization
	if (content instanceof Error) {
		content = content.stack ?? "Unable to capture Error stack"
		logLevel = "ERROR"
	} else if (typeof content !== "string") {
		content = Deno.inspect(content, InspectConfig)
	}

	content = content.replaceAll(Deno.cwd(), "Endo")

	// Formatting
	if (tag) content = `${rgb24(`[${tag}]`, BrightNord.orange)} ${content}`

	const plainLog = stripColor(content)
	const logColor = Nord[logLevel.toLowerCase()]
	const formattedLog = rgb24(logTime, Nord.blue) + rgb24(logLevel.padStart(6, " "), logColor) + rgb24(" | ", Nord.blue)
		+ content.replaceAll("\n", "\n" + " ".repeat(29) + rgb24("| ", Nord.blue))

	console[logLevel.toLowerCase()](formattedLog)
	Deno.writeTextFileSync(
		`./Resources/${logLevel === "DEBUG" ? "debug" : logLevel === "ERROR" ? "error" : "discord"}.log`,
		stripColor(formattedLog) + "\n",
		{ append: true },
	)

	// Discord logging
	if (logChannel === undefined || noSend) return
	try {
		embed = embed ?? {}
		if (!embed.timestamp) embed.timestamp = temporal.epochMilliseconds
		if (!/^<t:\d+:[tTdDfFR]>/.test(embed.description ?? "")) {
			embed.description = `**${capitalize(logLevel)}**│${timestamp}\n${logLevel !== "ERROR" ? `\`\`\`${plainLog}\`\`\`\n` : ""}${
				embed.description ? `\`\`\`${embed.description}\`\`\`` : ""
			}`
		}
		if (logLevel === "ERROR") content = `${timestamp} \`\`\`${plainLog}\`\`\``
		const embeds = embed ? [embed] : undefined
		await bot.helpers.sendMessage(logChannel, { content: embed.description?.includes(content) ? stripColor(content) : undefined,
			embeds })
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
