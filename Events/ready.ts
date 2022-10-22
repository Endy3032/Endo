import { IAxiodError, IAxiodResponse } from "axiod/interfaces.ts"
import axiod from "axiod/mod.ts"
import { bold, rgb24 } from "colors"
import { Bot, EventHandlers, getGlobalApplicationCommands, getGuildApplicationCommands, User } from "discordeno"
import { activities, BrightNord, Nord, TimeMetric } from "modules"

type Payload = {
	shardId: number
	v: number
	user: User
	guilds: bigint[]
	sessionId: string
	shard?: number[]
	applicationId: bigint
}

export const name: keyof EventHandlers = "ready"
export const execute: EventHandlers["ready"] = async (bot: Bot, payload: Payload) => {
	console.botLog(
		`As ${payload.user.username}#${payload.user.discriminator} [v${payload.v} | ${bot.gateway.gatewayBot.sessionStartLimit.remaining} Remaining | ${
			Deno.build.os == "darwin" ? "Local" : "Cloud"
		}]`,
		{ tag: "Login" },
	)

	const pinger = () => {
		const servers = ["pinger", "endyjs"]
		servers.forEach(server => {
			axiod.head(`https://${server}.endy3032.repl.co`)
				.catch((err: IAxiodError) => {
					if (err.response) {
						console.botLog(`${rgb24(`[${server}]`, BrightNord.cyan)} ${bold(rgb24(`${err.response.status} ${err.response.statusText}`, Nord.error))}`, { logLevel: "WARN" })
					}
				})
		})
	}

	const reloadPresence = async () => {
		const activity = activities()
		await bot.helpers.editBotStatus(activity)
		const activityType = activity.activities[0].type
		const activityName = activity.activities[0].name
		const typeString = ["Playing", "Streaming", "Listening to", "Watching"]

		let log = `${rgb24("[Status]", BrightNord.cyan)} ${typeString[activityType]} ${activityName}`
		if (activityName == "lofi" && activity.activities[0].url) {
			const res: IAxiodResponse = await axiod.get(`https://noembed.com/embed?url=${activity.activities[0].url.replace("www.youtube.com/watch?v=", "youtu.be/")}`)
			log = log.slice(0, -4) + rgb24(`${res.data.title}│${rgb24(res.data.url, BrightNord.green)}`, BrightNord.cyan)
		}
		console.botLog(log, { embed: { description: `**Status** • ${typeString[activityType]} ${activityName}` } })
	}

	pinger()
	setInterval(() => {
		pinger()
	}, 5 * TimeMetric.milli2min)
	if (Deno.build.os == "linux") {
		setInterval(() => {
			reloadPresence()
		}, 15 * TimeMetric.milli2min)
	}

	const globalCommands = await getGlobalApplicationCommands(bot).catch(err => console.botLog(err, { logLevel: "ERROR" }))
	console.botLog(`${globalCommands?.size ?? "Failed Fetching"} Commands`, { tag: "Global" })
	const testGuild = Deno.env.get("TestGuild")
	if (testGuild !== undefined) {
		const testCommands = await getGuildApplicationCommands(bot, BigInt(testGuild)).catch(err => console.botLog(err, { logLevel: "ERROR" }))
		console.botLog(`${testCommands?.size ?? "Failed Fetching"} Commands`, { tag: "Test" })
	}
}
