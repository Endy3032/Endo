import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ButtonStyles,
	Interaction, MessageComponentTypes } from "discordeno"
import { checkPermission, defer, edit, emojis, getValue, respond, shorthand } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "purge",
	description: "Purge messages",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
		{
			name: "amount",
			description: "Amount of messages to purge [Integer 1~100]",
			type: ApplicationCommandOptionTypes.Integer,
			minValue: 1,
			maxValue: 100,
			required: true,
		},
		{
			name: "option",
			description: "Option to filter messages",
			type: ApplicationCommandOptionTypes.String,
			choices: [
				{ name: "Bots Only", value: "bots" },
				{ name: "Users Only", value: "users" },
				// { name: "Texts Only", value: "texts" },
				// { name: "Mentions Only", value: "mentions" },
				// { name: "Links Only", value: "links" },
				// { name: "Embeds Only", value: "embeds" },
				// { name: "Attachments Only", value: "attachments" },
			],
			required: false,
		},
		{
			name: "user",
			description: "Specific user to purge messages",
			type: ApplicationCommandOptionTypes.User,
			required: false,
		},
		{
			name: "reason",
			description: "Reason for creation [Length 0~512]",
			type: ApplicationCommandOptionTypes.String,
			required: false,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	const blockMsg = checkPermission(interaction, Permissions.MANAGE_MESSAGES)
	if (blockMsg) return await edit(bot, interaction, blockMsg)

	const amount = getValue(interaction, "amount", "Integer") ?? 0
	const option = getValue(interaction, "option", "String")
	const user = getValue(interaction, "user", "User")
	const reason = getValue(interaction, "reason", "String")
		?? `Purged by ${interaction.user.username}#${interaction.user.discriminator}`

	let content = `${shorthand("warn")} Confirm purging \`${amount}\` messages`
	content += option && user
		? `\n**From:** <@${user.user.id}> and ${option} only`
		: option || user
		? `\n**From:** ${user ? `<@${user.user.id}>` : option} only`
		: ""
	content += `\n**Reason:** ${reason}`

	await respond(bot, interaction, {
		content,
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.Button,
				label: "Delete",
				customId: `${amount} ${option} ${user?.user.id}`,
				style: ButtonStyles.Danger,
				emoji: { id: BigInt(emojis.trash) },
			}],
		}],
	}, true)
}

export async function button(bot: Bot, interaction: Interaction) {
	if (!interaction.channelId) return edit(bot, interaction, "Cannot get current channel")

	await defer(bot, interaction)

	const customID = (interaction.data?.customId ?? "").split(" ")

	const [amount, option, user] = customID

	const reason = interaction.message?.content.split(": ")[1]
		?? `Purged by ${interaction.user.username}#${interaction.user.discriminator}`

	let clear = await bot.helpers.getMessages(interaction.channelId, { limit: parseInt(amount) })
	if (option != "null" || user != "undefined") {
		clear = clear.filter(msg => {
			let cond = false
			if (option == "bots") cond = cond || msg.author.bot
			if (option == "users") cond = cond || !msg.author.bot
			if (user != "undefined") cond = cond || (msg.author.id == BigInt(user))
			return cond
		})
	}

	if (clear.length < 1) return await edit(bot, interaction, `${shorthand("warn")} Found no messages to purge`)
	else {
		await purge(bot, interaction.channelId, clear.map(msg => msg.id), reason)
			.then(() => {
				respond(bot, interaction, `${shorthand("success")} Found and purged ${clear.length}/${amount} messages`)
				console.botLog(`Found and purged ${clear.length}/${amount} messages`)
			})
		// .catch(err => error(bot, interaction, err, "Message Purge", true))
	}
}

function purge(bot: Bot, channelId: bigint, messages: bigint[], reason?: string) {
	if (messages.length > 1) return bot.helpers.deleteMessages(channelId, messages, reason)
	else return bot.helpers.deleteMessage(channelId, messages[0], reason)
}
