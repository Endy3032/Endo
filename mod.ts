import { rgb24, stripColor } from "colors"
import { createBot, EventHandlers, Intents, startBot } from "discordeno"
import { activities, BrightNord, capitalize, deploy, getFiles, LogOptions, Nord } from "modules"
import { Temporal } from "temporal"

const [token, logChannel] = [Deno.env.get("DiscordToken"), Deno.env.get("Log")]
if (token === undefined) throw new Error("Missing Token")

const bot = createBot({
	token,
	intents: Intents.Guilds | Intents.DirectMessages,
	events: {},
})
bot.gateway.manager.createShardOptions.makePresence = () => activities()

// #region Logging stuff
// const send = async (body: CreateMessage, timestamp: string) => {
// 	if (logChannel === undefined) return
// 	await bot.helpers.sendMessage(BigInt(logChannel), body)
// 		.catch((err: Error) => {
// 			console.botLog(err, "ERROR")
// 			bot.helpers.sendMessage(BigInt(logChannel), { content: `${timestamp}\`\`\`${err.stack}\`\`\`` })
// 		})
// }

// // deno-lint-ignore no-explicit-any
// console.localLog = (content: any, logLevel: LogLevel = "INFO") => {
// 	const temporal = Temporal.Now.instant()

// 	const logTime = temporal.toLocaleString("default", {
// 		timeZone: "Asia/Ho_Chi_Minh",
// 		year: "numeric",
// 		month: "2-digit",
// 		day: "2-digit",
// 		hour: "2-digit",
// 		minute: "2-digit",
// 		second: "2-digit",
// 		hour12: false,
// 		fractionalSecondDigits: 2,
// 	}).replace(",", "")

// 	if (content instanceof Error) {
// 		content = content.stack ?? "Unable to capture Error stack"
// 		logLevel = "ERROR"
// 	} else if (typeof content !== "string") content = Deno.inspect(content, { colors: true, compact: false, depth: 6, iterableLimit: 200 })

// 	content = content
// 		.replaceAll("    ", "  ")
// 		.replaceAll(Deno.cwd(), "Endo")

// 	const logColor = Nord[logLevel.toLowerCase()]
// 	const consoleLog = rgb24(`${logTime} ${rgb24(logLevel.padStart(6, " "), logColor)} | ${content.replaceAll("\n", "\n" + " ".repeat(32))}`, Nord.blue)

// 	console.log(consoleLog)
// 	Deno.writeTextFileSync("./Resources/discord.log", stripColor(consoleLog) + "\n", { append: true })

// 	return { plainLog: stripColor(content), epoch: temporal.epochMilliseconds }
// }

// console.tagLog = (tag: string, content: string, logLevel: LogLevel = "INFO") => console.localLog(`${rgb24(`[${tag}]`, BrightNord.cyan)} ${content}`, logLevel)

// // deno-lint-ignore no-explicit-any
// console.botLog = async (content: any, logLevel: LogLevel = "INFO", embed?: Embed) => {
// 	const { plainLog, epoch } = console.localLog(content, logLevel)
// 	if (content instanceof Error) logLevel = "ERROR"
// 	const timestamp = `<t:${Math.floor(epoch / 1000)}:T> [${epoch}]`

// 	if (logLevel == "ERROR") return await send({ content: `${timestamp} \`\`\`${plainLog}\`\`\`` }, epoch)
// 	else if (plainLog.includes("youtu.be")) return await send({ content: `${timestamp} │ ${plainLog.split(" Streaming lofi ")[1]}` }, epoch)
// 	else if (!embed) {
// 		embed = {
// 			description: `**${capitalize(logLevel)}** - ${timestamp}\n${/WARN|ERROR/.test(logLevel) ? `\`\`\`${plainLog}\`\`\`` : ` • ${plainLog}`}`,
// 			timestamp: epoch,
// 		}
// 	}

// 	if (!embed.timestamp) embed.timestamp = epoch
// 	if (!/<t:\d+:[tTdDfFR]>/.test(embed.description ?? "")) embed.description = `${timestamp}\n${embed.description}`
// 	send({ embeds: [embed] }, epoch)
// }

// deno-lint-ignore no-explicit-any
console.botLog = async (content: any, options: LogOptions = { logLevel: "INFO" }) => {
	let { tag, embed } = options
	let logLevel = options.logLevel || "INFO"

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
		hour12: false,
		fractionalSecondDigits: 2,
	}).replace(",", "")

	const timestamp = `<t:${temporal.epochSeconds}:T> \`${temporal.epochMicroseconds / 1000n}\``

	// Content sanitization
	if (content instanceof Error) {
		content = content.stack ?? "Unable to capture Error stack"
		logLevel = "ERROR"
	} else if (typeof content !== "string") content = Deno.inspect(content, { colors: true, compact: false, depth: 6, iterableLimit: 200 })

	content = content
		.replaceAll("    ", "  ")
		.replaceAll(Deno.cwd(), "Endo")

	if (tag) content = `[${rgb24(tag, BrightNord.cyan)}] ${content}`

	// Formatting
	const plainLog = stripColor(content)
	const logColor = Nord[logLevel.toLowerCase()]
	const formattedLog = rgb24(logTime + rgb24(logLevel.padStart(6, " "), logColor) + ` | ${content.replaceAll("\n", "\n" + " ".repeat(32))}`, Nord.blue)

	console.log(formattedLog)
	Deno.writeTextFileSync("./Resources/discord.log", stripColor(formattedLog) + "\n", { append: true })

	// Discord logging
	if (logChannel === undefined) return
	try {
		// if (logLevel == "ERROR") content = `${timestamp} \`\`\`${plainLog}\`\`\``
		// else {
		embed = embed ?? {}
		if (!embed.timestamp) embed.timestamp = temporal.epochSeconds
		if (!/<t:\d+:[tTdDfFR]>/.test(embed.description ?? "")) {
			embed.description = `**${capitalize(logLevel)}** [${timestamp}]\n${/WARN|ERROR/.test(logLevel) ? `\`\`\`${plainLog}\`\`\`` : `${plainLog}`}`
		}
		// }
		const embeds = embed ? [embed] : undefined
		await bot.helpers.sendMessage(logChannel, { content, embeds })
	} catch (err) {
		console.botLog(err, { logLevel: "ERROR" })
	}
}
// #endregion

for await (const file of getFiles("./Events")) {
	const { name, execute } = await import(`./Events/${file}`)
	bot.events[name as keyof EventHandlers] = execute
}

console.clear()
await deploy(bot, Deno.args)
await startBot(bot)

const listener = Deno.listen({ port: 3032 })
console.botLog("Server", { tag: "Ready" })

async function http(conn: Deno.Conn) {
	for await (const req of Deno.serveHttp(conn)) req.respondWith(new Response("200", { status: 200, statusText: "OK" }))
}

for await (const conn of listener) http(conn)
