import { format } from "bytes"
import { Color } from "colorConvert"
import { stripIndents } from "commonTags"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, ChannelTypes, CreateApplicationCommand, DiscordEmbedField,
	DiscordUser, Interaction, MessageComponents } from "discordeno"
import Fuse from "fuse"
import { evaluate } from "mathjs"
import { BotPerms, colors, escapeMarkdown, getFocused, getSubcmd, getSubcmdGroup, getValue, imageURL, pickArray, randRange, respond,
	timezone, toTimestamp } from "modules"
import { Temporal } from "temporal"
import { timezone as timezones } from "time"

export const cmd: CreateApplicationCommand = {
	name: "utils",
	description: "Random utilities",
	defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
	options: [
		{
			name: "color",
			description: "Return a preview of the color",
			type: ApplicationCommandOptionTypes.SubCommandGroup,
			options: [
				{
					name: "random",
					description: "Feeling lucky?",
					type: ApplicationCommandOptionTypes.SubCommand,
				},
				{
					name: "rgb",
					description: "Get a color from RGB values",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "red",
							description: "Red [Integer 0~255] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 255,
							required: true,
						},
						{
							name: "green",
							description: "Green [Integer 0~255] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 255,
							required: true,
						},
						{
							name: "blue",
							description: "Blue [Integer 0~255] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 255,
							required: true,
						},
					],
				},
				{
					name: "decimal",
					description: "Get a color from decimal value",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [{
						name: "value",
						description: "Decimal value [Integer 0~16777215] (Fallback: 0)",
						type: ApplicationCommandOptionTypes.Integer,
						minValue: 0,
						maxValue: 16777215,
						required: true,
					}],
				},
				{
					name: "hex",
					description: "Get a color from hex value",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [{
						name: "value",
						description: "Hex value [Hex String 000000~FFFFFF] (Fallback: 000000)",
						type: ApplicationCommandOptionTypes.String,
						required: true,
					}],
				},
				{
					name: "hsl",
					description: "Get a color from HSL values",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "hue",
							description: "Hue [Integer 0~360] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 360,
							required: true,
						},
						{
							name: "saturation",
							description: "Saturation [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
						{
							name: "value",
							description: "Lightness [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
					],
				},
				{
					name: "hsv",
					description: "Get a color from HSV values",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "hue",
							description: "Hue [Integer 0~360] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 360,
							required: true,
						},
						{
							name: "saturation",
							description: "Saturation [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
						{
							name: "value",
							description: "Value [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
					],
				},
				{
					name: "cmyk",
					description: "Get a color from CMYK values",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "cyan",
							description: "The cyan value of the CMYK color [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
						{
							name: "magenta",
							description: "The magenta value of the CMYK color [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
						{
							name: "yellow",
							description: "The yellow value of the CMYK color [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
						{
							name: "key",
							description: "The key value of the CMYK color [Integer 0~100] (Fallback: 0)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 0,
							maxValue: 100,
							required: true,
						},
					],
				},
			],
		},
		{
			name: "calculate",
			description: "Calculate an expression and return the result",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [{
				name: "expression",
				description: "The expression to calculate [String]",
				type: ApplicationCommandOptionTypes.String,
				required: true,
			}],
		},
		{
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
		},
		{
			name: "ping",
			description: "Get the bot's latency info",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "poll",
			description: "Make a poll [Unfinished]",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "random",
			description: "Feeling lucky?",
			type: ApplicationCommandOptionTypes.SubCommandGroup,
			options: [
				{
					name: "coin",
					description: "Feeling lucky? Flip some coins",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [{
						name: "amount",
						description: "Coins count [Integer 1~10] (Fallback: 3)",
						type: ApplicationCommandOptionTypes.Integer,
						minValue: 1,
						maxValue: 10,
						required: true,
					}],
				},
				{
					name: "dice",
					description: "Feeling lucky? Roll some dice",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [{
						name: "amount",
						description: "Dice count [Integer 1~10] (Fallback: 3)",
						type: ApplicationCommandOptionTypes.Integer,
						minValue: 1,
						maxValue: 10,
						required: true,
					}],
				},
				{
					name: "number",
					description: "Feeling lucky? Generate some random numbers",
					type: ApplicationCommandOptionTypes.SubCommand,
					options: [
						{
							name: "amount",
							description: "Random number count [Integer 1~10] (Fallback: 3)",
							type: ApplicationCommandOptionTypes.Integer,
							minValue: 1,
							maxValue: 10,
							required: true,
						},
						{
							name: "min",
							description: "The numbers' lower bound [Integer] (Default: 0)",
							type: ApplicationCommandOptionTypes.Integer,
						},
						{
							name: "max",
							description: "The numbers' upper bound [Integer] (Default: 100)",
							type: ApplicationCommandOptionTypes.Integer,
						},
					],
				},
			],
		},
		{
			name: "message",
			description: "Send a custom message to this channel",
			type: ApplicationCommandOptionTypes.SubCommand,
		},
		{
			name: "timestamp",
			description: "Get the current timestamp or from a provided date",
			type: ApplicationCommandOptionTypes.SubCommand,
			options: [
				{
					name: "year",
					description: "The timestamp's year [Integer 0~275760]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					// maxValue: 275760,
					required: false,
				},
				{
					name: "month",
					description: "The timestamp's month [Integer 1~12]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 1,
					maxValue: 12,
					required: false,
				},
				{
					name: "day",
					description: "The timestamp's day [Integer 1~31]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 1,
					maxValue: 31,
					required: false,
				},
				{
					name: "hour",
					description: "The timestamp's hour [Integer 0~23]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 23,
					required: false,
				},
				{
					name: "minute",
					description: "The timestamp's minute [Integer 0~59]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 59,
					required: false,
				},
				{
					name: "second",
					description: "The timestamp's second [Integer 0~59]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 59,
					required: false,
				},
				{
					name: "millisecond",
					description: "The timestamp's millisecond [Integer 0~59]",
					type: ApplicationCommandOptionTypes.Integer,
					minValue: 0,
					maxValue: 999,
					required: false,
				},
				{
					name: "timezone",
					description: "The timestamp's timezone [String]",
					type: ApplicationCommandOptionTypes.String,
					autocomplete: true,
					required: false,
				},
			],
		},
	],
}

export async function execute(bot: Bot, interaction: Interaction) {
	switch (getSubcmdGroup(interaction)) {
		case "color": {
			let color: Color

			switch (getSubcmd(interaction)) {
				case "rgb": {
					const red = getValue(interaction, "red", "Integer") ?? 0
					const green = getValue(interaction, "green", "Integer") ?? 0
					const blue = getValue(interaction, "blue", "Integer") ?? 0

					color = Color.rgb(red, green, blue)
					break
				}

				case "decimal": {
					const value = getValue(interaction, "value", "Integer") ?? 0
					const hex = value.toString(16)
					const [red, green, blue] = (hex.length === 3 ? hex.split("") : hex.padStart(6, "0").match(/../g)) ?? ["0", "0", "0"]

					color = Color.rgb(parseInt(red), parseInt(green), parseInt(blue))
					break
				}

				case "hex": {
					const value = getValue(interaction, "value", "String") ?? "000000"
					const matched = value.match(/[0-9a-f]{1,6}/gi)?.reduce((a, b) => Math.abs(b.length - 6) < Math.abs(a.length - 6) ? b : a)
						?? "000000"
					const hex = parseInt(matched, 16)

					color = Color.rgb(hex >> 16, (hex >> 8) & 0xFF, hex & 0xFF)
					break
				}

				case "hsl": {
					const hue = getValue(interaction, "hue", "Integer") ?? 0
					const saturation = getValue(interaction, "saturation", "Integer") ?? 0
					const lightness = getValue(interaction, "lightness", "Integer") ?? 0

					color = Color.hsl(hue, saturation, lightness)
					break
				}

				case "hsv": {
					const hue = getValue(interaction, "hue", "Integer") ?? 0
					const saturation = getValue(interaction, "saturation", "Integer") ?? 0
					const value = getValue(interaction, "value", "Integer") ?? 0

					color = Color.hsv(hue, saturation, value)
					break
				}

				case "cmyk": {
					const cyan = getValue(interaction, "cyan", "Integer") ?? 0
					const magenta = getValue(interaction, "magenta", "Integer") ?? 0
					const yellow = getValue(interaction, "yellow", "Integer") ?? 0
					const key = getValue(interaction, "key", "Integer") ?? 0

					color = Color.cmyk(cyan, magenta, yellow, key)
					break
				}

				default: {
					color = Color.rgb(randRange(0, 255), randRange(0, 255), randRange(0, 255))
					break
				}
			}

			const rgb = color.rgb()
			const cmyk = color.cmyk()
			const hex = color.hex()
			const hsl = color.hsl()
			const hsv = color.hsv()

			await respond(bot, interaction, {
				embeds: [{
					title: "Color Conversion",
					color: color.rgbNumber(),
					fields: [
						{ name: "RGB", value: [rgb.red(), rgb.green(), rgb.blue()].join(", "), inline: true },
						{ name: "CMYK", value: [cmyk.cyan(), cmyk.magenta(), cmyk.yellow(), cmyk.black()].join(", "), inline: true },
						{ name: "Decimal", value: `${color.rgbNumber()}`, inline: true },
						{ name: "HEX", value: hex, inline: true },
						{ name: "HSL", value: [hsl.hue(), hsl.saturation(), hsl.lightness()].join(", "), inline: true },
						{ name: "HSV", value: [hsv.hue(), hsv.saturation(), hsv.value()].join(", "), inline: true },
					],
					thumbnail: { url: `https://dummyimage.com/256/${hex.slice(1)}/${hex.slice(1)}.png` },
				}],
			})
			break
		}

		case "info": {
			switch (getSubcmd(interaction)) {
				case "bot": {
					const app = await bot.helpers.getApplicationInfo()
					const timestamp = toTimestamp(bot.id)
					const owner = await bot.helpers.getUser(app.team?.ownerUserId ?? app.owner?.id ?? bot.id)
					const inviteLink =
						`https://discord.com/api/v9/oauth2/authorize?client_id=${bot.id}&permissions=${BotPerms}&scope=bot%20applications.commands`

					const { version: dnVer } = Deno
					const ddVer = bot.constants.DISCORDENO_VERSION
					const memory = Deno.memoryUsage()

					await respond(bot, interaction, { embeds: [{
						title: `${app.name} Info`,
						color: pickArray(colors),
						description: app.description,
						fields: [
							{ name: "Owner", value: `${owner?.username}#${owner?.discriminator}`, inline: true },
							{
								name: "Invite",
								value: `[Link](${inviteLink})`,
								inline: true,
							},
							{ name: "Creation Date", value: `<t:${timestamp}:f>\n<t:${timestamp}:R>`, inline: true },
							{
								name: "Version Info",
								value:
									`Deno ${dnVer.deno}\nV8 ${dnVer.v8}\nTypeScript ${dnVer.typescript}\nDiscordeno [${ddVer}](https://deno.land/x/discordeno@${ddVer}/mod.ts)`,
								inline: true,
							},
							{
								name: "Memory Usage",
								value: `**RSS** • ${format(memory.rss)}\n**Heap** • ${format(memory.heapUsed)}/${format(memory.heapTotal)}`,
								inline: true,
							},
						],
						thumbnail: { url: imageURL(bot.id, app.icon, "icons") },
					}] })
					break
				}

				case "channel": {
					if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)
					if (!interaction.channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

					const channelId = getValue(interaction, "target", "Channel")?.id ?? interaction.channelId
					const channel = await bot.helpers.getChannel(channelId)
					const timestamp = toTimestamp(channelId)

					const fields: DiscordEmbedField[] = ![ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice].includes(channel?.type)
						? [
							{ name: "NSFW", value: `${channel?.nsfw}`, inline: true },
							{ name: "Topic", value: `${channel?.topic}`, inline: true },
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
							{ name: "Type", value: `${channel?.type}`, inline: true },
							{ name: "Position", value: `${channel?.position}`, inline: true },
							...fields,
							{ name: "Creation Date", value: `<t:${timestamp}:f> (<t:${timestamp}:R>)`, inline: true },
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
								{ name: "Creation Date", value: `<t:${toTimestamp(guild.id)}:D>`, inline: true },
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
																			╰ ${emojis.filter(e => e.toggles.animated).size} animated`,
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
							image: { url: imageURL(guild.id, guild.banner, "banners") ?? "" },
							thumbnail: { url: imageURL(guild.id, guild.icon, "icons") ?? "" },
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
								{ name: "Creation Date", value: `<t:${createdAt}:f> (<t:${createdAt}:R>)`, inline: true },
							],
							image: { url: imageURL(user.id, discordUser.banner, "banners") },
							thumbnail: { url: imageURL(user.id, user.avatar, "avatars") },
						}],
					})
					break
				}
			}
			break
		}

		case "random": {
			const mode = getSubcmd(interaction)
			const amount = getValue(interaction, "amount", "Integer") ?? 3
			const min = getValue(interaction, "min", "Integer") ?? 0
			const max = getValue(interaction, "max", "Integer") ?? 100

			const embed = {
				title: mode === "coin" ? "Coin flip" : mode === "dice" ? "Dice roll" : "Random numbers",
				description: "",
			}
			let choices: (string | number)[] = []
			const results: (string | number)[] = []

			if (mode === "coin") choices = ["Head", "Tail"]
			else if (mode === "dice") choices = [1, 2, 3, 4, 5, 6]
			else if (mode === "number") {
				for (let i = 0; i < amount; i++) results.push(randRange(min, max))
				embed.description = results.join(", ")

				await respond(bot, interaction, { embeds: [embed] })
				break
			}

			for (let i = 0; i < amount; i++) results.push(pickArray(choices))
			embed.description = results.join(", ")

			await respond(bot, interaction, { embeds: [embed] })
			break
		}

		default: {
			switch (getSubcmd(interaction)) {
				case "calculate": {
					const expression = getValue(interaction, "expression", "String") ?? ""
					const symbols = ["π", "τ"]
					const symvals = [Math.PI, Math.PI * 2]

					const scope = new Map(symbols.map((v, i) => [v, symvals[i]]))

					try {
						let result = evaluate(expression, scope)
						if (typeof result === "number") result = result.toString()
						if (typeof result === "object") result = result.entries.join("; ")

						await respond(bot, interaction, {
							embeds: [{
								title: "Calculation",
								color: pickArray(colors),
								fields: [
									{ name: "Expression", value: `${escapeMarkdown(expression)}`, inline: false },
									{ name: "Result", value: `${escapeMarkdown(result)}`, inline: false },
								],
							}],
						})
					} catch (err) {
						console.botLog(err, { logLevel: "ERROR" })
						await respond(
							bot,
							interaction,
							`Cannot evaluate \`${expression}\`\n\`\`\`${err}\`\`\`${
								String(err).includes("Undefined symbol") ? "You may want to declare variables like `a = 9; a * 7` => 63" : ""
							}`,
							true,
						)
					}
					break
				}

				case "ping": {
					await respond(bot, interaction, "Pinging...")

					const original = await bot.helpers.getOriginalInteractionResponse(interaction.token)
					const noPing = bot.gateway.manager.shards.filter(shard => shard.heart.rtt === undefined).size
					const wsPing = bot.gateway.manager.shards.reduce((a, b) => b !== undefined ? a + (b.heart.rtt ?? 0) : a, 0)
						/ bot.gateway.manager.shards.size

					if (wsPing < 0) console.botLog(bot.gateway.manager.shards.map(shard => shard.heart))

					await bot.helpers.editOriginalInteractionResponse(interaction.token, {
						content: "",
						embeds: [{
							title: "Pong!",
							color: pickArray(colors),
							fields: [
								{
									name: "Websocket Latency",
									value: noPing ? "Not available" : `${wsPing}ms${wsPing < 0 ? " (how did this happen)" : ""}`,
									inline: false,
								},
								{
									name: "Roundtrip Latency",
									value: `${BigInt(original.timestamp) - toTimestamp(interaction.id, "ms")}ms`,
									inline: false,
								},
							],
						}],
					})
					break
				}

				// TODO Implement Polls
				case "poll": {
					const placeholders = [
						["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"],
						["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"],
						["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"],
					]
					const index = Math.floor(Math.random() * placeholders.length)

					const modalData: MessageComponents = []

					for (let i = 0; i < 5; i++) {
						modalData.push({
							type: 1,
							components: [{
								type: 4,
								label: i === 0 ? "Question" : `Option ${i}`,
								placeholder: placeholders[index][i],
								style: 1,
								minLength: 1,
								maxLength: i === 0 ? 500 : 100,
								customId: "Poll Question",
								required: i < 3,
							}],
						})
					}

					// await respond(bot, interaction, {
					//   title: "Create a Poll",
					//   customId: "poll",
					//   components: modalData
					// }, true)
					await respond(bot, interaction, "Poll is currently unavailable", true)
					break
				}

				// TODO Implement Message builder
				case "send": {
					if (!interaction.guildId) return await respond(bot, interaction, "This action can only be performed in a server", true)
					if (!interaction.channelId) return await respond(bot, interaction, "Failed to get the channel ID", true)

					await respond(bot, interaction, "Message builder is currently unavailable", true)
					break
				}

				case "timestamp": {
					const now = Temporal.Now.plainDateTimeISO()
					const millisecond = getValue(interaction, "millisecond", "Integer") ?? now.millisecond
					const second = getValue(interaction, "second", "Integer") ?? now.second
					const minute = getValue(interaction, "minute", "Integer") ?? now.minute
					const hour = getValue(interaction, "hour", "Integer") ?? now.hour
					const day = getValue(interaction, "day", "Integer") ?? now.day
					const month = getValue(interaction, "month", "Integer") ?? now.month
					const timeZone = getValue(interaction, "timezone", "String") ?? timezone
					const year = getValue(interaction, "year", "Integer") ?? now.year

					let date: Temporal.ZonedDateTime, invalid: boolean = false
					try {
						date = Temporal.ZonedDateTime.from({ year, month, day, hour, minute, second, millisecond, timeZone })
					} catch {
						invalid = true
						date = now.toZonedDateTime(timeZone)
					}

					const finalDate = date.toInstant()

					await respond(bot, interaction, {
						content: stripIndents`${invalid ? "Invalid date. Fallback to current time:" : ""}
							**Date** • <t:${finalDate.epochSeconds}:F> [GMT ${
							timeZone.length == 6 ? timeZone : timezones.find(e => e.id == timeZone)?.offset
						}]
							**Milliseconds** • ${finalDate.epochMilliseconds}
							**Discord Epoch** • ${finalDate.epochSeconds}
							**Timestamp Styles Table** • Format timestamp with \`<t:Discord Epoch:Style>\``,
					}, true)
					break
				}
			}
		}
	}
}

const compareOffset = (a: string, b: string) => {
	if (a.startsWith("-") && b.startsWith("-")) return parseInt(a.slice(0, 3)) > parseInt(b.slice(0, 3)) ? 1 : -1
	if (a.startsWith("-") && !b.startsWith("-")) return -1
	if (!a.startsWith("-") && b.startsWith("-")) return 1
	return a.localeCompare(b)
}

const finalTimezones = [
	...[...new Set(timezones.map(e => e.offset))].sort(compareOffset),
	...timezones.map(e => e.id).filter(e => e.length > 0),
]

export async function autocomplete(bot: Bot, interaction: Interaction) {
	const current = getFocused(interaction, "String") || ""
	const response: ApplicationCommandOptionChoice[] = []

	if (current.length === 0) {
		return await respond(bot, interaction, { choices: finalTimezones.slice(0, 25).map(e => ({ name: e, value: e })) })
	}

	switch (getSubcmd(interaction)) {
		case "timestamp": {
			const fuse = new Fuse(finalTimezones, { distance: 5 })
			response.push(...fuse.search(current).map(res => ({ name: res.item, value: res.item })))
			break
		}
	}

	await respond(bot, interaction, { choices: response.slice(0, 25) })
}

// export async function button(bot: Bot, interaction: Interaction) {
//   if (getCmdName(interaction) == "poll") {
//     const embed = interaction.message?.embeds[0]
//     // let user = embed.description?.split(" ").at(-1) as string
//     // user = user.slice(2, user.length - 1)
//     // switch(true) {
//     //   case interaction.customId.startsWith("poll"): {
//     //     switch(interaction.customId.slice(5)) {
//     //       case "close": {
//     //         console.log("close")
//     //         if (interaction.user.id == user) {await interaction.message.edit({ components: [] })}
//     //         else {await interaction.reply({ content: "You cannot close this poll", ephemeral: true })}
//     //         break
//     //       }
//     //     }
//     //     break
//     //   }
//     // }
//   }
// }

// export async function modal(bot: Bot, interaction: Interaction) {
//   //   const ques = interaction.options.getString("question")
//   //   const opt1 = interaction.options.getString("option1")
//   //   const opt2 = interaction.options.getString("option2")
//   //   const opt3 = interaction.options.getString("option3") || null
//   //   const opt4 = interaction.options.getString("option4") || null
//   //   const opt5 = interaction.options.getString("option5") || null

//   //   const split1 = splitBar(100, 0, 25)
//   //   const split2 = splitBar(100, 0, 25)

//   //   creation = new Date()
//   //   creation = (creation - creation.getMilliseconds()) / 1000

//   //   amount = Math.floor(Math.random() * 1000)

//   //   fields = [
//   //     { name: `${opt1.charAt(0).toUpperCase() + opt1.slice(1)} • 0/${amount} Votes • ${split1[1]}%`, value: `[${split1[0]}]`, inline: false },
//   //     { name: `${opt2.charAt(0).toUpperCase() + opt2.slice(1)} • 0/${amount} Votes • ${split2[1]}%`, value: `[${split2[0]}]`, inline: false },
//   //   ]

//   //   components = [
//   //     {
//   //       "type": 1,
//   //       "components": [
//   //         { "type": 2, "style": 2, "label": opt1, "custom_id": "poll_1_0" },
//   //         { "type": 2, "style": 2, "label": opt2, "custom_id": "poll_2_0" }
//   //       ]
//   //     },
//   //     {
//   //       "type": 1,
//   //       "components": [
//   //         { "type": 2, "style": 4, "label": "Close Poll", "custom_id": "poll_close" },
//   //       ]
//   //     }
//   //   ]

//   //   if (opt3) {
//   //     const split3 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt3.charAt(0).toUpperCase() + opt3.slice(1)} • 0/${amount} Votes • ${split3[1]}%`, value: `[${split3[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt3, "custom_id": "poll_3_0" })
//   //   }

//   //   if (opt4) {
//   //     const split4 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt4.charAt(0).toUpperCase() + opt4.slice(1)} • 0/${amount} Votes • ${split4[1]}%`, value: `[${split4[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt4, "custom_id": "poll_4_0" })
//   //   }

//   //   if (opt5) {
//   //     const split5 = splitBar(100, 0, 25)
//   //     fields.push({ name: `${opt5.charAt(0).toUpperCase() + opt5.slice(1)} • 0/${amount} Votes • ${split5[1]}%`, value: `[${split5[0]}]`, inline: false })
//   //     components[0].components.push({ "type": 2, "style": 2, "label": opt5, "custom_id": "poll_5_0" })
//   //   }

//   //   embed = {
//   //     title: `Poll - ${ques.charAt(0).toUpperCase() + ques.slice(1)}`,
//   //     color: parseInt(pickArray(colors), 16),
//   //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
//   //     fields: fields,
//   //     footer: { text: "Last updated" },
//   //     timestamp: new Date().toISOString()
//   //   }

//   //   await interaction.reply({ embeds: [embed], components: components })
// }
