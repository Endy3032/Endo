import { rgb24, stripColor } from "colors"
import { stripIndents } from "commonTags"
import { createBot, Intents } from "discordeno"
import { InspectConfig, LogLevel, LogOptions, Nord } from "modules"
import { Temporal } from "temporal"

const [token, logChannel] = [Deno.env.get("DiscordToken"), Deno.env.get("Log")]
if (token === undefined) throw new Error("Missing Token")

const bot = createBot({
	token,
	intents: Intents.Guilds | Intents.DirectMessages,
	events: {},
})

async function botLog(content: any, options?: LogOptions) {
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
		`src/assets/${logLevel.toLowerCase()}.log`,
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

console.botLog = botLog
export type BotLog = typeof botLog
