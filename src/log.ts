import bot from "bot"
import { CreateMessageOptions, Embed, rgb24, stripColor } from "discordeno"
import { codeblock, InspectConfig, Nord } from "modules"
import { Temporal } from "temporal"

const logChannel = Deno.env.get("Log")

type LogLevel =
	| "INFO"
	| "WARN"
	| "ERROR"
	| "DEBUG"

interface LogOptions {
	logLevel?: LogLevel
	tag?: string
	embed?: Embed
	noSend?: boolean
	message?: CreateMessageOptions
}

async function botLog(content: any, options: LogOptions = {}) {
	const { tag, noSend } = options
	const embed = options.embed ?? {}
	let logLevel: LogLevel = options.logLevel ?? "INFO"

	// #region Time
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
	// #endregion

	// #region Formatting
	if (content instanceof Error) {
		content = content.stack ?? "Unable to capture Error stack"
		logLevel = "ERROR"
	} else if (typeof content !== "string") {
		if (content.body) content.body = JSON.parse(content.body)
		content = Deno.inspect(content, InspectConfig)
	}

	content = content.replaceAll(Deno.cwd(), "Endo")

	if (tag) content = `${rgb24(`[${tag}]`, Nord.brightOrange)} ${content}`

	const plainLog = stripColor(content)

	const formattedLog = rgb24(logTime, Nord.blue)
		+ rgb24(logLevel.padStart(6, " "), Nord[logLevel.toLowerCase()])
		+ rgb24(" │ ", Nord.blue)
		+ content.replaceAll("\n", "\n" + rgb24("│ ".padStart(31, " "), Nord.blue))
	// #endregion

	// #region Local logging
	if (logLevel !== "DEBUG") console[logLevel.toLowerCase()](formattedLog)
	else if (Deno.args.includes("logDebug")) console.debug(formattedLog)

	Deno.writeTextFileSync(`src/assets/${logLevel.toLowerCase()}.log`, stripColor(formattedLog) + "\n", { append: true })
	// #endregion

	// #region Discord logging
	if (!logChannel || noSend) return

	const info = `**${logLevel}**│${temporal.epochMilliseconds}`
	embed.timestamp = embed.timestamp ?? temporal.epochMilliseconds
	embed.description = embed.description ?? `${info}\n${logLevel !== "ERROR" ? codeblock(plainLog) : ""}`

	if (!embed.description?.startsWith(info)) embed.description = `${info}\n${embed.description}`

	if (logLevel === "ERROR") {
		content = codeblock([
			plainLog.length > 1974 ? plainLog.slice(0, 1973) + "…" : plainLog,
			`[${temporal.epochMilliseconds}]`,
		], "ts")
	}

	await bot.rest.sendMessage(
		logChannel,
		(!embed.description.includes(plainLog) && !embed.description.includes("Interaction")) || embed.description.includes("Streaming")
			? { content }
			: { embeds: [bot.transformers.reverse.embed(bot, embed)] },
	).catch(err => console.botLog(err, { logLevel: "ERROR" }))
	// #endregion
}

console.botLog = botLog
export type BotLog = typeof botLog
