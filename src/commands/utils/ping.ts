import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction, snowflakeToTimestamp } from "discordeno"
import { colors, pickArray, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "ping",
	description: "Get the bot's latency info",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	await respond(bot, interaction, "Pinging...")

	const original = await bot.helpers.getOriginalInteractionResponse(interaction.token)
	const shards = [...bot.gateway.shards.values()]
	const noPing = shards.filter(shard => shard.heart.rtt === undefined).length
	const wsPing = shards.reduce((a, b) => a + (b.heart.rtt ?? 0), 0) / shards.length

	if (wsPing < 0) console.botLog(shards.map(shard => shard.heart))

	await bot.helpers.editOriginalInteractionResponse(interaction.token, {
		content: "",
		embeds: [{
			title: "Pong! - Latency Info",
			color: pickArray(colors),
			fields: [
				{
					name: "WebSocket",
					value: noPing ? "Unavailable" : `${wsPing}ms${wsPing < 0 ? " (how...)" : ""}`,
				},
				{
					name: "Roundtrip",
					value: `${original.timestamp - snowflakeToTimestamp(interaction.id)}ms`,
				},
			],
		}],
	})
}
