import { rgb24, stripColor } from "colors"
import { Bot, Embed, EventHandlers, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { BrightNord, getCmdName, getSubcmd, getSubcmdGroup, imageURL, toTimestamp } from "modules"
import { handleInteraction } from "../Commands/mod.ts"

const [testGuildID, testGuildChannel] = [Deno.env.get("TestGuild"), Deno.env.get("TestChannel")]

export const name: keyof EventHandlers = "interactionCreate"

export async function main(bot: Bot, interaction: Interaction) {
	const isLocal = Deno.build.vendor !== "unknown"
	const isTestGuild = interaction.guildId == BigInt(testGuildID ?? "0")
	const isRemoteTest = interaction.channelId == BigInt(testGuildChannel ?? "0")

	const notLocalTestLocation = isLocal && (!isTestGuild || isRemoteTest)
	const notRemoteTestLocation = !isLocal && isTestGuild && !isRemoteTest
	if ((notLocalTestLocation || notRemoteTestLocation) && !Deno.args.includes("noLimit")) return

	handleInteraction(bot, interaction)

	if (interaction.type != InteractionTypes.ApplicationCommandAutocomplete) {
		const [commandName, subcmd, group] = [getCmdName(interaction), getSubcmd(interaction), getSubcmdGroup(interaction)]

		const invoker = `${interaction.user.username}#${interaction.user.discriminator}`

		const tag = interaction.type === InteractionTypes.ApplicationCommand
			? "Command"
			: interaction.type === InteractionTypes.MessageComponent
			? (interaction.data?.componentType == MessageComponentTypes.Button ? "Button" : "Select")
			: interaction.type === InteractionTypes.ModalSubmit
			? "Submit"
			: "Unknown"

		let log = rgb24(
			interaction.type == InteractionTypes.ApplicationCommand
				? `/${[commandName, group, subcmd].join(" ").replace(/\s+/, " ")}`
				: interaction.type == InteractionTypes.MessageComponent
				? `/${[commandName, group, subcmd].join(" ")} [${interaction.data?.values?.join(", ") ?? interaction.data?.customId}]`
				: interaction.type == InteractionTypes.ModalSubmit
				? `{${interaction.data?.customId}}`
				: "Unknown",
			BrightNord.green,
		)

		const timestamp = toTimestamp(interaction.id, "ms")

		const embed: Embed = {
			description: stripColor(`[${timestamp}]\n**Interaction** • ${log}`),
			author: {
				name: invoker,
				iconUrl: interaction.user.avatar ? imageURL(interaction.user.id, interaction.user.avatar, "avatars") : undefined,
			},
			footer: {
				text: interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM",
			},
			timestamp: Number(timestamp),
		}

		log += rgb24(
			` [${invoker} | ${interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM"}]`,
			BrightNord.blue,
		)
		console.botLog(log, { logLevel: "INFO", embed, tag })
	}
}
