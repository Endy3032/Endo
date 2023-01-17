import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ButtonStyles,
	ChannelTypes, CreateGuildChannel, Interaction, MessageComponentTypes } from "discordeno"
import { checkPermission, defer, edit, getSubcmd, getValue, modifyChannelPositions, respond, shorthand } from "modules"

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

	const blockMsg = checkPermission(interaction, Permissions.MANAGE_CHANNELS)
	if (blockMsg) return await edit(bot, interaction, blockMsg)

	const below = getValue(interaction, "below", "Channel")
	const name = getValue(interaction, "name", "String") ?? "channel"
	const reason = getValue(interaction, "reason", "String")
		?? `Created by ${interaction.user.username}#${interaction.user.discriminator}`

	const options: CreateGuildChannel = { name, reason }

	let parentId: bigint | undefined, position = 0
	const channels = await bot.helpers.getChannels(interaction.guildId)

	switch (getSubcmd(interaction)) {
		case "category": {
			const belowPos = channels.find(channel => channel.id == below?.id)?.position
			position = belowPos ?? 0

			Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, { type: ChannelTypes.GuildCategory, position })
			break
		}

		default: {
			const nsfw = getValue(interaction, "nsfw", "Boolean")
			const topic = getValue(interaction, "topic", "String")
			const rateLimitPerUser = getValue(interaction, "slowmode", "Integer")

			const userLimit = getValue(interaction, "user-limit", "Integer")
			const bitrate = getValue(interaction, "bitrate", "Integer") ?? 32000
			const type = getValue(interaction, "type", "Integer") ?? ChannelTypes.GuildVoice

			if (below?.type === ChannelTypes.GuildCategory) {
				parentId = below.id
				position = Math.max(
					(channels
						.filter(channel => channel.parentId === parentId).array()
						.reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 1) - 1,
					0,
				)
			} else if (below) {
				const channel = channels.find(channel => channel.id === below.id)
				parentId = channel?.parentId
				position = channel?.position ?? 0
			}

			Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, {
				rateLimitPerUser,
				topic,
				nsfw,
				position,
				parentId,
				userLimit,
				bitrate: getSubcmd(interaction) === "voice" ? bitrate : undefined,
				type: getSubcmd(interaction) === "text" ? ChannelTypes.GuildText : type ?? ChannelTypes.GuildVoice,
			})
			break
		}
	}

	await bot.helpers.createChannel(interaction.guildId, options)
		.then(async channel => {
			await edit(bot, interaction, {
				content: `${shorthand("success")} Created ${getSubcmd(interaction)} channel <#${channel.id}>`,
				components: [{
					type: MessageComponentTypes.ActionRow,
					components: [{
						type: MessageComponentTypes.Button,
						label: "Delete",
						style: ButtonStyles.Danger,
						customId: channel.id.toString(),
					}],
				}],
			})

			await bot.helpers.swapChannels(
				channel.guildId,
				modifyChannelPositions(channels, channel),
			)
		})
		.catch(async err => console.botLog(err))
}

export async function button(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)

	await bot.helpers.deleteChannel(interaction.data?.customId ?? 0n)

	await edit(bot, interaction, {
		content: `${shorthand("success")} Deleted channel`,
		components: [],
	})

	try {
		setTimeout(() => bot.helpers.deleteOriginalInteractionResponse(interaction.token), 1500)
	} catch {}
}
