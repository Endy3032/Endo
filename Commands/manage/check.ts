import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, ChannelTypes, Interaction } from "discordeno"
import { getSubcmd, respond, shorthand } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "check",
	description: "Check some server informations",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "position",
			description: "Check the channels' position",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

	switch (getSubcmd(interaction)) {
		case "position": {
			const channels = (await bot.helpers.getChannels(interaction.guildId)).array().sort((a, b) =>
				(a.position ?? 0) > (b.position ?? 1) ? 1 : -1
			)

			await respond(bot, interaction, {
				embeds: [{
					title: "Channels Position",
					fields: [
						{
							name: "Categories",
							value: channels
								.filter(channel => channel.type == ChannelTypes.GuildCategory)
								.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
							inline: false,
						},
						{
							name: "Text Channels",
							value: channels
								.filter(channel => channel.type == ChannelTypes.GuildText)
								.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
							inline: false,
						},
						{
							name: "Voice Channels",
							value: channels
								.filter(channel => channel.type == ChannelTypes.GuildVoice)
								.map(channel => `<#${channel.id}> ${channel.position}`).join("\n"),
							inline: false,
						},
					],
				}],
			})
			break
		}
	}
}
