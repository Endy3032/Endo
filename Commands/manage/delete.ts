import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ButtonStyles,
	ChannelTypes, Interaction, MessageComponentTypes } from "discordeno"
import { checkPermission, defer, emojis, error, getSubcmd, getValue, respond, shorthand } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "delete",
	description: "Delete something in the server",
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
					description: "Reason for deleting the channel [Length 0~512]",
					type: ApplicationCommandOptionTypes.String,
					required: false,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	if (checkPermission(bot, interaction, Permissions.MANAGE_CHANNELS)) return
	switch (getSubcmd(interaction)) {
		case "channel": {
			const channel = getValue(interaction, "channel", "Channel")
			const reason = getValue(interaction, "reason", "String")
				?? `Deleted by ${interaction.user.username}#${interaction.user.discriminator}`

			await respond(bot, interaction, {
				content: `Confirm to delete <#${channel?.id}> with the following reason: ${reason}`,
				components: [{
					type: MessageComponentTypes.ActionRow,
					components: [{
						type: MessageComponentTypes.Button,
						label: "Delete",
						customId: `delete-channel-${channel?.id}`,
						style: ButtonStyles.Danger,
						emoji: { id: emojis.trash },
					}],
				}],
			}, true)
			break
		}
	}
}

export async function button(bot: Bot, interaction: Interaction) {
	const customID = (interaction.data?.customId ?? "").split("-")
	const [, type] = customID

	await defer(bot, interaction)
	switch (type) {
		case "channel": {
			if (checkPermission(bot, interaction, Permissions.MANAGE_CHANNELS)) return
			const [, , channelID] = customID
			const reason = interaction.message?.content.split(": ")[1]
				?? `Purged by ${interaction.user.username}#${interaction.user.discriminator}`
			await bot.helpers.deleteChannel(BigInt(channelID), reason)
				.then(() => respond(bot, interaction, { content: `${shorthand("success")} Deleted the channel`, components: [] }))
				.catch(err => error(bot, interaction, err, "Channel Deletion", true))
			break
		}

		case "messages": {
			if (checkPermission(bot, interaction, Permissions.MANAGE_MESSAGES)) return
			if (interaction.channelId === undefined) return respond(bot, interaction, "Cannot get current channel")
			const [, , amount, option, user] = customID
			const reason = interaction.message?.content.split(": ")[1]
				?? `Purged by ${interaction.user.username}#${interaction.user.discriminator}`

			let clear = (await bot.helpers.getMessages(interaction.channelId, { limit: parseInt(amount) }))
			if (option != "null" || user != "undefined") {
				clear = clear.filter(msg => {
					let cond = false
					if (option == "bots") cond = cond || msg.isFromBot
					if (option == "users") cond = cond || !msg.isFromBot
					if (user != "undefined") cond = cond || (msg.authorId == BigInt(user))
					return cond
				})
			}

			if (clear.size < 1) return await respond(bot, interaction, `${shorthand("warn")} Found no messages to purge`)
			else {
				await purge(bot, interaction.channelId, clear.map(msg => msg.id), reason)
					.then(() => {
						respond(bot, interaction, `${shorthand("success")} Found and purged ${clear.size}/${amount} messages`)
						console.botLog(`Found and purged ${clear.size}/${amount} messages`)
					})
					.catch(err => error(bot, interaction, err, "Message Purge", true))
			}
		}
	}
}

function purge(bot: Bot, channelId: bigint, messages: bigint[], reason?: string) {
	if (messages.length > 1) return bot.helpers.deleteMessages(channelId, messages, reason)
	else return bot.helpers.deleteMessage(channelId, messages[0], reason)
}
