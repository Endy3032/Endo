import { ActionRow, ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, ButtonComponent, ButtonStyles, ChannelTypes, Embed,
	Interaction, MessageComponents, MessageComponentTypes, SelectMenuComponent, TextStyles } from "discordeno"
import { defer, edit, respond } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "message",
	description: "Send a customized message",
	type: ApplicationCommandOptionTypes.SubCommand,
}

// #region Default
const defaultEmbed: Embed = {
	author: { name: "Author", iconUrl: "https://cdn.discordapp.com/embed/avatars/0.png" },
	title: "Title",
	description: "Description",
	image: { url: "https://support.discord.com/hc/article_attachments/1500017894801/5.13_Brand_Refresh_Changelog-Header.jpg" },
	thumbnail: { url: "https://cdn.discordapp.com/embed/avatars/1.png" },
	footer: { text: "Footer", iconUrl: "https://cdn.discordapp.com/embed/avatars/2.png" },
}

// #region Components
const channelPicker: ActionRow = {
	type: MessageComponentTypes.ActionRow,
	// @ts-ignore
	components: [{
		type: 8, // MessageComponentTypes.SelectMenuChannels,
		customId: "target",
		placeholder: "Target channel",
		maxValues: 1,
		// @ts-ignore
		channel_types: ChannelTypes.GuildText
			| ChannelTypes.GuildAnnouncement
			| ChannelTypes.AnnouncementThread
			| ChannelTypes.PublicThread
			| ChannelTypes.PrivateThread,
	}],
}

const elementsPicker: ActionRow = {
	type: MessageComponentTypes.ActionRow,
	components: [
		{
			type: MessageComponentTypes.SelectMenu,
			customId: "elements",
			placeholder: "Elements in the message embed",
			minValues: 1,
			maxValues: 6,
			options: [
				{
					label: "Author",
					value: "author",
					description: "Name, Icon, URL at the top of the embed",
					default: true,
				},
				{
					label: "Title",
					value: "title",
					description: "Title, URL below Author",
					default: true,
				},
				{
					label: "Description",
					value: "description",
					description: "Text below Title",
					default: true,
				},
				{
					label: "Thumbnail",
					value: "thumbnail",
					description: "Right side image URL",
					default: true,
				},
				{
					label: "Image",
					value: "image",
					description: "Bottom image URL",
					default: true,
				},
				{
					label: "Footer",
					value: "footer",
					description: "Text, Icon, URL at the bottom of the embed",
					default: true,
				},
			],
		},
	],
}

const elementEditor: ActionRow = {
	type: MessageComponentTypes.ActionRow,
	components: [{
		type: MessageComponentTypes.SelectMenu,
		customId: "edit",
		placeholder: "Edit Element",
		options: [
			{
				label: "Author",
				description: "Name, Icon, URL for the top of the embed",
				value: "author",
			},
			{
				label: "Content",
				description: "Message, Title, Title URL, Description",
				value: "content",
			},
			{
				label: "Images",
				description: "Bottom Image & Right Thumbnail",
				value: "image",
			},
			{
				label: "Footer",
				description: "Text, Icon, Timestamp for the bottom of the embed",
				value: "footer",
			},
		],
	}],
}

const fieldEditor: ActionRow = {
	type: MessageComponentTypes.ActionRow,
	components: [{
		type: MessageComponentTypes.SelectMenu,
		customId: "fields",
		placeholder: "Edit Fields",
		options: [{
			label: "Add Field",
			value: "add",
			description: "Add a field to the embed",
		}],
	}],
}

const buttons: ActionRow = {
	type: MessageComponentTypes.ActionRow,
	components: [
		{
			type: MessageComponentTypes.Button,
			customId: "cancel",
			label: "Cancel",
			style: ButtonStyles.Danger,
		},
		{
			type: MessageComponentTypes.Button,
			customId: "send",
			label: "Send",
			style: ButtonStyles.Primary,
		},
	],
}
// #endregion

// #endregion

export async function main(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)
	if (!interaction.channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

	await respond(bot, interaction, {
		embeds: [defaultEmbed],
		components: [channelPicker, elementsPicker, elementEditor, fieldEditor, buttons],
	}, true)
}

export async function select(bot: Bot, interaction: Interaction) {
	if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

	switch (interaction.data?.customId) {
		case "target": {
			await defer(bot, interaction)
			break
		}

		case "elements": {
			await defer(bot, interaction)

			const elements = interaction.data?.values ?? []
			let embed: Embed = Object.fromEntries(
				new Map(
					["author", "title", "description", "thumbnail", "image", "footer"].map(
						e => [e, elements.includes(e) ? defaultEmbed[e] : undefined],
					),
				),
			)

			const components = [channelPicker, elementsPicker, elementEditor, fieldEditor, buttons]

			const modifiedElementsPicker = (components[1].components[0] as SelectMenuComponent).options
			;(components[1].components[0] as SelectMenuComponent).options = modifiedElementsPicker.map(
				e => ({ ...e, default: elements.includes(e.value) }),
			)

			await edit(bot, interaction, { embeds: [embed], components })
			break
		}

		case "edit": {
			const element = interaction.data?.values?.[0] ?? "content"

			switch (element) {
				case "author": {
					await respond(bot, interaction, {
						title: "Author",
						customId: "utils/message",
						components: [
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "authorName",
									label: "Name",
									placeholder: interaction.user.username,
									style: TextStyles.Short,
									required: true,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "authorIcon",
									label: "Icon",
									placeholder: "https://example.com/icon.png",
									style: TextStyles.Short,
									required: false,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "authorUrl",
									label: "URL",
									placeholder: "https://example.com",
									style: TextStyles.Short,
									required: false,
								}],
							},
						],
					})
					break
				}

				case "content": {
					await respond(bot, interaction, {
						title: "Content",
						customId: "utils/message",
						components: [
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "message",
									label: "Message",
									placeholder: "Message",
									style: TextStyles.Paragraph,
									required: false,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "title",
									label: "Title",
									placeholder: "Title",
									style: TextStyles.Short,
									required: true,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "titleUrl",
									label: "Title URL",
									placeholder: "https://example.com",
									style: TextStyles.Short,
									required: false,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "description",
									label: "Description",
									placeholder: "Description",
									style: TextStyles.Paragraph,
									required: false,
								}],
							},
						],
					})
					break
				}

				case "image": {
					await respond(bot, interaction, {
						title: "Image",
						customId: "utils/message",
						components: [
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "image",
									label: "Image URL",
									placeholder: "https://example.com/image.png",
									style: TextStyles.Short,
									required: false,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "thumbnail",
									label: "Thumbnail URL",
									placeholder: "https://example.com/thumbnail.png",
									style: TextStyles.Short,
									required: false,
								}],
							},
						],
					})
					break
				}

				case "footer": {
					await respond(bot, interaction, {
						title: "Footer",
						customId: "utils/message",
						components: [
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "footerText",
									label: "Text",
									placeholder: interaction.user.username,
									style: TextStyles.Short,
									required: true,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "footerIcon",
									label: "Icon",
									placeholder: "https://example.com/icon.png",
									style: TextStyles.Short,
									required: false,
								}],
							},
							{
								type: MessageComponentTypes.ActionRow,
								components: [{
									type: MessageComponentTypes.InputText,
									customId: "authorUrl",
									label: "Timestamp",
									placeholder: "True for current time, False to disable, or an epoch millisecond",
									style: TextStyles.Short,
									required: false,
								}],
							},
						],
					})
					break
				}
			}

			break
		}

		default: {
			await defer(bot, interaction)
			break
		}
	}
}
