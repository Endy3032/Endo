import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction } from "discordeno"
import { respond, shorthand } from "modules"

export const cmd: CreateContextApplicationCommand = {
	name: "Delete Message",
	type: ApplicationCommandTypes.Message,
}

export async function execute(bot: Bot, interaction: Interaction) {
	if (interaction.guildId) return await respond(bot, interaction, `${shorthand("warn")} This command can only be used in my DM.`, true)

	const message = interaction.data?.resolved?.messages?.array()[0]
	if (message?.authorId !== bot.id) {
		return await respond(bot, interaction, `${shorthand("warn")} This action is used to delete my message`, true)
	}

	const channel = await bot.helpers.getDmChannel(interaction.user.id)
	await bot.helpers.deleteMessage(channel.id, message.id)
	await respond(bot, interaction, `${shorthand("success")} Deleted the message!`, true)
}
