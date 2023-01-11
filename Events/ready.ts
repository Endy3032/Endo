import axiod from "axiod"
import { IAxiodError, IAxiodResponse } from "axiodInterfaces"
import { bold, rgb24 } from "colors"
import { EventHandlers } from "discordeno"
import { activities, BrightNord, Nord, TimeMetric } from "modules"

export const name: keyof EventHandlers = "ready"
export const main: EventHandlers["ready"] = async (bot, payload) => {
	const user = `${payload.user.username}#${payload.user.discriminator}`,
		location = Deno.build.vendor === "unknown" ? "Replit" : "Local",
		gatewayInfo = `[v${payload.v} | ${bot.gateway.gatewayBot.sessionStartLimit.remaining} Left | ${location}]`

	console.botLog(`${user} ${rgb24(gatewayInfo, BrightNord.yellow)}`, { tag: "Login" })
	;(function pinger() {
		const servers = ["pinger"]
		servers.forEach(server => {
			axiod.head(`https://${server}.endy3032.repl.co`)
				.catch((err: IAxiodError) => {
					console.botLog(
						bold(rgb24(`${err.response.status} ${err.response.statusText}`, Nord.error)),
						{ logLevel: "WARN", tag: server },
					)
				})
		})
		setTimeout(() => pinger(), 5 * TimeMetric.milli_min)
	})()

	async function reloadPresence() {
		const activity = activities()
		await bot.helpers.editBotStatus(activity)
		const { type, name, url } = activity.activities[0]
		const typeString = ["Playing", "Streaming", "Listening to", "Watching"]

		let log = `${typeString[type]} ${name}`
		if (name === "lofi" && url) {
			const res = await axiod.get(`https://noembed.com/embed?url=${url.replace("www.youtube.com/watch?v=", "youtu.be/")}`)
			log += rgb24(`\n${res.data.title}│${rgb24(res.data.url, BrightNord.green)}`, BrightNord.cyan)
		}
		console.botLog(log, { embed: { description: `**Status** • ${typeString[type]} ${name}` }, tag: "Status" })
	}

	if (Deno.build.vendor === "unknown") setInterval(() => reloadPresence(), 20 * TimeMetric.milli_min)

	const globalCommands = await bot.helpers.getGlobalApplicationCommands()
	console.botLog(`${globalCommands.size} Commands`, { tag: "Global", noSend: true })

	const testGuild = Deno.env.get("TestGuild")
	if (testGuild !== undefined) {
		const testCommands = await bot.helpers.getGuildApplicationCommands(BigInt(testGuild))
		console.botLog(`${testCommands.size} Commands`, { tag: "Test", noSend: true })
	}
}
