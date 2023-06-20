import axiod from "axiod"
import { IAxiodError } from "axiodInterfaces"
import bot from "bot"
import { ActivityTypes, bold, EventHandlers, rgb24 } from "discordeno"
import { activities, Nord, TimeMetric } from "modules"

export const name: keyof EventHandlers = "ready"

export const main: EventHandlers["ready"] = async payload => {
	const location = Deno.build.vendor === "unknown" ? "Replit" : "Local"
	const gatewayInfo = `[v${payload.v} | ${(await bot.rest.getGatewayBot()).sessionStartLimit.remaining} Left | ${location}]`

	console.botLog(`${payload.user.username}#${payload.user.discriminator} ${rgb24(gatewayInfo, Nord.brightYellow)}`, { tag: "Login" })

	setInterval(pinger, 5 * TimeMetric.milli_min)
	if (Deno.build.vendor === "unknown") setInterval(reloadPresence, 30 * TimeMetric.milli_min)
}

function pinger() {
	axiod.head(`https://pinger.endy3032.repl.co`).catch((err: IAxiodError) =>
		console.botLog(bold(rgb24(
			err.response !== undefined
				? `${err.response.status} ${err.response.statusText}`
				: "Unreachable",
			Nord.error,
		)), { logLevel: "WARN", tag: "pinger" })
	)
}

async function reloadPresence() {
	const activity = activities()
	await bot.gateway.editBotStatus(activity)
	const { type, name, url } = activity.activities[0]

	let log = `${ActivityTypes[type]}: ${name}`

	if (name === "lofi" && url) {
		const res = await axiod.get(`https://noembed.com/embed?url=${url.replace("www.youtube.com/watch?v=", "youtu.be/")}`)
		log += rgb24(`│${res.data.title}\n${rgb24(res.data.url, Nord.brightGreen)}`, Nord.brightCyan)
	}

	console.botLog(log, { embed: { description: `[Status] ${ActivityTypes[type]}: ${name}` }, tag: "Status" })
}
