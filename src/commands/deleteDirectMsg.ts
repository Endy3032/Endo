import { ApplicationCommandTypes, CreateContextApplicationCommand } from "discordeno"
import { InteractionHandler, respond, shorthand } from "modules"

export const cmd: CreateContextApplicationCommand = {
	name: "Delete Message",
	type: ApplicationCommandTypes.Message,
}

export const main: InteractionHandler = async (bot, interaction, args) => {
	const { message } = args

	if (message?.interaction?.user?.id !== interaction.user.id) {
		return respond(bot, interaction, `${shorthand("warn")} You can only delete responses from your interaction`, true)
	}

	if (message?.author.id !== bot.id) {
		return await respond(bot, interaction, `${shorthand("warn")} You can only delete my messages`, true)
	}

	const channel = await bot.helpers.getDmChannel(interaction.user.id)
	console.log(interaction.channelId, channel.id)

	// await bot.helpers.deleteMessage(interaction.channelId ?? channel.id, message.id)
	await respond(bot, interaction, `${shorthand("success")} Deleted the message!`, true)
}
