import axiod from "axiod"
import { IAxiodError, IAxiodResponse } from "axiodInterfaces"
import { bold, rgb24 } from "colors"
import { ActivityTypes, EventHandlers } from "discordeno"
import { activities, Nord, TimeMetric } from "modules"

export const name: keyof EventHandlers = "ready"
export const main: EventHandlers["ready"] = async (bot, payload) => {
	const location = Deno.build.vendor === "unknown" ? "Replit" : "Local",
		gatewayInfo = `[v${payload.v} | ${bot.gateway.gatewayBot.sessionStartLimit.remaining} Left | ${location}]`

	console.botLog(`${payload.user.username}#${payload.user.discriminator}} ${rgb24(gatewayInfo, Nord.brightYellow)}`, { tag: "Login" })

	function pinger() {
		axiod.head(`https://pinger.endy3032.repl.co`)
			.catch((err: IAxiodError) => {
				console.botLog(
					bold(rgb24(
						err.response !== undefined
							? `${err.response.status} ${err.response.statusText}`
							: "Unreachable",
						Nord.error,
					)),
					{ logLevel: "WARN", tag: "pinger" },
				)
			})
	}

	async function reloadPresence() {
		const activity = activities()
		await bot.helpers.editBotStatus(activity)
		const { type, name, url } = activity.activities[0]

		let log = `${ActivityTypes[type]}: ${name}`

		if (name === "lofi" && url) {
			const res = await axiod.get(`https://noembed.com/embed?url=${url.replace("www.youtube.com/watch?v=", "youtu.be/")}`)
			log += rgb24(`│${res.data.title}\n${rgb24(res.data.url, Nord.brightGreen)}`, Nord.brightCyan)
		}

		console.botLog(log, { embed: { description: `[Status] ${ActivityTypes[type]}: ${name}` }, tag: "Status" })
	}

	setInterval(pinger, 5 * TimeMetric.milli_min)
	if (Deno.build.vendor === "unknown") setInterval(reloadPresence, 30 * TimeMetric.milli_min)
}
