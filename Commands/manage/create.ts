import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ChannelTypes,
	CreateGuildChannel, Interaction, ModifyGuildChannelPositions } from "discordeno"
import { checkPermission, defer, edit, getSubcmd, getValue, shorthand } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "create",
	description: "Create something for the server",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "text",
			description: "Create a text channel",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "name",
					description: "The channel's name [Length 1~100]",
					type: ApplicationCommandOptionTypes.String,
					required: true,
				},
				{
					name: "topic",
					description: "The channel's topic [Length 0~1024]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
				{
					name: "below",
					description: "Where to put the channel below (Default Top) [Text/Category]",
					type: ApplicationCommandOptionTypes.Channel,
					channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildCategory],
					required: false,
				},
				{
					name: "slowmode",
					description: "Slowmode cooldown in seconds [Integer 0~21600]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 21600,
					required: false,
				},
				{
					name: "restricted",
					description: "If the channel is NSFW (Default False)",
					type: ApplicationCommandOptionTypes.Boolean,
					required: false,
				},
				{
					name: "reason",
					description: "Reason for creation [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
		{
			name: "category",
			description: "Create a category",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "name",
					description: "The category's name [Length 1~100]",
					type: ApplicationCommandOptionTypes.String,
					required: true,
				},
				{
					name: "below",
					description: "Where to put the category below (Default Top) [Category]",
					type: ApplicationCommandOptionTypes.Channel,
					channelTypes: [ChannelTypes.GuildCategory],
					required: false,
				},
				{
					name: "reason",
					description: "Reason for creation [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
		{
			name: "voice",
			description: "Create a voice channel",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "name",
					description: "The channel's name [Length 1~100]",
					type: ApplicationCommandOptionTypes.String,
					required: true,
				},
				{
					name: "type",
					description: "The channel's type (Default Voice)",
					type: ApplicationCommandOptionTypes.Integer,
					choices: [
						{ name: "Voice", value: ChannelTypes.GuildVoice },
						{ name: "Stage", value: ChannelTypes.GuildStageVoice },
					],
					required: false,
				},
				{
					name: "below",
					description: "Where to put the channel below (Default Top) [Voice/Category]",
					type: ApplicationCommandOptionTypes.Channel,
					channelTypes: [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice, ChannelTypes.GuildCategory],
					required: false,
				},
				{
					name: "bitrate",
					description: "Audio bitrate in Kbps [Integer 0~384]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 8,
					maxValue: 384,
					required: false,
				},
				{
					name: "user-limit",
					description: "Maximum amount of user able to join [Integer 0~99]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 99,
					required: false,
				},
				{
					name: "reason",
					description: "Reason for creation [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction, true)

	if (!interaction.guildId) return await edit(bot, interaction, "This action can only be performed in a server")

	const blockMsg = await checkPermission(interaction, Permissions.MANAGE_CHANNELS)
	if (blockMsg) return await edit(bot, interaction, blockMsg)

	const name = getValue(interaction, "name", "String") ?? "channel"
	const reason = getValue(interaction, "reason", "String")
		?? `Created by ${interaction.user.username}#${interaction.user.discriminator}`
	const options: CreateGuildChannel = { name, reason }

	let parentId: bigint | undefined = undefined, position = 0
	const channels = await bot.helpers.getChannels(interaction.guildId)

	switch (getSubcmd(interaction)) {
		case "category": {
			const below = getValue(interaction, "below", "Channel")
			const belowPos = channels.find(channel => channel.id == below?.id)?.position
			position = belowPos ? belowPos + 1 : 0

			Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, { type: ChannelTypes.GuildCategory, position })
			break
		}

		case "text": {
			const below = getValue(interaction, "below", "Channel")
			const nsfw = getValue(interaction, "nsfw", "Boolean") ?? false
			const rateLimitPerUser = getValue(interaction, "slowmode", "Integer") ?? 0
			const topic = getValue(interaction, "topic", "String") ?? undefined

			if (below?.type === ChannelTypes.GuildCategory) {
				parentId = below.id
				position = channels
					.filter(channel => channel.parentId === parentId).array()
					.reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 0
			} else if (below?.type === ChannelTypes.GuildText) {
				const channel = await bot.helpers.getChannel(below.id)
				parentId = channel?.parentId ?? undefined
				position = channel?.position ? channel.position + 1 : 0
			}

			Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, {
				type: ChannelTypes.GuildText,
				rateLimitPerUser,
				topic,
				nsfw,
				position,
				parentId,
			})
			break
		}

		case "voice": {
			const below = getValue(interaction, "below", "Channel")
			const bitrate = getValue(interaction, "bitrate", "Integer") ?? 32000
			const userLimit = getValue(interaction, "user-limit", "Integer") ?? 0
			const type = getValue(interaction, "type", "Integer") ?? ChannelTypes.GuildVoice

			if (below?.type === ChannelTypes.GuildCategory) {
				parentId = below.id
				position = channels.filter(channel => channel.parentId === parentId).array()
					.reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 0
			} else if (below?.type === ChannelTypes.GuildVoice) {
				const channel = await bot.helpers.getChannel(below.id)
				parentId = channel?.parentId ?? undefined
				position = channel?.position ? channel.position + 1 : 0
			}

			Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, {
				type,
				bitrate,
				userLimit,
				position,
				parentId,
			})
			break
		}
	}

	await bot.helpers.createChannel(interaction.guildId, options)
		.then(async channel => {
			await edit(bot, interaction, `${shorthand("success")} Created ${getSubcmd(interaction)} channel <#${channel.id}>`)

			const swapOptions: ModifyGuildChannelPositions[] = channels
				.filter(channel => channel.type == options.type)
				.map(channel => ({
					id: channel.id.toString(),
					position: (channel.position ?? 0) >= (options.position ?? 0) ? (channel.position ?? 0) + 1 : channel.position,
				}))

			swapOptions.push({ id: channel.id.toString(), position: options.position ?? 0 })
			await bot.helpers.swapChannels(channel.guildId, swapOptions)
		})
		.catch(async err => console.botLog(err))
}
