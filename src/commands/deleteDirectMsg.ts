import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction } from "discordeno"
import { respond, shorthand } from "modules"

export const cmd: CreateContextApplicationCommand = {
	name: "Delete Message",
	type: ApplicationCommandTypes.Message,
}

export async function main(bot: Bot, interaction: Interaction) {
	if (interaction.guildId) return await respond(bot, interaction, `${shorthand("warn")} This command is exclusive to my DM`, true)

	const message = interaction.data?.resolved?.messages?.first()

	if (message?.author.id !== bot.id) {
		return await respond(bot, interaction, `${shorthand("warn")} This command is exlusive to my messages`, true)
	}

	const channel = await bot.helpers.getDmChannel(interaction.user.id)
	await bot.helpers.deleteMessage(channel.id, message.id)
	await respond(bot, interaction, `${shorthand("success")} Deleted the message!`, true)
}
