import axios from "axios"
import { evaluate } from "mathjs"
import convert from "color-convert"
import { RGB } from "color-convert/conversions"
import { Temporal } from "@js-temporal/polyfill"
import { UnsafeEmbedBuilder } from "@discordjs/builders"
import { colors, emojis, maxRes, random, superEscape, timestampStyler } from "../Modules"
import { ApplicationCommandOptionType, ChannelType, ChatInputCommandInteraction, Embed, Emoji, Message } from "discord.js"
// const { splitBar } = require("string-progressbar")

function convertColors(color: RGB) {
  const hex = convert.rgb.hex(color)
  const hsl = convert.rgb.hsl(color)
  const hsv = convert.rgb.hsv(color)
  const cmyk = convert.rgb.cmyk(color)
  return { hex, hsl, hsv, cmyk }
}

export const cmd = {
  name: "utils",
  description: "Random utilities for you to use!",
  options: [
    {
      name: "color",
      description: "Return a preview of the color",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "random",
          description: "Generate a random color",
          type: ApplicationCommandOptionType.Subcommand
        },
        {
          name: "rgb",
          description: "Input RGB color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "red",
              description: "The red value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "green",
              description: "The green value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "blue",
              description: "The blue value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            }
          ]
        },
        {
          name: "decimal",
          description: "Input decimal color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [{
            name: "value",
            description: "The value of the color [integer 0~16777215]",
            type: ApplicationCommandOptionType.Integer,
            "min_value": 0,
            "max_value": 16777215,
            required: true
          }]
        },
        {
          name: "hex",
          description: "Input Hex color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [{
            name: "value",
            description: "The hex value of the color [string]",
            type: ApplicationCommandOptionType.String,
            required: true
          }]
        },
        {
          name: "hsl",
          description: "Input HSL color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The lightness value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "hsv",
          description: "Input HSV color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The value value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "cmyk",
          description: "Input CMYK color type",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "cyan",
              description: "The cyan value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "magenta",
              description: "The magenta value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "yellow",
              description: "The yellow value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "key",
              description: "The key value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionType.Integer,
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
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "expression",
        description: "The expression to calculate [string]",
        type: ApplicationCommandOptionType.String,
        required: true
      }]
    },
    {
      name: "info",
      description: "Get info about anything in the server",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "server",
          description: "Get info about the server",
          type: ApplicationCommandOptionType.Subcommand
        },
        {
          name: "user",
          description: "Get info about a user",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "The user to get info [mention / none]",
              type: ApplicationCommandOptionType.User
            }
          ]
        }
      ]
    },
    {
      name: "ping",
      description: "Get the bot's latency info",
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: "poll",
      description: "Make a poll!",
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: "random",
      description: "Roll a dice, flip a coin, do anything!",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "coin",
          description: "Flip a coin",
          type: ApplicationCommandOptionType.Subcommand,
          options: [{
            name: "amount",
            description: "The amount of coins to flip [integer 1~10]",
            type: ApplicationCommandOptionType.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "dice",
          description: "Roll dices",
          type: ApplicationCommandOptionType.Subcommand,
          options: [{
            name: "amount",
            description: "The amount of dice to roll [integer 1~10]",
            type: ApplicationCommandOptionType.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "number",
          description: "Generate random numbers",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "amount",
              description: "The amount of numbers to generate [integer 1~10]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 1,
              "max_value": 10,
              required: true
            },
            {
              name: "min",
              description: "The minimum limit for the numbers [integer]",
              type: ApplicationCommandOptionType.Integer,
              "min_value": 0,
              required: false
            },
            {
              name: "max",
              description: "The maximum limit for the numbers [integer]",
              "max_value": 20000,
              type: ApplicationCommandOptionType.Integer,
            }
          ]
        },
      ]
    },
    {
      name: "timestamp",
      description: "Get the current timestamp or from a provided date",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "year",
          description: "The timestamp's year [Integer -271821~275760]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": -271821,
          "max_value": 275760,
          required: true
        },
        {
          name: "month",
          description: "The timestamp's month [Integer 1~12]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 1,
          "max_value": 12,
          required: false
        },
        {
          name: "day",
          description: "The timestamp's day [Integer 1~31]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 1,
          "max_value": 31,
          required: false
        },
        {
          name: "hour",
          description: "The timestamp's hours [Integer 0~23]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 0,
          "max_value": 23,
          required: false
        },
        {
          name: "minute",
          description: "The timestamp's minutes [Integer 0~59]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "second",
          description: "The timestamp's seconds [Integer 0~59]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "millisecond",
          description: "The timestamp's milliseconds [Integer 0~999]",
          type: ApplicationCommandOptionType.Integer,
          "min_value": 0,
          "max_value": 999,
          required: false
        },
      ]
    }
  ]
}

export async function execute(interaction: ChatInputCommandInteraction) {
  switch (interaction.options.getSubcommandGroup()) {
    case "color": {
      let rgb: RGB | undefined

      switch (interaction.options.getSubcommand()) {
        case "rgb": {
          const r = interaction.options.getInteger("red") as number
          const g = interaction.options.getInteger("green") as number
          const b = interaction.options.getInteger("blue") as number

          rgb = [r, g, b]
          break
        }

        case "decimal": {
          const tempHex = interaction.options.getInteger("value")?.toString(16).padStart(6, "0") as string

          rgb = convert.hex.rgb(tempHex)
          break
        }

        case "hex": {
          let hex = interaction.options.getString("value") as string
          hex.startsWith("#") && hex.length == 7 ? hex = hex.slice(1, 7) : hex

          rgb = convert.hex.rgb(hex)
          break
        }

        case "hsl": {
          const h = interaction.options.getInteger("hue") as number
          const s = interaction.options.getInteger("saturation") as number
          const l = interaction.options.getInteger("lightness") as number

          rgb = convert.hsl.rgb([h, s, l])
          break
        }

        case "hsv": {
          const h = interaction.options.getInteger("hue") as number
          const s = interaction.options.getInteger("saturation") as number
          const v = interaction.options.getInteger("value") as number

          rgb = convert.hsv.rgb([h, s, v])
          break
        }

        case "cmyk": {
          const c = interaction.options.getInteger("cyan") as number
          const m = interaction.options.getInteger("magenta") as number
          const y = interaction.options.getInteger("yellow") as number
          const k = interaction.options.getInteger("key") as number

          rgb = convert.cmyk.rgb([c, m, y, k])
          break
        }

        case "random": {
          const r = Math.floor(Math.random() * 255) as number
          const g = Math.floor(Math.random() * 255) as number
          const b = Math.floor(Math.random() * 255) as number

          rgb = [r, g, b]
          break
        }
      }

      rgb = rgb as RGB
      const { cmyk, hex, hsl, hsv } = convertColors(rgb)

      await interaction.reply({ embeds: [{
        title: "Color Conversion",
        color: parseInt(hex, 16),
        fields: [
          { name: "RGB", value: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`, inline: true },
          { name: "CMYK", value: `${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]}`, inline: true },
          { name: "Decimal", value: `${parseInt(hex, 16)}`, inline: true },
          { name: "HEX", value: `#${hex}`, inline: true },
          { name: "HSL", value: `${hsl[0]}, ${hsl[1]}, ${hsl[2]}`, inline: true },
          { name: "HSV", value: `${hsv[0]}, ${hsv[1]}, ${hsv[2]}`, inline: true },
        ],
        thumbnail: { url: `https://dummyimage.com/128/${hex}/${hex}.png` },
        timestamp: Temporal.Now.instant().toString(),
      }] })
      break
    }

    case "info": {
      switch (interaction.options.getSubcommand()) {
        case "server": {
          const { guild } = interaction
          if (!guild) return interaction.reply({ content: `${emojis.warn.shorthand} This command can only be used in servers.`, ephemeral: true })
          const owner = await guild.fetchOwner()
          const channels = await guild.channels.fetch()
          const textCount = channels.filter((channel: { type: ChannelType }) => channel.type == ChannelType.GuildText).size
          const voiceCount = channels.filter((channel: { type: ChannelType }) => channel.type == ChannelType.GuildVoice).size
          const categoryCount = channels.filter((channel: { type: ChannelType }) => channel.type == ChannelType.GuildCategory).size
          const stageCount = channels.filter((channel: { type: ChannelType }) => channel.type == ChannelType.GuildStageVoice).size
          const guildEmojis = await guild.emojis.fetch()
          const emojiCount = guildEmojis.size
          const animCount = guildEmojis.filter((emoji: Emoji) => emoji.animated as boolean).size

          const verificationLevel = ["Unrestricted", "Verified Email", "Registered for >5m", "Member for >10m", "Verified Phone"]
          const filterLevel = ["Not Scanned", "Scan Without Roles", "Scan Everything"]

          await interaction.reply({ embeds: [{
            color: parseInt(random.pickFromArray(colors), 16),
            description: guild.description ? `Server Description: ${guild.description}` : "",
            fields: [
              { name: "Owner", value: `<@${owner.id}>`, inline: true },
              { name: "Creation Date", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
              { name: "Vanity URL", value: guild.vanityURLCode || "None", inline: true },
              { name: "Verification", value: verificationLevel[guild.verificationLevel], inline: true },
              { name: "Content Filter", value: filterLevel[guild.explicitContentFilter], inline: true },
              { name: "Verified", value: guild.verified ? "Yes" : "No", inline: true },
              { name: "General Stats", value: `${guild.memberCount} Members\n${(await guild.roles.fetch()).size} Roles\n${emojiCount} Emojis\n┣ ${emojiCount-animCount} static\n╰ ${animCount} animated`, inline: true },
              { name: "Channel Stats", value: `${categoryCount != 0 ? `${categoryCount} Categories\n` : ""}${textCount != 0 ? `${textCount} Text\n` : ""}${voiceCount != 0 ? `${voiceCount} Voice\n` : ""}${stageCount != 0 ? `${stageCount} Stages\n` : ""}`, inline: true },
              { name: "AFK Channel", value: guild.afkChannelId != null ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60} Min Timeout)` : "None", inline: true },
            ],
            image: { url: maxRes(guild.bannerURL() as string) },
            thumbnail: { url: maxRes(guild.iconURL() as string) },
            author: { name: guild.name },
            footer: { text: `Server ID • ${guild.id}` },
          }] })
          break
        }

        case "user": {
          const user = await (interaction.options.getUser("target") || interaction.user).fetch()
          const ts = Math.floor(user.createdAt.getTime() / 1000)
          const embed = {
            color: parseInt(user.hexAccentColor ? user.hexAccentColor.slice(1) : random.pickFromArray(colors), 16),
            fields: [
              { name: "Name", value: user.username, inline: true },
              { name: "Tag", value: user.discriminator, inline: true },
              { name: "ID", value: user.id, inline: true },
              { name: "Creation Date", value: `<t:${ts}:f>\n<t:${ts}:R>` }
            ],
            image: { url: maxRes(user.bannerURL() as string) },
            thumbnail: { url: maxRes(user.avatarURL() as string) },
            author: { name: "User Info" },
          }
          user.hexAccentColor ? embed.fields.push({ name: "Banner Color", value: `#${user.hexAccentColor}`, inline: true }) : null

          await interaction.reply({ embeds: [embed] })
          break
        }
      }
      break
    }

    case "random": {
      const mode = interaction.options.getSubcommand()
      const amount = interaction.options.getInteger("amount") as number
      const min = interaction.options.getInteger("min") || 0
      const max = interaction.options.getInteger("max") || 100
      var embed = {
        title: mode == "coin" ? "Coin flip" : mode == "dice" ? "Dice roll" : "Random numbers",
        description: ""
      }
      let choices: any[] | undefined

      if (mode == "coin") {
        choices = ["Head", "Tail"]
      } else if (mode == "dice") {
        choices = [1, 2, 3, 4, 5, 6]
      } else if (mode == "number") {
        for (let i = 0; i < amount; i++) embed.description += `${Math.floor(Math.random() * (max - min) + min)}, `
        embed.description = embed.description.slice(0, -2)
        await interaction.reply({ embeds: [embed] })
        break
      }

      for (let i = 0; i < amount; i++) embed.description += `${random.pickFromArray(choices as any[])}, `
      embed.description = embed.description.slice(0, -2)

      await interaction.reply({ embeds: [embed] })
      break
    }

    default: {
      switch (interaction.options.getSubcommand()) {
        case "calculate": {
          const expression = interaction.options.getString("expression") as string
          const symbols = ["π", "τ"]
          const symvals = [Math.PI, Math.PI * 2]

          var scope = {}
          symbols.forEach((value: string | number | any[], i: string | number) => {
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
            if (typeof result == "object") {result = result.entries.join("; ")}

            await interaction.reply({ embeds: [{
              title: "Calculation",
              color: parseInt(random.pickFromArray(colors), 16),
              fields: [
                { name: "Expression", value: `${superEscape(expression)}`, inline: false },
                { name: "Result", value: `${superEscape(result)}`, inline: false }
              ]
            }] })
          } catch (err) {
            await interaction.reply({ content: `Cannot evaluate \`${expression}\`\n${err}.${String(err).includes("Undefined symbol") ? " You may want to declare variables like `a = 9; a * 7` => 63" : ""}`, ephemeral: true })
          }
          break
        }

        case "ping": {
          const sent = await interaction.reply({ content: "Pinging...", fetchReply: true }) as Message

          await interaction.editReply({ content: null, embeds: [{
            title: "Pong!",
            color: parseInt(random.pickFromArray(colors), 16),
            fields: [
              { name: "Websocket Latency", value: `${interaction.client.ws.ping}ms`, inline: false },
              { name: "Roundtrip Latency", value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: false }
            ]
          }] })
          break
        }

        case "poll": {
          const placeholders = [["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"], ["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"], ["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"]]
          const index = Math.floor(Math.random() * placeholders.length)

          const modalData = {
            type: 9,
            data: {
              title: "Create a Poll",
              custom_id: "poll",
              components: [
                {
                  type: 1,
                  components: [{
                    type: 4,
                    label: "Question",
                    placeholder: placeholders[index][0],
                    style: 1,
                    min_length: 1,
                    max_length: 500,
                    custom_id: "Poll Question",
                    required: true
                  }]
                },
                {
                  type: 1,
                  components: [{
                    type: 4,
                    label: "Option 1",
                    placeholder: placeholders[index][1],
                    style: 1,
                    min_length: 1,
                    max_length: 100,
                    custom_id: "Opt1",
                    required: true
                  }]
                },
                {
                  type: 1,
                  components: [{
                    type: 4,
                    label: "Option 2",
                    placeholder: placeholders[index][2],
                    style: 1,
                    min_length: 1,
                    max_length: 100,
                    custom_id: "Opt2",
                    required: true
                  }]
                },
                {
                  type: 1,
                  components: [{
                    type: 4,
                    label: "Option 3",
                    placeholder: placeholders[index][3],
                    style: 1,
                    min_length: 1,
                    max_length: 100,
                    custom_id: "Opt3",
                    required: false
                  }]
                },
                {
                  type: 1,
                  components: [{
                    type: 4,
                    label: "Option 4",
                    placeholder: placeholders[index][4],
                    style: 1,
                    min_length: 1,
                    max_length: 100,
                    custom_id: "Opt4",
                    required: false
                  }]
                },
              ]
            }
          }

          await axios({
            method: "POST",
            url: `https://discord.com/api/interactions/${interaction.id}/${interaction.token}/callback`,
            headers: { Authorization: `Bot ${interaction.client.token}` },
            data: modalData
          })

          // await interaction.reply({ components: components })
          // interaction.client.api.interactions(interaction.id)[interaction.token].callback.post({ data: { type: 9, data: modal } })

          //   const ques = interaction.options.getString("question")
          //   const opt1 = interaction.options.getString("option1")
          //   const opt2 = interaction.options.getString("option2")
          //   const opt3 = interaction.options.getString("option3") || null
          //   const opt4 = interaction.options.getString("option4") || null
          //   const opt5 = interaction.options.getString("option5") || null

          //   const split1 = splitBar(100, 0, 25)
          //   const split2 = splitBar(100, 0, 25)

          //   creation = new Date()
          //   creation = (creation - creation.getMilliseconds()) / 1000

          //   amount = Math.floor(Math.random() * 1000)

          //   fields = [
          //     { name: `${opt1.charAt(0).toUpperCase() + opt1.slice(1)} • 0/${amount} Votes • ${split1[1]}%`, value: `[${split1[0]}]`, inline: false },
          //     { name: `${opt2.charAt(0).toUpperCase() + opt2.slice(1)} • 0/${amount} Votes • ${split2[1]}%`, value: `[${split2[0]}]`, inline: false },
          //   ]

          //   components = [
          //     {
          //       "type": 1,
          //       "components": [
          //         { "type": 2, "style": 2, "label": opt1, "custom_id": "poll_1_0" },
          //         { "type": 2, "style": 2, "label": opt2, "custom_id": "poll_2_0" }
          //       ]
          //     },
          //     {
          //       "type": 1,
          //       "components": [
          //         { "type": 2, "style": 4, "label": "Close Poll", "custom_id": "poll_close" },
          //       ]
          //     }
          //   ]

          //   if (opt3) {
          //     const split3 = splitBar(100, 0, 25)
          //     fields.push({ name: `${opt3.charAt(0).toUpperCase() + opt3.slice(1)} • 0/${amount} Votes • ${split3[1]}%`, value: `[${split3[0]}]`, inline: false })
          //     components[0].components.push({ "type": 2, "style": 2, "label": opt3, "custom_id": "poll_3_0" })
          //   }

          //   if (opt4) {
          //     const split4 = splitBar(100, 0, 25)
          //     fields.push({ name: `${opt4.charAt(0).toUpperCase() + opt4.slice(1)} • 0/${amount} Votes • ${split4[1]}%`, value: `[${split4[0]}]`, inline: false })
          //     components[0].components.push({ "type": 2, "style": 2, "label": opt4, "custom_id": "poll_4_0" })
          //   }

          //   if (opt5) {
          //     const split5 = splitBar(100, 0, 25)
          //     fields.push({ name: `${opt5.charAt(0).toUpperCase() + opt5.slice(1)} • 0/${amount} Votes • ${split5[1]}%`, value: `[${split5[0]}]`, inline: false })
          //     components[0].components.push({ "type": 2, "style": 2, "label": opt5, "custom_id": "poll_5_0" })
          //   }

          //   embed = {
          //     title: `Poll - ${ques.charAt(0).toUpperCase() + ques.slice(1)}`,
          //     color: parseInt(random.pickFromArray(colors), 16),
          //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
          //     fields: fields,
          //     footer: { text: "Last updated" },
          //     timestamp: new Date().toISOString()
          //   }

          //   await interaction.reply({ embeds: [embed], components: components })
          break
        }

        case "timestamp": {
          const millisecond = interaction.options.getInteger("millisecond") || 0 as number
          const second = interaction.options.getInteger("second") || 0 as number
          const minute = interaction.options.getInteger("minute") || 0 as number
          const hour = interaction.options.getInteger("hour") || 0 as number
          const day = interaction.options.getInteger("day") || 1 as number
          const month = (interaction.options.getInteger("month") || 1) - 1 as number
          const year = interaction.options.getInteger("year") as number
          let date: Temporal.ZonedDateTime | Temporal.Instant = Temporal.ZonedDateTime.from({ year, month, day, hour, minute, second, millisecond, timeZone: "UTC" })
          if (date.toString() == "Invalid Date") {date = Temporal.Instant.fromEpochSeconds(year < 0 ? -8640000000000 : 8640000000000)}
          const timestamp = date.epochSeconds
          await interaction.reply({ content: `**Date** • ${date}\n**Timestamp** • ${Math.floor(timestamp/1000)}(${String(date.epochMilliseconds).padStart(3, "0")})\n\n**Discord Styled Timestamps**\n${timestampStyler(timestamp, "tsutils")}`, ephemeral: true })
          break
        }
      }
    }
  }
}

export async function button(interaction: { message: { interaction: { commandName: string }; embeds: any[]; edit: (arg0: { components: never[] }) => any }; customId: string; user: { id: any }; reply: (arg0: { content: string; ephemeral: boolean }) => any }) {
  if (interaction.message.interaction.commandName == "poll") {
    const embed = new UnsafeEmbedBuilder((interaction.message.embeds[0] as Embed).data).toJSON()
    let user = embed.description?.split(" ").at(-1) as string
    user = user.slice(2, user.length - 1)
    switch (true) {
      case interaction.customId.startsWith("poll"): {
        switch (interaction.customId.slice(5)) {
          case "close": {
            console.log("close")
            if (interaction.user.id == user) {await interaction.message.edit({ components: [] })}
            else {await interaction.reply({ content: "You cannot close this poll", ephemeral: true })}
            break
          }
        }
        break
      }
    }
  }
}
