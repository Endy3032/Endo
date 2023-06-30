import { avatarUrl, EventHandlers, guildIconUrl, Interaction, InteractionTypes, MessageComponentTypes, rgb24, snowflakeToTimestamp,
	stripColor } from "discordeno"
import { getCmd, getGroup, getSubcmd, interactionName, Nord } from "modules"
import { handleInteraction } from "../commands/mod.ts"

const isLimit = !Deno.args.includes("noLimit"),
	isLocal = Deno.build.vendor !== "unknown",
	testGuildID = Deno.env.get("TestGuild") ?? "0",
	testChannelID = Deno.env.get("TestChannel") ?? "0"

export const name: keyof EventHandlers = "interactionCreate"

export async function main(interaction: Interaction) {
	const isTestGuild = interaction.guildId?.toString() === testGuildID
	const isRemoteTestChannel = interaction.channelId?.toString() === testChannelID

	const invalidLocal = isLocal && (!isTestGuild || isRemoteTestChannel)
	const invalidRemote = !isLocal && isTestGuild && !isRemoteTestChannel
	if (isLimit && (invalidLocal || invalidRemote)) return

	await handleInteraction(interaction)

	if (interaction.type === InteractionTypes.ApplicationCommandAutocomplete) return

	const { bot } = interaction
	const user = interaction.member?.user ?? interaction.user
	const cmd = [getCmd(interaction), getGroup(interaction), getSubcmd(interaction)].filter(e => !!e).join(" ").replace(/\s+/g, " ")
		|| interactionName(interaction)?.join(" ").replace(/^\[\w\] /, "")

	const guild = interaction.guildId ? await bot.helpers.getGuild(interaction.guildId) : null
	const channel = interaction.channelId ? await bot.helpers.getChannel(interaction.channelId) : null

	const invoker = `@${user.username}${user.discriminator === "0" ? "" : `#${user.discriminator}`}`
	const location = guild ? `${guild.name} #${channel?.name}` : "DM"

	const tag: string = interaction.type === InteractionTypes.MessageComponent
		? MessageComponentTypes[interaction.data?.componentType!]
		: InteractionTypes[interaction.type]

	const log = rgb24({
		[InteractionTypes.ApplicationCommand]: `/${cmd}`,
		[InteractionTypes.MessageComponent]: `/${cmd} {${interaction.data!.customId}} ${
			interaction.data?.values ? `[${interaction.data?.values.join(", ")}]` : ""
		}`,
		[InteractionTypes.ModalSubmit]: `{${interaction.data!.customId}}`,
	}[interaction.type] ?? "Unknown", Nord.brightGreen)

	console.botLog(log + rgb24(` [${invoker} | ${location}]`, Nord.brightBlue), { logLevel: "INFO", tag, embed: {
		description: stripColor(`**Interaction [${tag}]** • ${log}`),
		author: {
			name: invoker,
			iconUrl: user.avatar ? avatarUrl(user.id, user.discriminator, { avatar: user.avatar, size: 64, format: "png" }) : undefined,
		},
		footer: {
			text: location,
			iconUrl: guild?.icon ? guildIconUrl(guild.id, guild.icon, { size: 64, format: "png" }) : undefined,
		},
		timestamp: snowflakeToTimestamp(interaction.id),
	} })
}
