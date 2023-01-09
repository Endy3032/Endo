import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { colors, pickArray, respond, toTimestamp } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "ping",
	description: "Get the bot's latency info",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	await respond(bot, interaction, "Pinging...")

	const original = await bot.helpers.getOriginalInteractionResponse(interaction.token)
	const noPing = bot.gateway.manager.shards.filter(shard => shard.heart.rtt === undefined).size
	const wsPing = bot.gateway.manager.shards.reduce((a, b) => b !== undefined ? a + (b.heart.rtt ?? 0) : a, 0)
		/ bot.gateway.manager.shards.size

	if (wsPing < 0) console.botLog(bot.gateway.manager.shards.map(shard => shard.heart))

	await bot.helpers.editOriginalInteractionResponse(interaction.token, {
		content: "",
		embeds: [{
			title: "Pong!",
			color: pickArray(colors),
			fields: [
				{
					name: "Websocket Latency",
					value: noPing ? "Not available" : `${wsPing}ms${wsPing < 0 ? " (how did this happen)" : ""}`,
					inline: false,
				},
				{
					name: "Roundtrip Latency",
					value: `${BigInt(original.timestamp) - toTimestamp(interaction.id, "ms")}ms`,
					inline: false,
				},
			],
		}],
	})
}
