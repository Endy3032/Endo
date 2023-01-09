import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, Interaction } from "discordeno"
import { respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "message",
	description: "Send a custom message to this channel",
	type: ApplicationCommandOptionTypes.SubCommand,
}

export async function main(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)
	if (!interaction.channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

	await respond(bot, interaction, "Message builder is currently unavailable", true)
}
