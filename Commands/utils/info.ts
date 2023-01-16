import { format } from "bytes"
import { stripIndents } from "commonTags"
import { ApplicationCommandOption, ApplicationCommandOptionTypes, Bot, ChannelTypes, DiscordApplication, DiscordEmbedField,
	DiscordUser, Interaction } from "discordeno"
import { colors, getSubcmd, getValue, imageURL, pickArray, respond, toTimestamp } from "modules"

export const cmd: ApplicationCommandOption = {
	name: "info",
	description: "Get info about the server",
	type: ApplicationCommandOptionTypes.SubCommandGroup,
	options: [
		{
			name: "bot",
			description: "Get info about this bot",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "channel",
			description: "Get info about a channel",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "target",
					description: "The channel to get info about [Channel] (Default: Current channel)",
					type: ApplicationCommandOptionTypes.Channel,
				},
			],
		},
		{
			name: "server",
			description: "Get info about this server",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "user",
			description: "Get info about a user",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "target",
					description: "The user to get info [User] (Default: You)",
					type: ApplicationCommandOptionTypes.User,
				},
			],
		},
	],
}

export async function main(bot: Bot, interaction: Interaction) {
	switch (getSubcmd(interaction)) {
		case "bot": {
			const app = await bot.rest.runMethod<DiscordApplication>(
				bot.rest,
				"GET",
				bot.constants.routes.OAUTH2_APPLICATION(),
			)

			const timestamp = toTimestamp(bot.id)

			const owner = app.team
				? app.team.members.find(m => m.user.id === app.team?.owner_user_id)?.user
				: await bot.helpers.getUser(app.owner?.id ?? bot.id)

			const inviteLink = `https://discord.com/oauth2/authorize?client_id=${bot.id}`
				+ `&permissions=${app.install_params?.permissions ?? 0}&scope=${app.install_params?.scopes.join("%20") ?? "bot"}`

			const ddeno = bot.constants.DISCORDENO_VERSION
			const { version: { deno, v8, typescript } } = Deno
			const { rss, heapUsed, heapTotal } = Deno.memoryUsage()

			await respond(bot, interaction, { embeds: [{
				author: { name: `About @${app.name}` },
				color: pickArray(colors),
				description: app.description,
				fields: [
					{ name: "Owner", value: `${owner?.username}#${owner?.discriminator}`, inline: true },
					{
						name: "Invite",
						value: `[Link](${inviteLink})`,
						inline: true,
					},
					{ name: "Created", value: `<t:${timestamp}:R>`, inline: true },
					{
						name: "Runtime Info",
						value: stripIndents`**Deno** • [${deno}](https://deno.land/x/deno@v${deno})
							V8 • [${v8}](https://github.com/v8/v8/releases/tag/${v8})
							TypeScript • [${typescript}](https://github.com/microsoft/TypeScript/releases/tag/${typescript})
							Discordeno • [${ddeno}](https://deno.land/x/discordeno@${ddeno}/mod.ts)`,
						inline: true,
					},
					{
						name: "Memory Usage",
						value: stripIndents`**RSS** • ${format(rss)}
							**Heap** • ${format(heapUsed)}/${format(heapTotal)}`,
						inline: true,
					},
				],
				thumbnail: { url: imageURL(bot.id, app.icon, "app-icons") },
			}] })
			break
		}

		case "channel": {
			if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)

			const channelId = getValue(interaction, "target", "Channel")?.id ?? interaction.channelId
			if (!channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

			const channel = await bot.helpers.getChannel(channelId)
			const timestamp = toTimestamp(channelId)

			const fields: DiscordEmbedField[] = ![ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel?.type)
				? [
					{ name: "NSFW", value: `${channel?.nsfw ? "Yes" : "No"}`, inline: true },
					{ name: "Topic", value: `${channel?.topic ?? "None"}`, inline: true },
				]
				: [
					{ name: "Bitrate", value: `${(channel?.bitrate ?? 0) / 1000}Kbps`, inline: true },
					{ name: "User Limit", value: `${channel?.userLimit}`, inline: true },
				]

			await respond(bot, interaction, { embeds: [{
				author: { name: `#${channel?.name}` },
				color: pickArray(colors),
				fields: [
					{ name: "ID", value: `${channel?.id}`, inline: true },
					{ name: "Type", value: `${ChannelTypes[channel?.type]}`, inline: true },
					{ name: "Position", value: `${channel?.position}`, inline: true },
					...fields,
					{ name: "Created", value: `<t:${timestamp}:R>`, inline: true },
				],
			}] })
			break
		}

		case "server": {
			if (!interaction.guildId) return respond(bot, interaction, "This action can only be performed in a server", true)

			const guild = await bot.helpers.getGuild(interaction.guildId, { counts: true })
			if (!guild) return respond(bot, interaction, "Failed to fetch informations about this server", true)

			const channels = await bot.helpers.getChannels(interaction.guildId)
			const emojis = await bot.helpers.getEmojis(interaction.guildId)

			const verificationLevel = ["Unrestricted", "Verified Email", "Registered for >5m", "Member for >10m", "Verified Phone"]
			const filterLevel = ["Not Scanned", "Scan Without Roles", "Scan Everything"]

			await respond(bot, interaction, {
				embeds: [{
					author: { name: guild.name },
					color: pickArray(colors),
					description: guild.description ? `Server Description: ${guild.description}` : "",
					fields: [
						{ name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
						{ name: "Created", value: `<t:${toTimestamp(guild.id)}:R>`, inline: true },
						{ name: "Vanity Invite URL", value: guild.vanityUrlCode ?? "None", inline: true },
						{ name: "Verification Level", value: verificationLevel[guild.verificationLevel], inline: true },
						{ name: "Content Filter Level", value: filterLevel[guild.explicitContentFilter], inline: true },
						{
							name: "AFK Channel",
							value: guild.afkChannelId ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60} Min Timeout)` : "None",
							inline: true,
						},
						{
							name: "General Info",
							value: stripIndents`~${guild.approximateMemberCount} Members
								${guild.roles.size} Roles
								${guild.emojis.size} Emojis
								┣ ${emojis.filter(e => !e.toggles.animated).size} static
								┗ ${emojis.filter(e => e.toggles.animated).size} animated`,
							inline: true,
						},
						{
							name: "Channels Count",
							value: stripIndents`${channels.filter(c => c.type === ChannelTypes.GuildCategory).size} Categories
								${channels.filter(c => c.type === ChannelTypes.GuildText).size} Text
								${channels.filter(c => c.type === ChannelTypes.GuildVoice).size} Voice
								${channels.filter(c => c.type === ChannelTypes.GuildStageVoice).size} Stages`,
							inline: true,
						},
					],
					image: guild.banner ? { url: imageURL(guild.id, guild.banner, "banners") } : undefined,
					thumbnail: guild.icon ? { url: imageURL(guild.id, guild.icon, "icons") } : undefined,
					footer: { text: `Server ID • ${guild.id}` },
				}],
			})
			break
		}

		case "user": {
			const { user } = getValue(interaction, "target", "User") ?? interaction
			const discordUser = await bot.rest.runMethod<DiscordUser>(bot.rest, "GET", bot.constants.routes.USER(user.id))
			const createdAt = toTimestamp(user.id)

			await respond(bot, interaction, {
				embeds: [{
					author: { name: user.username },
					color: discordUser.accent_color ?? pickArray(colors),
					fields: [
						{ name: "Tag", value: user.discriminator, inline: true },
						{ name: "ID", value: user.id.toString(), inline: true },
						{ name: "Joined", value: `<t:${createdAt}:R>`, inline: true },
					],
					image: discordUser.banner ? { url: imageURL(user.id, discordUser.banner, "banners") } : undefined,
					thumbnail: user.avatar ? { url: imageURL(user.id, user.avatar, "avatars") } : undefined,
				}],
			})
			break
		}
	}
}
