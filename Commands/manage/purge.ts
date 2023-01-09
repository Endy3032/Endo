import { ApplicationCommandOption, ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ButtonStyles,
	Interaction, MessageComponentTypes } from "discordeno"
import { checkPermission, emojis, getValue, respond } from "modules"

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
	if (checkPermission(bot, interaction, Permissions.MANAGE_MESSAGES)) return
	const amount = getValue(interaction, "amount", "Integer") ?? 0
	const option = getValue(interaction, "option", "String")
	const user = getValue(interaction, "user", "User")
	const reason = getValue(interaction, "reason", "String")
		?? `Purged by ${interaction.user.username}#${interaction.user.discriminator}`

	let content = `Confirm to delete \`${amount}\` messages `
	content += option && user
		? `from <@${user.user.id}> and ${option} only `
		: option || user
		? `from ${user ? `<@${user.user.id}>` : option} only `
		: ""
	content += `with the following reason: ${reason}`

	await respond(bot, interaction, {
		content,
		components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
				type: MessageComponentTypes.Button,
				label: "Delete",
				customId: `delete-messages-${amount}-${option}-${user?.user.id}`,
				style: ButtonStyles.Danger,
				emoji: { id: emojis.trash },
			}],
		}],
	}, true)
}
