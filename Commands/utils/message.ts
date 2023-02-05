import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction, MessageComponentTypes } from "discordeno"
import { respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "message",
	description: "Send a custom message to this channel",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)
	if (!interaction.channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

	await respond(bot, interaction, {
		content: "**Message Builder** [Incomplete until Modal supports select]",
		components: [
			{
				type: MessageComponentTypes.ActionRow,
				// @ts-ignore
				components: [{
					type: 8, // MessageComponentTypes.SelectMenuChannels,
					customId: "target",
					placeholder: "Target channel",
					minValues: 1,
					maxValues: 3,
					// @ts-ignore
					// channel_types: 0 + 5 + 10 + 11 + 12,
				}],
			},
			{
				type: MessageComponentTypes.ActionRow,
				components: [{
					type: MessageComponentTypes.SelectMenu,
					customId: "elements",
					placeholder: "Elements in the message embed",
					options: [
						{ label: "Title", value: "title" },
						{ label: "Description", value: "description" },
						{ label: "Image", value: "image" },
						{ label: "Thumbnail", value: "thumbnail" },
						{ label: "Author", value: "author" },
						{ label: "Footer", value: "footer" },
					],
				}],
			},
		],
	}, true)
}
