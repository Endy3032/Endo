import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, ButtonStyles, Channel, ChannelTypes, Interaction,
	MessageComponentTypes, Role } from "discordeno"
import { defer, edit, getSubcmd, getValue, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "check",
	description: "Check some server informations",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "position",
			description: "Check the channels' position",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
	],
}

const sortChannel = (a: Channel, b: Channel) => (a.position ?? 0) > (b.position ?? 1) ? 1 : -1
const sortRole = (a: Role, b: Role) => (a.position ?? 0) > (b.position ?? 1) ? -1 : 1

export async function main(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

	const channels = (await bot.helpers.getChannels(interaction.guildId)).sort(sortChannel)
	const roles = (await bot.helpers.getRoles(interaction.guildId)).sort(sortRole)

	await respond(bot, interaction, {
		embeds: positionEmbed(channels, roles),
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [
				{
					type: MessageComponentTypes.Button,
					label: "Fix Positions",
					customId: "fix",
					style: ButtonStyles.Primary,
				},
				{
					type: MessageComponentTypes.Button,
					label: "Reload",
					customId: "reload",
					style: ButtonStyles.Secondary,
				},
			],
		}],
	}, true)
}

export async function button(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

	let channels = (await bot.helpers.getChannels(interaction.guildId)).sort(sortChannel)
	const roles = (await bot.helpers.getRoles(interaction.guildId)).sort(sortRole)

	if (interaction.data?.customId === "fix") {
		const fixPosition = (type: ChannelTypes) =>
			channels.filter(c => c.type === type).map((c: Channel, i: number) => Object.assign(c, { position: i }))

		const categories = fixPosition(ChannelTypes.GuildCategory)
		const text = fixPosition(ChannelTypes.GuildText)
		const voice = [...fixPosition(ChannelTypes.GuildVoice), ...fixPosition(ChannelTypes.GuildStageVoice)]

		channels = [...categories, ...text, ...voice]

		await bot.helpers.editChannelPositions(interaction.guildId,
			channels.map((c: Channel, i: number) => ({ id: c.id.toString(), position: i })))
	}

	await edit(bot, interaction, {
		embeds: positionEmbed(channels, roles),
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [
				{
					type: MessageComponentTypes.Button,
					label: interaction.data?.customId === "fix" ? "Fixed" : "Fix Positions",
					customId: interaction.data?.customId === "fix" ? "fixed" : "fix",
					style: interaction.data?.customId === "fix" ? ButtonStyles.Success : ButtonStyles.Primary,
					disabled: interaction.data?.customId === "fix" ? true : false,
				},
				{
					type: MessageComponentTypes.Button,
					label: "Reload",
					customId: "reload",
					style: ButtonStyles.Secondary,
				},
			],
		}],
	})
}

function positionEmbed(channels: Channel[], roles: Role[]) {
	return [
		{
			title: "Channels Position",
			fields: [
				{
					name: "Categories",
					value: channels
						.filter(channel => channel.type === ChannelTypes.GuildCategory)
						.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
					inline: true,
				},
				{
					name: "Text Channels",
					value: channels
						.filter(channel => channel.type === ChannelTypes.GuildText)
						.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
					inline: true,
				},
				{
					name: "Voice Channels",
					value: channels
						.filter(channel => channel.type === ChannelTypes.GuildVoice || channel.type === ChannelTypes.GuildStageVoice)
						.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
					inline: true,
				},
			],
		},
		{
			fields: [{
				name: "Roles",
				value: roles.map(role => `<@&${role.id}> ${role.position}`).join("\n"),
			}],
		},
	]
}
