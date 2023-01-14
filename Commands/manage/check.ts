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

	const channels = (await bot.helpers.getChannels(interaction.guildId)).array().sort(sortChannel)
	const roles = (await bot.helpers.getRoles(interaction.guildId)).array().sort(sortRole)

	await respond(bot, interaction, {
		embeds: positionEmbed(channels, roles),
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.Button,
				label: "Fix Positions",
				customId: "fix",
				style: ButtonStyles.Primary,
			}],
		}],
	}, true)
}

export async function button(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

	let channels = (await bot.helpers.getChannels(interaction.guildId)).array().sort(sortChannel)
	const roles = (await bot.helpers.getRoles(interaction.guildId)).array().sort(sortRole)

	const fixPosition = (type: ChannelTypes) =>
		channels.filter(c => c.type == type).map((c: Channel, i: number) => Object.assign(c, { position: i }))

	const categories = fixPosition(ChannelTypes.GuildCategory)
	const text = fixPosition(ChannelTypes.GuildText)
	const voice = fixPosition(ChannelTypes.GuildVoice)

	channels = [...categories, ...text, ...voice]

	await bot.helpers.swapChannels(interaction.guildId, channels.map((c: Channel, i: number) => ({ id: c.id.toString(), position: i })))

	await edit(bot, interaction, {
		embeds: positionEmbed(channels, roles),
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.Button,
				label: "Fixed",
				customId: "fixed",
				style: ButtonStyles.Success,
				disabled: true,
			}],
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
						.filter(channel => channel.type == ChannelTypes.GuildCategory)
						.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
					inline: true,
				},
				{
					name: "Text Channels",
					value: channels
						.filter(channel => channel.type == ChannelTypes.GuildText)
						.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
					inline: true,
				},
				{
					name: "Voice Channels",
					value: channels
						.filter(channel => channel.type == ChannelTypes.GuildVoice)
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
