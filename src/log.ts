import bot from "bot"
import { stripIndents } from "commonTags"
import { CreateMessageOptions, Embed, rgb24, stripColor } from "discordeno"
import { InspectConfig, Nord } from "modules"
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

async function botLog(content: any, options?: LogOptions) {
	options = options ?? {}
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

	// #region Sanitization & Formatting
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
	// #endregion

	// #region Local logging
	console[logLevel.toLowerCase()](formattedLog)

	Deno.writeTextFileSync(
		`src/assets/${logLevel.toLowerCase()}.log`,
		stripColor(formattedLog) + "\n",
		{ append: true },
	)
	// #endregion

	// #region Discord logging
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

		await bot.rest.sendMessage(
			logChannel,
			(!embed.description.includes(plainLog) && !embed.description.includes("Interaction")) || embed.description.includes("Streaming")
				? { content: stripColor(content) }
				: { embeds: [bot.transformers.reverse.embed(bot, embed)] },
		)
	} catch (err) {
		console.botLog(err, { logLevel: "ERROR" })
	}
	// #endregion
}

console.botLog = botLog
export type BotLog = typeof botLog
