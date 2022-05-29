import { prettyBytes } from "bytes"
import { Color } from "color-convert"
import { ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, Bot, ChannelTypes, CreateApplicationCommand, DiscordEmoji, DiscordUser, Interaction, MessageComponents } from "discordeno"
import Fuse from "fuse"
import { evaluate } from "mathjs"
import { BotPermissions, colors, Constants, emojis, escapeMarkdown, getFocused, getSubcmd, getSubcmdGroup, getValue, imageURL, pickFromArray, respond, timestampStyler, toTimestamp } from "modules"
import { Temporal } from "temporal"
import { timeZones } from "timezones"

export const cmd: CreateApplicationCommand = {
  name: "utils",
  description: "Random utilities for you to use!",
  defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
  options: [
    {
      name: "color",
      description: "Return a preview of the color",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "random",
          description: "Generate a random color",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "rgb",
          description: "Input RGB color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "red",
              description: "The red value of the RGB color [Integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 255,
              required: true,
            },
            {
              name: "green",
              description: "The green value of the RGB color [Integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 255,
              required: true,
            },
            {
              name: "blue",
              description: "The blue value of the RGB color [Integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 255,
              required: true,
            },
          ],
        },
        {
          name: "decimal",
          description: "Input decimal color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The value of the color [Integer 0~16777215]",
            type: ApplicationCommandOptionTypes.Integer,
            minValue: 0,
            maxValue: 16777215,
            required: true,
          }],
        },
        {
          name: "hex",
          description: "Input Hex color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The hex value of the color [String]",
            type: ApplicationCommandOptionTypes.String,
            required: true,
          }],
        },
        {
          name: "hsl",
          description: "Input HSL color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [Integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 360,
              required: true,
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
            {
              name: "value",
              description: "The lightness value of the HSV color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
          ],
        },
        {
          name: "hsv",
          description: "Input HSV color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [Integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 360,
              required: true,
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
            {
              name: "value",
              description: "The value value of the HSV color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
          ],
        },
        {
          name: "cmyk",
          description: "Input CMYK color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "cyan",
              description: "The cyan value of the CMYK color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
            {
              name: "magenta",
              description: "The magenta value of the CMYK color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
            {
              name: "yellow",
              description: "The yellow value of the CMYK color [Integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 100,
              required: true,
            },
            {
              name: "key",
              description: "The key value of the CMYK color [Integer 0~100]",
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
      description: "Get info about anything in the server",
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
              description: "The channel to get info [Channel]",
              type: ApplicationCommandOptionTypes.Channel,
            },
          ],
        },
        {
          name: "server",
          description: "Get info about the server",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "user",
          description: "Get info about a user",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "target",
              description: "The user to get info [User]",
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
      description: "Make a poll!",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "random",
      description: "Roll a dice, flip a coin, do anything!",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "coin",
          description: "Flip a coin",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "amount",
            description: "The amount of coins to flip [Integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            minValue: 1,
            maxValue: 10,
            required: true,
          }],
        },
        {
          name: "dice",
          description: "Roll dices",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "amount",
            description: "The amount of dice to roll [Integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            minValue: 1,
            maxValue: 10,
            required: true,
          }],
        },
        {
          name: "number",
          description: "Generate random numbers",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "amount",
              description: "The amount of numbers to generate [Integer 1~10]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 1,
              maxValue: 10,
              required: true,
            },
            {
              name: "min",
              description: "The minimum limit for the numbers [Integer]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              required: false,
            },
            {
              name: "max",
              description: "The maximum limit for the numbers [Integer]",
              maxValue: 20000,
              type: ApplicationCommandOptionTypes.Integer,
            },
          ],
        },
      ],
    },
    {
      name: "send",
      description: "Send something in this channel",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "message",
          description: "The message to send [String]",
          type: ApplicationCommandOptionTypes.String,
          required: true,
        },
        {
          name: "times",
          description: "The number of times to send the message [Integer 1~3 - Default 1]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: 1,
          maxValue: 3,
          required: false,
        },
      ],
    },
    {
      name: "timestamp",
      description: "Get the current timestamp or from a provided date",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "year",
          description: "The timestamp's year [Integer -271821~275760]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: -271821,
          maxValue: 275760,
          required: true,
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
          description: "The timestamp's hours [Integer 0~23]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: 0,
          maxValue: 23,
          required: false,
        },
        {
          name: "minute",
          description: "The timestamp's minutes [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: 0,
          maxValue: 59,
          required: false,
        },
        {
          name: "second",
          description: "The timestamp's seconds [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: 0,
          maxValue: 59,
          required: false,
        },
        {
          name: "millisecond",
          description: "The timestamp's milliseconds [Integer 0~999]",
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
          const hex = value.toString(16).padStart(6, "0")
          const [red, green, blue] = hex.match(/.{1,2}/g) as RegExpMatchArray

          color = Color.rgb(parseInt(red), parseInt(green), parseInt(blue))
          break
        }

        case "hex": {
          const value = getValue(interaction, "value", "String") ?? "000000"
          const matched = value.match(/\d{1,6}/g)?.reduce((prev, curr) => Math.abs(curr.length - 6) < Math.abs(prev.length - 6) ? curr : prev) ?? "000000"
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
          const hex = Math.floor(Math.random() * 0xFFFFFF)

          color = Color.rgb(hex >> 16, (hex >> 8) & 0xFF, hex & 0xFF)
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
            { name: "RGB", value: `${rgb.red()}, ${rgb.green()}, ${rgb.blue()}`, inline: true },
            { name: "CMYK", value: `${cmyk.cyan()}, ${cmyk.magenta()}, ${cmyk.yellow()}, ${cmyk.black()}`, inline: true },
            { name: "Decimal", value: `${color.rgbNumber()}`, inline: true },
            { name: "HEX", value: hex, inline: true },
            { name: "HSL", value: `${hsl.hue()}, ${hsl.saturation()}, ${hsl.lightness()}`, inline: true },
            { name: "HSV", value: `${hsv.hue()}, ${hsv.saturation()}, ${hsv.value()}`, inline: true },
          ],
          thumbnail: { url: `https://dummyimage.com/128/${hex.slice(1)}/${hex.slice(1)}.png` },
        }],
      })
      break
    }

    case "info": {
      switch (getSubcmd(interaction)) {
        case "bot": {
          const app = await bot.helpers.getApplicationInfo()
          const memory = Deno.memoryUsage()
          const creationTimestamp = Math.floor(Number(toTimestamp(bot.id) / 1000n))
          const { version } = Deno
          const discordenoVersion = bot.constants.DISCORDENO_VERSION

          const ownerID = (app.team ? app.team.ownerUserId : app.owner?.id) ?? bot.id
          const owner = await bot.helpers.getUser(ownerID)

          await respond(bot, interaction, {
            embeds: [{
              title: `Bot Info • ${app.name}`,
              description: app.description,
              color: pickFromArray(colors),
              fields: [
                { name: "Owner", value: `${owner?.username}#${owner?.discriminator}`, inline: true },
                { name: "Invite", value: `[Link](https://discord.com/api/v9/oauth2/authorize?client_id=${bot.id}&permissions=${BotPermissions}&scope=bot%20applications.commands)`, inline: true },
                { name: "Creation Date", value: `<t:${creationTimestamp}:f>\n<t:${creationTimestamp}:R>`, inline: true },
                { name: "Discordeno Version", value: `[${discordenoVersion}](https://deno.land/x/discordeno@${discordenoVersion}/mod.ts)`, inline: true },
                { name: "Deno Info", value: `Deno v${version.deno}\nV8 Engine v${version.v8}\nTypeScript v${version.typescript}`, inline: true },
                { name: "Memory Usage", value: `**RSS** • ${prettyBytes(memory.rss)}\n**Heap Total** • ${prettyBytes(memory.heapTotal)}\n**Heap Used** • ${prettyBytes(memory.heapUsed)}`, inline: true },
              ],
              thumbnail: { url: imageURL(bot.id, app.icon, "icons") },
            }],
          })
          break
        }

        case "channel": {
          if (interaction.guildId === undefined) {
            await respond(bot, interaction, { content: "This command can't be used ouside of a server." }, true)
              .catch(err => console.botLog(err, "ERROR"))
            break
          }

          if (interaction.channelId === undefined) {
            await respond(bot, interaction, { content: "Cannot get this channel ID." }, true)
              .catch(err => console.botLog(err, "ERROR"))
            break
          }

          const channel = await bot.helpers.getChannel(getValue(interaction, "target", "Channel")?.id ?? interaction.channelId)
          const timestamp = Math.floor(Number(toTimestamp(channel?.id ?? 0n) / 1000n))

          await respond(bot, interaction, {
            embeds: [{
              color: pickFromArray(colors),
              fields: [
                { name: "Name", value: `${channel?.name}`, inline: true },
                { name: "ID", value: `${channel?.id}`, inline: true },
                { name: "Type", value: `${channel?.type}`, inline: true },
                { name: "Position", value: `${channel?.position}`, inline: true },
                { name: "NSFW", value: `${channel?.nsfw}`, inline: true },
                { name: "Topic", value: `${channel?.topic}`, inline: true },
                { name: "Creation Date", value: `<t:${timestamp}:f>\n<t:${timestamp}:R>`, inline: true },
              ],
              author: { name: "Channel Info" },
            }],
          })
          break
        }

        case "server": {
          if (interaction.guildId === undefined) {
            await respond(bot, interaction, { content: "This command can't be used ouside of a server." }, true)
              .catch(err => {
                console.botLog(err, "ERROR")
              })
            break
          }

          const guild = await bot.helpers.getGuild(interaction.guildId, { counts: true })
          const channels = await bot.helpers.getChannels(interaction.guildId)
          const emojis = await bot.rest.runMethod<DiscordEmoji[]>(bot.rest, "GET", bot.constants.routes.GUILD_EMOJIS(interaction.guildId))

          const verificationLevel = ["Unrestricted", "Verified Email", "Registered for >5m", "Member for >10m", "Verified Phone"]
          const filterLevel = ["Not Scanned", "Scan Without Roles", "Scan Everything"]

          await respond(bot, interaction, {
            embeds: [{
              color: pickFromArray(colors),
              description: guild.description ? `Server Description: ${guild.description}` : "",
              fields: [
                { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
                { name: "Creation Date", value: `<t:${Math.floor(Number(toTimestamp(guild.id) / 1000n))}:D>`, inline: true },
                { name: "Vanity Invite URL", value: guild.vanityUrlCode ?? "None", inline: true },
                { name: "Verification Level", value: verificationLevel[guild.verificationLevel], inline: true },
                { name: "Content Filter Level", value: filterLevel[guild.explicitContentFilter], inline: true },
                { name: "AFK Channel", value: guild.afkChannelId ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60} Min Timeout)` : "None", inline: true },
                { name: "General Info", value: `~${guild.approximateMemberCount} Members\n${guild.roles.size} Roles\n${guild.emojis.size} Emojis\n┣ ${emojis.filter(emoji => !emoji.animated).length} static\n╰ ${emojis.filter(emoji => emoji.animated).length} animated`, inline: true },
                {
                  name: "Channel Stats",
                  value: `${channels.filter(channel => channel.type == ChannelTypes.GuildCategory).size} Categories
${channels.filter(channel => channel.type == ChannelTypes.GuildText).size} Text
${channels.filter(channel => channel.type == ChannelTypes.GuildVoice).size} Voice
${channels.filter(channel => channel.type == ChannelTypes.GuildStageVoice).size} Stages`,
                  inline: true,
                },
              ],
              image: { url: imageURL(guild.id, guild.banner, "banners") ?? "" },
              thumbnail: { url: imageURL(guild.id, guild.icon, "icons") ?? "" },
              author: { name: guild.name },
              footer: { text: `Server ID • ${guild.id}` },
            }],
          })
          break
        }

        case "user": {
          const { user } = getValue(interaction, "target", "User") ?? interaction
          const discordUser = await bot.rest.runMethod<DiscordUser>(bot.rest, "GET", bot.constants.routes.USER(user.id))
          const createdAt = Math.floor(Number(toTimestamp(user.id) / 1000n))

          await respond(bot, interaction, {
            embeds: [{
              color: discordUser.accent_color ?? pickFromArray(colors),
              fields: [
                { name: "Name", value: user.username, inline: true },
                { name: "Tag", value: user.discriminator, inline: true },
                { name: "ID", value: user.id.toString(), inline: true },
                { name: "Creation Date", value: `<t:${createdAt}:f> (<t:${createdAt}:R>)` },
              ],
              image: { url: imageURL(user.id, discordUser.banner, "banners") },
              thumbnail: { url: imageURL(user.id, user.avatar, "avatars") },
              author: { name: "User Info" },
            }],
          }).catch(err => {
            console.botLog(err, "ERROR")
          })
          break
        }
      }
      break
    }

    case "random": {
      const mode = getSubcmd(interaction)
      const amount = getValue(interaction, "amount", "Integer") ?? 0
      const min = getValue(interaction, "min", "Integer") ?? 0
      const max = getValue(interaction, "max", "Integer") ?? 100

      const embed = {
        title: mode == "coin" ? "Coin flip" : mode == "dice" ? "Dice roll" : "Random numbers",
        description: "",
      }
      let choices: (string | number)[] = []

      if (mode == "coin") choices = ["Head", "Tail"]
      else if (mode == "dice") choices = [1, 2, 3, 4, 5, 6]
      else if (mode == "number") {
        for (let i = 0; i < amount; i++) embed.description += `${Math.floor(Math.random() * (max - min) + min)}, `
        embed.description = embed.description.slice(0, -2)
        await respond(bot, interaction, { embeds: [embed] })
        break
      }

      for (let i = 0; i < amount; i++) embed.description += `${pickFromArray(choices)}, `
      embed.description = embed.description.slice(0, -2)

      await respond(bot, interaction, { embeds: [embed] })
      break
    }

    default: {
      switch (getSubcmd(interaction)) {
        case "calculate": {
          const expression = getValue(interaction, "expression", "String") ?? ""
          const symbols = ["π", "τ"]
          const symvals = [Math.PI, Math.PI * 2]

          const scope = {}
          symbols.forEach((value: string | string[], i: string | number) => {
            if (typeof value == "object") {
              value.forEach((subvalue: string | number) => {
                scope[subvalue] = symvals[i]
              })
            } else {
              scope[value] = symvals[i]
            }
          })

          try {
            let result = evaluate(expression, scope)
            if (typeof result == "number") result = result.toString()
            if (typeof result == "object") result = result.entries.join("; ")

            await respond(bot, interaction, {
              embeds: [{
                title: "Calculation",
                color: pickFromArray(colors),
                fields: [
                  { name: "Expression", value: `${escapeMarkdown(expression)}`, inline: false },
                  { name: "Result", value: `${escapeMarkdown(result)}`, inline: false },
                ],
              }],
            })
          } catch (err) {
            console.botLog(err, "ERROR")
            await respond(bot, interaction, { content: `Cannot evaluate \`${expression}\`\n${err}.${String(err).includes("Undefined symbol") ? " You may want to declare variables like `a = 9; a * 7` => 63" : ""}` }, true)
          }
          break
        }

        case "ping": {
          await respond(bot, interaction, { content: "Pinging..." })

          const original = await bot.helpers.getOriginalInteractionResponse(interaction.token)
          const wsPing = bot.gateway.manager.shards.reduce((curr, next) => curr + (next.heart.rtt ?? 0), 0) / bot.gateway.manager.shards.size
          const noPing = bot.gateway.manager.shards.some(shard => shard.heart.rtt === undefined)

          if (wsPing < 0) console.botLog(bot.gateway.manager.shards.map(shard => shard.heart))

          await bot.helpers.editInteractionResponse(interaction.token, {
            content: "",
            embeds: [{
              title: "Pong!",
              color: pickFromArray(colors),
              fields: [
                { name: "Websocket Latency", value: noPing ? "Not available" : `${wsPing}ms${wsPing < 0 ? " (lmao how)" : ""}`, inline: false },
                { name: "Roundtrip Latency", value: `${BigInt(original.timestamp) - toTimestamp(interaction.id)}ms`, inline: false },
              ],
            }],
          })
          break
        }

        case "poll": {
          const placeholders = [["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"], ["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"], ["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"]]
          const index = Math.floor(Math.random() * placeholders.length)

          const modalData: MessageComponents = []

          for (let i = 0; i < 5; i++) {
            modalData.push({
              type: 1,
              components: [{
                type: 4,
                label: i == 0 ? "Question" : `Option ${i}`,
                placeholder: placeholders[index][i],
                style: 1,
                minLength: 1,
                maxLength: i == 0 ? 500 : 100,
                customId: "Poll Question",
                required: i < 3,
              }],
            })
          }

          await respond(bot, interaction, {
            // title: "Create a Poll",
            // customId: "poll",
            // components: modalData
            content: "Poll is not available yet",
          }, true)
          break
        }

        case "send": {
          if (!interaction.guildId) {
            return await respond(bot, interaction, {
              content: `${emojis.warn.shorthand} This command can only be used in servers.`,
            }, true)
          }

          const { channelId } = interaction
          if (channelId === undefined) {
            return await respond(bot, interaction, {
              content: `${emojis.warn.shorthand} Can't reach this channel.`,
            }, true)
          }

          const message = getValue(interaction, "message", "String") ?? ""
          var times = getValue(interaction, "times", "Integer") ?? 1

          // Failsafe
          let response = `Dispatching "${message}" ${times} times`
          if (times > 3) {
            times = 3
            response += "\nNote: 3 times maximum"
          }

          await respond(bot, interaction, { content: response }, true)

          for (let i = 0; i < times; i++) {
            setTimeout(() => bot.helpers.sendMessage(channelId, { content: message }), 750 * i)
          }
          break
        }

        case "timestamp": {
          const millisecond = getValue(interaction, "millisecond", "Integer") ?? 0
          const second = getValue(interaction, "second", "Integer") ?? 0
          const minute = getValue(interaction, "minute", "Integer") ?? 0
          const hour = getValue(interaction, "hour", "Integer") ?? 0
          const day = getValue(interaction, "day", "Integer") ?? 1
          const month = getValue(interaction, "month", "Integer") ?? 1
          const timezone = getValue(interaction, "timezone", "String") ?? Constants.Timezone
          const year = getValue(interaction, "year", "Integer") ?? Temporal.Now.zonedDateTimeISO(timezone).year

          let date: Temporal.ZonedDateTime | Temporal.Instant = Temporal.ZonedDateTime.from({ year, month, day, hour, minute, second, millisecond, timeZone: timezone })
          if (date.toString() == "Invalid Date") date = Temporal.Instant.fromEpochSeconds(year < 0 ? -8640000000000 : 8640000000000)

          const timestamp = date.epochSeconds
          await respond(bot, interaction, {
            content: `**Date** • ${date}\n**Timestamp** • ${timestamp} (${String(date.epochMilliseconds)})\n\n**Discord Styled Timestamps**\n${timestampStyler(timestamp, "tsutils")}`,
          }, true)
          break
        }
      }
    }
  }
}

export async function autocomplete(bot: Bot, interaction: Interaction) {
  const current = getFocused(interaction, "String") || ""
  const blankInitial = { name: "Keep typing to continue…", value: "__" }
  // const filledInitial = { name: current, value: "__" }
  const response: ApplicationCommandOptionChoice[] = []

  if (current.length == 0) return await respond(bot, interaction, { choices: [blankInitial] })

  switch (getSubcmd(interaction)) {
    case "timestamp": {
      const fuse = new Fuse(timeZones, { distance: 5 })
      response.push(
        ...fuse.search(current).map(result => {
          return { name: result.item, value: result.item }
        }),
      )
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
//     // switch (true) {
//     //   case interaction.customId.startsWith("poll"): {
//     //     switch (interaction.customId.slice(5)) {
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
//   //     color: parseInt(pickFromArray(colors), 16),
//   //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
//   //     fields: fields,
//   //     footer: { text: "Last updated" },
//   //     timestamp: new Date().toISOString()
//   //   }

//   //   await interaction.reply({ embeds: [embed], components: components })
// }
