import { ApplicationCommandTypes, CreateContextApplicationCommand, delay, MessageComponents } from "discordeno"
import { Button, Row } from "jsx"
import { ButtonHandler, InteractionHandler } from "modules"

export const cmd: CreateContextApplicationCommand = {
	name: "Delete Response",
	type: ApplicationCommandTypes.Message,
}

export const main: InteractionHandler = async (bot, interaction, args) => {
	const { message } = args

	if (!message) return await interaction.respond("Unable to get message", { isPrivate: true })

	const dm = await bot.rest.getDmChannel(interaction.user.id)
	const isDm = dm.id === interaction.channelId?.toString()

	if (!isDm && (message?.interaction?.user?.id !== interaction.user.id || message?.author.id !== bot.id)) {
		return await interaction.respond("You can only delete my response from your interaction", { isPrivate: true })
	}

	await interaction.respond({
		content: `Are you sure you want to delete https://discord.com/channels/${
			[isDm ? "@me" : interaction.guildId, message?.channelId, message?.id].join("/")
		}`,
		components: [(
			<Row>
				<Button label="Delete" customId="delete" style="Danger" />
				{isDm ? undefined : <Button label="Delete and send a backup to DM" customId="backup" style="Secondary" />}
			</Row>
		)],
	}, { isPrivate: true })
}

export const button: ButtonHandler = async (bot, interaction, args) => {
	await interaction.defer()

	const msg = interaction.message?.content, backup = args.customId === "backup"
	const [, channelId, messageId] = msg?.match(/(?<=channels\/[^\/]+\/)(\d+)\/(\d+)$/) ?? []

	let content = "Deleted Successfully"

	if (!channelId || !messageId) {
		console.botLog(`Unable to get message\n${msg}`, { logLevel: "WARN" })

		const response = await interaction.respond("Unable to get message", { isPrivate: true })
		return response ? delay(3000).then(() => interaction.delete(response.id)) : null
	}

	if (backup) {
		const dm = await bot.rest.getDmChannel(interaction.user.id)
		if (!dm) return await interaction.respond("Unable to get DM channel", { isPrivate: true })

		const message = await bot.rest.getMessage(channelId, messageId)

		await bot.rest.sendMessage(dm.id, {
			content: message.content,
			embeds: message.embeds,
			components: message.components as MessageComponents | undefined,
		}).then(res => content += ` and sent a backup to https://discord.com/channels/@me/${dm.id}/${res.id}`)
	}

	bot.rest.deleteMessage(channelId, messageId)
	await interaction.edit({ content, components: [] })
	delay(3000).then(() => interaction.delete())
}
