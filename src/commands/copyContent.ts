import { stripIndents } from "commonTags"
import { ApplicationCommandTypes, Bot, CreateContextApplicationCommand, Interaction } from "discordeno"
import { respond } from "modules"

export const cmd: CreateContextApplicationCommand = {
	name: "Raw Content",
	type: ApplicationCommandTypes.Message,
}

export async function main(bot: Bot, interaction: Interaction) {
	const message = interaction.data?.resolved?.messages?.first()

	if (!message) return respond(bot, interaction, "Unable to fetch the message", true)

	const attachments = message.attachments.map(attachment => attachment.proxyUrl)
	const messageContent = escapeMarkdown(message.content ?? "")

	const content = `${messageContent.length > 0 ? messageContent : "None"}\n\n`
		+ `**${attachments?.length} Attachment(s)**\n${attachments?.map(attachment => `<${attachment}>`).join("\n")}`

	await respond(bot, interaction, `${content}`, true)
}

/** Source https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Util.js#L75 */
function escapeMarkdown(text: string) {
	return text
		// Basic Formatting
		.replaceAll("`", "\\`")
		.replaceAll("*", "\\*")
		.replaceAll("_", "\\_")
		.replaceAll("~", "\\~")
		.replaceAll("|", "\\|")
		.replaceAll("<t:", "\\<t:")
		// Masked Link
		.replaceAll(/\[.+\]\(.+\)/gm, "\\$&")
		// Forum Markdown
		// Heading
		.replaceAll(/^( {0,2}[*-] +)?(#{1,3} )/gm, "$1\\$2")
		// Bulleted List
		.replaceAll(/^( *)[*-]( +)/gm, "$1\\-$2")
		// Numbered List
		.replaceAll(/^( *\d+)\./gm, "$1\\.")
}
