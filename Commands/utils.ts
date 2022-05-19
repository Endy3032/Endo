import { Color } from "color-convert"
import { getSubcmdGroup, getSubcmd, getValue, toTimestamp, pickFromArray, colors, imageURL } from "Modules"
import { ApplicationCommandOptionTypes, Bot, ChannelTypes, DiscordEmoji, DiscordUser, getChannels, getGuild, Interaction, InteractionResponseTypes } from "discordeno"

export const cmd = {
  name: "utils",
  description: "Random utilities for you to use!",
  options: [
    {
      name: "color",
      description: "Return a preview of the color",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "random",
          description: "Generate a random color",
          type: ApplicationCommandOptionTypes.SubCommand
        },
        {
          name: "rgb",
          description: "Input RGB color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "red",
              description: "The red value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "green",
              description: "The green value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "blue",
              description: "The blue value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            }
          ]
        },
        {
          name: "decimal",
          description: "Input decimal color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The value of the color [integer 0~16777215]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 0,
            "max_value": 16777215,
            required: true
          }]
        },
        {
          name: "hex",
          description: "Input Hex color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The hex value of the color [string]",
            type: ApplicationCommandOptionTypes.String,
            required: true
          }]
        },
        {
          name: "hsl",
          description: "Input HSL color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The lightness value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "hsv",
          description: "Input HSV color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The value value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "cmyk",
          description: "Input CMYK color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "cyan",
              description: "The cyan value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "magenta",
              description: "The magenta value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "yellow",
              description: "The yellow value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "key",
              description: "The key value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
      ]
    },
    {
      name: "calculate",
      description: "Calculate an expression and return the result",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [{
        name: "expression",
        description: "The expression to calculate [string]",
        type: ApplicationCommandOptionTypes.String,
        required: true
      }]
    },
    {
      name: "info",
      description: "Get info about anything in the server",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "server",
          description: "Get info about the server",
          type: ApplicationCommandOptionTypes.SubCommand
        },
        {
          name: "user",
          description: "Get info about a user",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "target",
              description: "The user to get info [mention / none]",
              type: ApplicationCommandOptionTypes.User
            }
          ]
        }
      ]
    },
    {
      name: "ping",
      description: "Get the bot's latency info",
      type: ApplicationCommandOptionTypes.SubCommand
    },
    {
      name: "poll",
      description: "Make a poll!",
      type: ApplicationCommandOptionTypes.SubCommand
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
            description: "The amount of coins to flip [integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "dice",
          description: "Roll dices",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "amount",
            description: "The amount of dice to roll [integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "number",
          description: "Generate random numbers",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "amount",
              description: "The amount of numbers to generate [integer 1~10]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 1,
              "max_value": 10,
              required: true
            },
            {
              name: "min",
              description: "The minimum limit for the numbers [integer]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              required: false
            },
            {
              name: "max",
              description: "The maximum limit for the numbers [integer]",
              "max_value": 20000,
              type: ApplicationCommandOptionTypes.Integer,
            }
          ]
        },
      ]
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
          "min_value": -271821,
          "max_value": 275760,
          required: true
        },
        {
          name: "month",
          description: "The timestamp's month [Integer 1~12]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 1,
          "max_value": 12,
          required: false
        },
        {
          name: "day",
          description: "The timestamp's day [Integer 1~31]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 1,
          "max_value": 31,
          required: false
        },
        {
          name: "hour",
          description: "The timestamp's hours [Integer 0~23]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 23,
          required: false
        },
        {
          name: "minute",
          description: "The timestamp's minutes [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "second",
          description: "The timestamp's seconds [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "millisecond",
          description: "The timestamp's milliseconds [Integer 0~999]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 999,
          required: false
        },
      ]
    }
  ]
}

export const execute = async (bot: Bot, interaction: Interaction) => {
  switch (getSubcmdGroup(interaction)) {
    case "color": {
      let color: Color

      switch (getSubcmd(interaction)) {
        case "rgb": {
          const red = getValue(interaction, "red", ApplicationCommandOptionTypes.Integer)
          const green = getValue(interaction, "green", ApplicationCommandOptionTypes.Integer)
          const blue = getValue(interaction, "blue", ApplicationCommandOptionTypes.Integer)

          color = Color.rgb(red, green, blue)
          break
        }

        case "decimal": {
          const value = getValue(interaction, "value", ApplicationCommandOptionTypes.Integer)
          const hex = value.toString(16).padStart(6, "0")
          const [red, green, blue] = hex.match(/.{1,2}/g) as RegExpMatchArray

          color = Color.rgb(parseInt(red), parseInt(green), parseInt(blue))
          break
        }

        case "hex": {
          const value = getValue(interaction, "value", ApplicationCommandOptionTypes.String)
          const matched = value.match(/\d{1,6}/g)?.reduce((prev, curr) => Math.abs(curr.length - 6) < Math.abs(prev.length - 6) ? curr : prev) || "000000"
          const hex = parseInt(matched, 16)

          color = Color.rgb(hex >> 16, (hex >> 8) & 0xFF, hex & 0xFF)
          break
        }

        case "hsl": {
          const hue = getValue(interaction, "hue", ApplicationCommandOptionTypes.Integer)
          const saturation = getValue(interaction, "saturation", ApplicationCommandOptionTypes.Integer)
          const lightness = getValue(interaction, "lightness", ApplicationCommandOptionTypes.Integer)

          color = Color.hsl(hue, saturation, lightness)
          break
        }

        case "hsv": {
          const hue = getValue(interaction, "hue", ApplicationCommandOptionTypes.Integer)
          const saturation = getValue(interaction, "saturation", ApplicationCommandOptionTypes.Integer)
          const value = getValue(interaction, "value", ApplicationCommandOptionTypes.Integer)

          color = Color.hsv(hue, saturation, value)
          break
        }

        case "cmyk": {
          const cyan = getValue(interaction, "cyan", ApplicationCommandOptionTypes.Integer)
          const magenta = getValue(interaction, "magenta", ApplicationCommandOptionTypes.Integer)
          const yellow = getValue(interaction, "yellow", ApplicationCommandOptionTypes.Integer)
          const key = getValue(interaction, "key", ApplicationCommandOptionTypes.Integer)

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

      await bot.helpers.sendInteractionResponse(
        interaction.id, interaction.token, {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
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
            }]
          }
        }
      )
      break
    }

    case "info": {
      switch (getSubcmd(interaction)) {
        case "user": {
          const { user } = getValue(interaction, "target", ApplicationCommandOptionTypes.User) || interaction
          const discordUser = await bot.rest.runMethod<DiscordUser>(bot.rest, "get", bot.constants.endpoints.USER(user.id))
          const createdAt = Math.floor(Number(toTimestamp(user.id) / 1000n))

          await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              embeds: [{
                color: discordUser.accent_color || pickFromArray(colors),
                fields: [
                  { name: "Name", value: user.username, inline: true },
                  { name: "Tag", value: user.discriminator, inline: true },
                  { name: "ID", value: user.id.toString(), inline: true },
                  { name: "Creation Date", value: `<t:${createdAt}:f> (<t:${createdAt}:R>)` }
                ],
                image: { url: imageURL(user.id, discordUser.banner, "banners") || "" },
                thumbnail: { url: imageURL(user.id, user.avatar, "avatars") || "" },
                author: { name: "User Info" },
              }]
            }
          }).catch(err => {console.botLog(err.message, "ERROR")})
          break
        }

        case "server": {
          if (interaction.guildId === undefined) {
            await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
              type: InteractionResponseTypes.ChannelMessageWithSource,
              data: { content: "This command can't be used ouside of a server.", flags: 1 << 6 },
            }).catch(err => {console.botLog(err.message, "ERROR")})
            break
          }

          const guild = await getGuild(bot, interaction.guildId, { counts: true })
          const channels = await getChannels(bot, interaction.guildId)
          const emojis = await bot.rest.runMethod<DiscordEmoji[]>(bot.rest, "get", bot.constants.endpoints.GUILD_EMOJIS(interaction.guildId))

          const verificationLevel = ["Unrestricted", "Verified Email", "Registered for >5m", "Member for >10m", "Verified Phone"]
          const filterLevel = ["Not Scanned", "Scan Without Roles", "Scan Everything"]

          await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              embeds: [{
                color: pickFromArray(colors),
                description: guild.description ? `Server Description: ${guild.description}` : "",
                fields: [
                  { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
                  { name: "Creation Date", value: `<t:${Math.floor(Number(toTimestamp(guild.id) / 1000n))}:D>`, inline: true },
                  { name: "Vanity Invite URL", value: guild.vanityUrlCode || "None", inline: true },
                  { name: "Verification Level", value: verificationLevel[guild.verificationLevel], inline: true },
                  { name: "Content Filter Level", value: filterLevel[guild.explicitContentFilter], inline: true },
                  { name: "AFK Channel", value: guild.afkChannelId ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60} Min Timeout)` : "None", inline: true },
                  { name: "General Info", value: `~${guild.approximateMemberCount} Members\n${guild.roles.size} Roles\n${guild.emojis.size} Emojis\n┣ ${emojis.filter(emoji => !emoji.animated).length} static\n╰ ${emojis.filter(emoji => emoji.animated).length} animated`, inline: true },
                  { name: "Channel Stats", value: `${channels.filter(channel => channel.type == ChannelTypes.GuildCategory).size} Categories\n${channels.filter(channel => channel.type == ChannelTypes.GuildText).size} Text\n${channels.filter(channel => channel.type == ChannelTypes.GuildVoice).size} Voice\n${channels.filter(channel => channel.type == ChannelTypes.GuildStageVoice).size} Stages\n`, inline: true },
                ],
                image: { url: imageURL(guild.id, guild.banner, "banners") || "" },
                thumbnail: { url: imageURL(guild.id, guild.icon, "icons") || "" },
                author: { name: guild.name },
                footer: { text: `Server ID • ${guild.id}` },
              }]
            }
          })
          break
        }
      }
    }
  }
}
