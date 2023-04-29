import { ApplicationCommandOption, ApplicationCommandOptionChoice, ApplicationCommandOptionTypes,
	BitwisePermissionFlags as Permissions, Bot, ChannelTypes, Interaction, VoiceRegions } from "discordeno"
import { checkPermission, getSubcmd, getValue, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "edit",
	description: "Edit something in the server",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "channel",
			description: "Edit a channel",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "channel",
					description: "The channel to edit [Channel]",
					type: ApplicationCommandOptionTypes.Channel,
					required: true,
				},
				{
					name: "name",
					description: "The channel's name [Length 1~100]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
				{
					name: "topic",
					description: "The channel's topic [Length 0~1024]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
				{
					name: "below",
					description: "Where to put the channel below [Text/Category]",
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
					description: "If the channel is NSFW",
					type: ApplicationCommandOptionTypes.Boolean,
					required: false,
				},
				{
					name: "archive-duration",
					description: "Default duration to auto archive threads",
					type: ApplicationCommandOptionTypes.Integer,
					choices: [
						{ name: "1 Hour", value: 60 },
						{ name: "1 Day", value: 1440 },
						{ name: "3 Days", value: 4320 },
						{ name: "1 Week", value: 10080 },
					],
					required: false,
				},
				{
					name: "bitrate",
					description: "Audio bitrate in Kbps for Voice channels [Integer 0~384]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 8,
					maxValue: 384,
					required: false,
				},
				{
					name: "user-limit",
					description: "Maximum amount of user able to join for Voice channels [Integer 0~99]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 99,
					required: false,
				},
				{
					name: "region",
					description: "The region for Voice channels",
					type: ApplicationCommandOptionTypes.String,
					autocomplete: true,
					required: false,
				},
				{
					name: "video-quality",
					description: "Video quality for Voice channels",
					type: ApplicationCommandOptionTypes.Integer,
					choices: [
						{ name: "Auto", value: 1 },
						{ name: "720p", value: 2 },
					],
					required: false,
				},
				{
					name: "reason",
					description: "Reason for edit [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	if (checkPermission(interaction, Permissions.MANAGE_CHANNELS)) return
	switch (getSubcmd(interaction)) {
		case "channel": {
			const channel = getValue(interaction, "channel", "Channel")
			if (!channel) return respond(bot, interaction, "Cannot get the channel", true)
			if (!channel.id) return await respond(bot, interaction, "Failed to get the channel ID", true)
			const rateLimitPerUser = getValue(interaction, "slowmode", "Integer") ?? undefined

			await bot.helpers.editChannel(channel.id, { rateLimitPerUser })
			break
		}
	}
}

function transformRegion(choices: ApplicationCommandOptionChoice[], property: keyof Omit<VoiceRegions, "name" | "id">) {
	return choices.filter(region => region.name.toLowerCase().includes(property))
}

export async function autocomplete(bot: Bot, interaction: Interaction) {
	if (interaction.guildId === undefined) {
		return await respond(bot, interaction, {
			choices: [{ name: "This command can only be used in a server", value: "null" }],
		})
	}

	const choices: ApplicationCommandOptionChoice[] = (await bot.helpers.getVoiceRegions(interaction.guildId)).map(region => {
		let { name } = region
		if (region.optimal) name += " [Optimal]"
		if (region.deprecated) name += " [Deprecated]"
		if (region.custom) name += " [Custom]"
		return { name, value: region.id }
	})

	const optimal = transformRegion(choices, "optimal")
	const deprecated = transformRegion(choices, "deprecated")
	const custom = transformRegion(choices, "custom")
	const abnormal = [...optimal, ...deprecated, ...custom]

	await respond(bot, interaction, {
		choices: [...optimal, ...custom, ...choices.filter(choice => !abnormal.includes(choice)), ...deprecated],
	})
}
