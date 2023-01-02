import axiod from "axiod"
import { IAxiodError, IAxiodResponse } from "axiodInterfaces"
import { bold, rgb24 } from "colors"
import { EventHandlers, getGlobalApplicationCommands, getGuildApplicationCommands } from "discordeno"
import { activities, BrightNord, Nord, TimeMetric } from "modules"

export const name: keyof EventHandlers = "ready"
export const execute: EventHandlers["ready"] = async (bot, payload) => {
	console.botLog(
		`As ${payload.user.username}#${payload.user.discriminator} [v${payload.v} | ${bot.gateway.gatewayBot.sessionStartLimit.remaining} Remaining | ${
			Deno.build.vendor === "unknown" ? "Replit" : "Local"
		}]`,
		{ tag: "Login" },
	)
	;(function pinger() {
		const servers = ["pinger", "endyjs"]
		servers.forEach(server => {
			axiod.head(`https://${server}.endy3032.repl.co`)
				.catch((err: IAxiodError) => {
					if (err.response) {
						console.botLog(
							`${rgb24(`[${server}]`, BrightNord.cyan)} ${
								bold(rgb24(`${err.response.status} ${err.response.statusText}`, Nord.error))
							}`,
							{
								logLevel: "WARN",
							},
						)
					}
				})
		})
		setTimeout(() => pinger(), 5 * TimeMetric.milli_min)
	})()

	const reloadPresence = async () => {
		const activity = activities()
		await bot.helpers.editBotStatus(activity)
		const activityType = activity.activities[0].type
		const activityName = activity.activities[0].name
		const typeString = ["Playing", "Streaming", "Listening to", "Watching"]

		let log = `${rgb24("[Status]", BrightNord.cyan)} ${typeString[activityType]} ${activityName}`
		if (activityName === "lofi" && activity.activities[0].url) {
			const res: IAxiodResponse = await axiod.get(
				`https://noembed.com/embed?url=${activity.activities[0].url.replace("www.youtube.com/watch?v=", "youtu.be/")}`,
			)
			log += rgb24(`\n${res.data.title}│${rgb24(res.data.url, BrightNord.green)}`, BrightNord.cyan)
		}
		console.botLog(log, { embed: { description: `**Status** • ${typeString[activityType]} ${activityName}` } })
	}

	if (Deno.build.vendor === "unknown") setInterval(() => reloadPresence(), 20 * TimeMetric.milli_min)

	const globalCommands = await getGlobalApplicationCommands(bot).catch(err => console.botLog(err, { logLevel: "ERROR" }))
	console.botLog(`${globalCommands?.size ?? "Failed Fetching"} Commands`, { tag: "Global", noSend: true })
	const testGuild = Deno.env.get("TestGuild")
	if (testGuild !== undefined) {
		const testCommands = await getGuildApplicationCommands(bot, BigInt(testGuild))
			.catch(err => console.botLog(err, { logLevel: "ERROR" }))

		console.botLog(`${testCommands?.size ?? "Failed Fetching"} Commands`, { tag: "Test", noSend: true })
	}
}
