import { rgb24, stripColor } from "colors"
import { Bot, Embed, EventHandlers, Interaction, InteractionTypes, MessageComponentTypes } from "discordeno"
import { getCmdName, getSubcmd, getSubcmdGroup, imageURL, Nord, toTimestamp } from "modules"
import { handleInteraction } from "../commands/mod.ts"

const [testGuildID, testGuildChannel] = [Deno.env.get("TestGuild"), Deno.env.get("TestChannel")]

export const name: keyof EventHandlers = "interactionCreate"

export async function main(bot: Bot, interaction: Interaction) {
	const isLocal = Deno.build.vendor !== "unknown"
	const isTestGuild = interaction.guildId == BigInt(testGuildID ?? "0")
	const isRemoteTest = interaction.channelId == BigInt(testGuildChannel ?? "0")

	const notLocalTestLocation = isLocal && (!isTestGuild || isRemoteTest)
	const notRemoteTestLocation = !isLocal && isTestGuild && !isRemoteTest
	if ((notLocalTestLocation || notRemoteTestLocation) && !Deno.args.includes("noLimit")) return

	await handleInteraction(bot, interaction)

	if (interaction.type != InteractionTypes.ApplicationCommandAutocomplete) {
		const tag = interaction.type === InteractionTypes.ApplicationCommand
			? "Command"
			: interaction.type === InteractionTypes.MessageComponent
			? MessageComponentTypes[interaction.data?.componentType!] ?? "MentionableSelectMenu"
			: interaction.type === InteractionTypes.ModalSubmit
			? "Submit"
			: "Unknown"

		const [commandName, subcmd, group] = [getCmdName(interaction), getSubcmd(interaction), getSubcmdGroup(interaction)]

		let log = rgb24(
			[InteractionTypes.ApplicationCommand, InteractionTypes.MessageComponent].includes(interaction.type)
				? `/${[commandName, group, subcmd].join(" ").replace(/\s+/, " ")}`
					+ (interaction.type == InteractionTypes.MessageComponent
						? ` [${interaction.data?.values?.join(", ") ?? interaction.data?.customId}]`
						: "")
				: interaction.type == InteractionTypes.ModalSubmit
				? `{${interaction.data?.customId}}`
				: "Unknown",
			Nord.brightGreen,
		)

		// const guild = interaction.guildId ? await bot.helpers.getGuild(interaction.guildId) : null
		// const guildName = guild?.name
		// const channelName = interaction.channelId ? (await bot.helpers.getChannel(BigInt(interaction.channelId)))?.name : null
		const invoker = `${interaction.user.username}#${interaction.user.discriminator}`
		const timestamp = toTimestamp(interaction.id, "ms")

		const embed: Embed = {
			description: stripColor(`**Interaction [${tag}]** • ${log}`),
			author: {
				name: invoker,
				iconUrl: interaction.user.avatar ? imageURL(interaction.user.id, interaction.user.avatar, "avatars") : undefined,
			},
			footer: {
				text: interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM",
				// text: guildName ? `${guildName} #${channelName}` : "DM",
				// iconUrl: guild?.icon ? imageURL(guild?.id, guild.icon, "icons") : undefined,
			},
			timestamp: Number(timestamp),
		}

		// log += rgb24(` [${invoker} | ${guildName ? `${guildName} #${channelName}` : "DM"}]`, Nord.brightBlue)
		log += rgb24(
			` [${invoker} | ${interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM"}]`,
			Nord.brightBlue,
		)
		console.botLog(log, { logLevel: "INFO", embed, tag })
	}
}
