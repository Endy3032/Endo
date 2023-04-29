import { stripIndents } from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ButtonStyles,
	ChannelTypes, Interaction, MessageComponentTypes } from "discordeno"
import { checkPermission, defer, edit, emojis, error, getSubcmd, getValue, respond, shorthand } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "delete",
	description: "Delete something from the server",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "channel",
			description: "Delete a channel",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "channel",
					description: "The channel to delete [Channel]",
					type: ApplicationCommandOptionTypes.Channel,
					channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildCategory, ChannelTypes.GuildVoice],
					required: true,
				},
				{
					name: "reason",
					description: "Reason for deletion [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const blockMsg = checkPermission(interaction, Permissions.MANAGE_CHANNELS)
	if (blockMsg) return await edit(bot, interaction, blockMsg)

	switch (getSubcmd(interaction)) {
		case "channel": {
			const channel = getValue(interaction, "channel", "Channel")
			const reason = getValue(interaction, "reason", "String")
				?? `Deleted by ${interaction.user.username}#${interaction.user.discriminator}`

			await respond(bot, interaction, {
				content: stripIndents`${shorthand("warn")} Confirm deletion
				**Target:** <#${channel?.id}>
				**Reason:** ${reason}`,
				components: [{
					type: MessageComponentTypes.ActionRow,
					components: [{
						type: MessageComponentTypes.Button,
						label: "Delete",
						customId: `channel-${channel?.id}`,
						style: ButtonStyles.Danger,
						emoji: { id: BigInt(emojis.trash) },
					}],
				}],
			}, true)
			break
		}
	}
}

export async function button(bot: Bot, interaction: Interaction) {
	await defer(bot, interaction)

	const customID = (interaction.data?.customId ?? "").split("-")
	const [type, id] = customID

	switch (type) {
		case "channel": {
			const reason = interaction.message?.content.match(/(?<=\*\*Reason:\*\* ).*/)?.[0]
				?? `Deleted by ${interaction.user.username}#${interaction.user.discriminator}`

			await bot.helpers.deleteChannel(BigInt(id), reason)
				.then(() => edit(bot, interaction, { content: `${shorthand("success")} Deleted the channel`, components: [] }))
				.catch(err => error(bot, interaction, err, { type: "Channel Deletion", isEdit: true }))
			break
		}
	}
}

function purge(bot: Bot, channelId: bigint, messages: bigint[], reason?: string) {
	if (messages.length > 1) return bot.helpers.deleteMessages(channelId, messages, reason)
	else return bot.helpers.deleteMessage(channelId, messages[0], reason)
}
