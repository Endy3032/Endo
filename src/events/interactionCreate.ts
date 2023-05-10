import { avatarUrl, Embed, EventHandlers, guildIconUrl, Interaction, InteractionTypes, MessageComponentTypes, rgb24,
	snowflakeToTimestamp, stripColor } from "discordeno"
import { getCmd, getGroup, getSubcmd, Nord } from "modules"
import { handleInteraction } from "../commands/mod.ts"

const [testGuildID, testGuildChannel] = [Deno.env.get("TestGuild"), Deno.env.get("TestChannel")]

export const name: keyof EventHandlers = "interactionCreate"

export async function main(interaction: Interaction) {
	await handleInteraction(interaction)

	if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) return
	const { bot } = interaction

	const isLocal = Deno.build.vendor !== "unknown"
	const isTestGuild = interaction.guildId?.toString() === testGuildID ?? "0"
	const isRemoteTest = interaction.channelId?.toString() === testGuildChannel ?? "0"

	const notLocalTestLocation = isLocal && (!isTestGuild || isRemoteTest)
	const notRemoteTestLocation = !isLocal && isTestGuild && !isRemoteTest
	// if ((notLocalTestLocation || notRemoteTestLocation) && !Deno.args.includes("noLimit")) return

	const tag = interaction.type === InteractionTypes.ApplicationCommand
		? "Command"
		: interaction.type === InteractionTypes.MessageComponent
		? MessageComponentTypes[interaction.data?.componentType!] ?? "MentionableSelectMenu"
		: interaction.type === InteractionTypes.ModalSubmit
		? "Submit"
		: "Unknown"

	const user = interaction.user ?? interaction.member?.user
	const [commandName, subcmd, group] = [getCmd(interaction), getSubcmd(interaction), getGroup(interaction)]

	let log = rgb24(
		[InteractionTypes.ApplicationCommand, InteractionTypes.MessageComponent].includes(interaction.type)
			? `/${[commandName, group, subcmd].join(" ").replace(/\s+/, " ")}`
				+ (interaction.type === InteractionTypes.MessageComponent
					? ` [${interaction.data?.values?.join(", ") ?? interaction.data?.customId}]`
					: "")
			: interaction.type === InteractionTypes.ModalSubmit
			? `{${interaction.data?.customId}}`
			: "Unknown",
		Nord.brightGreen,
	)

	const guild = interaction.guildId ? await bot.helpers.getGuild(interaction.guildId) : null
	const guildName = guild?.name
	const channelName = interaction.channelId ? (await bot.helpers.getChannel(BigInt(interaction.channelId)))?.name : null
	const invoker = `${user.username}#${user.discriminator}`

	const embed: Embed = {
		description: stripColor(`**Interaction [${tag}]** • ${log}`),
		author: {
			name: invoker,
			iconUrl: user.avatar ? avatarUrl(user.id, user.discriminator, { avatar: user.avatar, size: 512, format: "png" }) : undefined,
		},
		footer: {
			// text: interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM",
			text: guildName ? `${guildName} #${channelName}` : "DM",
			iconUrl: guild?.icon ? guildIconUrl(guild.id, guild.icon, { size: 512, format: "png" }) : undefined,
		},
		timestamp: snowflakeToTimestamp(interaction.id),
	}

	log += rgb24(` [${invoker} | ${guildName ? `${guildName} #${channelName}` : "DM"}]`, Nord.brightBlue)
	// log += rgb24(
	// 	` [${invoker} | ${interaction.guildId ? `${interaction.guildId} - #${interaction.channelId}` : "DM"}]`,
	// 	Nord.brightBlue,
	// )
	console.botLog(log, { logLevel: "INFO", embed, tag })
}
