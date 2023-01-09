import { rgb24, stripColor } from "colors"
import { Bot, Embed, EventHandlers, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { BrightNord, getCmdName, getSubcmd, getSubcmdGroup, imageURL, toTimestamp } from "modules"
import { handleInteraction } from "~/Commands/mod.ts"

const [testGuildID, testGuildChannel] = [Deno.env.get("TestGuild"), Deno.env.get("TestChannel")]

export const name: keyof EventHandlers = "interactionCreate"

export async function main(bot: Bot, interaction: Interaction) {
	const isLocal = Deno.build.vendor !== "unknown"
	const isTestGuild = interaction.guildId == BigInt(testGuildID ?? "0")
	const isReplitTest = interaction.channelId == BigInt(testGuildChannel ?? "0")
	if ((isLocal && (!isTestGuild || isReplitTest)) || (!isLocal && isTestGuild && !isReplitTest)) return

	const [commandName, subcmd, group] = [getCmdName(interaction), getSubcmd(interaction), getSubcmdGroup(interaction)]

	if (interaction.type != InteractionTypes.ApplicationCommandAutocomplete) {
		const guild = interaction.guildId ? await bot.helpers.getGuild(interaction.guildId) : null
		const guildName = guild?.name
		const channelName = interaction.channelId ? (await bot.helpers.getChannel(BigInt(interaction.channelId)))?.name : null
		const invoker = `${interaction.user.username}#${interaction.user.discriminator}`

		let log = rgb24(`[${
			interaction.type === InteractionTypes.ApplicationCommand
				? "Command"
				: interaction.type === InteractionTypes.MessageComponent
				? (interaction.data?.componentType == MessageComponentTypes.Button ? "Button" : "Select")
				: interaction.type === InteractionTypes.ModalSubmit
				? "Submit"
				: "Unknown"
		}] `, BrightNord.yellow)

		log += rgb24(
			interaction.type == InteractionTypes.ApplicationCommand
				? `/${[commandName, group, subcmd].join(" ").replace(/\s+/, " ")}`
				: interaction.type == InteractionTypes.MessageComponent
				? `(${commandName}/${interaction.data?.values?.join(", ") ?? interaction.data?.customId})`
				: interaction.type == InteractionTypes.ModalSubmit
				? `{${commandName}/${interaction.data?.customId}}`
				: "Unknown",
			BrightNord.green,
		)

		const timestamp = toTimestamp(interaction.id, "ms")

		const embed: Embed = {
			description: stripColor(`<t:${toTimestamp(interaction.id)}:f> [${timestamp}]\n**Interaction** • ${log}`),
			author: {
				name: invoker,
				iconUrl: imageURL(interaction.user.id, interaction.user.avatar, "avatars"),
			},
			footer: {
				text: guildName ? `${guildName} #${channelName}` : "**DM**",
				iconUrl: imageURL(guild?.id, guild?.icon, "icons"),
			},
			timestamp: Number(timestamp),
		}

		log += rgb24(`[${invoker} | ${guildName ? `${guildName} #${channelName}` : "DM"}]`, BrightNord.blue)
		console.botLog(log, { logLevel: "INFO", embed })
	}

	handleInteraction(bot, interaction)
}
