var axios = require("axios").default
const { evaluate } = require("mathjs")
const { ApplicationCommandOptionType, ChannelType } = require("discord.js")
const { colors, RGB, HSV, CMYK, Convert, superEscape } = require("../other/misc.js")
// const { splitBar } = require("string-progressbar")

module.exports = {
  cmd: {
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
            name: "hex",
            description: "Input Hex color type",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "value",
                description: "The hex value of the color [string]",
                type: ApplicationCommandOptionType.String,
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
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: "expression",
            description: "The expression to calculate [string]",
            required: true
          }
        ]
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
    ]
  },

  async execute(interaction) {
    switch (interaction.options._group) {
      case "color": {
        switch (interaction.options._subcommand) {
          case "rgb": {
            r = interaction.options.getInteger("red")
            g = interaction.options.getInteger("green")
            b = interaction.options.getInteger("blue")

            rgb = new RGB(r, g, b)
            hex = Convert.toHEX(rgb)
            hsv = Convert.toHSV(rgb)
            cmyk = Convert.toCMYK(rgb)

            break
          }

          case "hex": {
            hex = interaction.options.getString("value")
            hex.startsWith("#") && hex.length == 7 ? hex = hex.slice(1, 7) : hex

            rgb = Convert.toRGB(hex)
            hsv = Convert.toHSV(rgb)
            cmyk = Convert.toCMYK(rgb)
            hex = `#${hex}`

            break
          }

          case "hsv": {
            h = interaction.options.getInteger("hue")
            s = interaction.options.getInteger("saturation")
            v = interaction.options.getInteger("value")

            hsv = new HSV(h, s, v)
            rgb = Convert.toRGB(hsv)
            hex = Convert.toHEX(rgb)
            cmyk = Convert.toCMYK(rgb)

            break
          }

          case "cmyk": {
            c = interaction.options.getInteger("cyan")
            m = interaction.options.getInteger("magenta")
            y = interaction.options.getInteger("yellow")
            k = interaction.options.getInteger("key")

            cmyk = new CMYK(c, m, y, k)
            rgb = Convert.toRGB(cmyk)
            hex = Convert.toHEX(rgb)
            hsv = Convert.toHSV(rgb)

            break
          }

          case "random": {
            r = Math.floor(Math.random() * 255)
            g = Math.floor(Math.random() * 255)
            b = Math.floor(Math.random() * 255)

            rgb = new RGB(r, g, b)
            hex = Convert.toHEX(rgb)
            hsv = Convert.toHSV(rgb)
            cmyk = Convert.toCMYK(rgb)

            break
          }
        }

        colorEmbed = {
          title: "Color Conversion",
          color: parseInt(hex.slice(1), 16),
          author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` },
          footer: { text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, icon_url: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` },
          fields: [
            { name: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "HEX", value: `${hex}`, inline: true },
            { name: "HSV", value: `${hsv.h}, ${hsv.s}, ${hsv.v}`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`, inline: true }
          ],
          thumbnail: { url: `https://dummyimage.com/128/${hex.slice(1, 7)}/${hex.slice(1, 7)}.png` },
          timestamp: new Date().toISOString(),
        }

        await interaction.reply({ embeds: [colorEmbed] })
        break
      }

      case "info": {
        switch (interaction.options.getSubcommand()) {
          case "server": {
            guild = interaction.guild
            owner = await guild.fetchOwner()
            channels = guild.channels.cache
            textCount = channels.filter(channel => channel.type == ChannelType.GuildText).size
            voiceCount = channels.filter(channel => channel.type == ChannelType.GuildVoice).size
            categoryCount = channels.filter(channel => channel.type == ChannelType.GuildCategory).size
            stageCount = channels.filter(channel => channel.type == ChannelType.GuildStageVoice).size
            emojiCount = guild.emojis.cache.size

            verificationLevel = ["Unrestricted", "Verified Email", "Registered for >5m", "Member for >10m", "Verified Phone"]
            filterLevel = ["Not Scanned", "Scan Without Roles", "Scan Everything"]

            serverEmbed = {
              color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
              description: guild.description ? `Server Description: ${guild.description}` : "Server Description: None",
              author: { name: guild.name, iconURL: guild.iconURL() },
              footer: { text: `Server ID • ${guild.id}` },
              fields: [
                { name: "Owner", value: `<@${owner.id}>`, inline: true },
                { name: "Creation Date", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: "Vanity URL", value: guild.vanityURLCode || "None", inline: true },
                { name: "Verification", value: verificationLevel[guild.verificationLevel], inline: true },
                { name: "Content Filter", value: filterLevel[guild.explicitContentFilter], inline: true },
                { name: "Verified", value: guild.verified ? "Yes" : "No", inline: true },
                { name: "General Stats", value: `${guild.memberCount} Members\n${guild.roles.cache.size} Roles\n${emojiCount} Emojis`, inline: true },
                { name: "Channel Stats", value: `${categoryCount !== 0 ? `${categoryCount} Categories\n` : ""}${textCount !== 0 ? `${textCount} Text\n` : ""}${voiceCount !== 0 ? `${voiceCount} Voice\n` : ""}${stageCount !== 0 ? `${stageCount} Stages\n` : ""}`, inline: true },
                { name: "AFK Channel", value: guild.afkChannelId !== null ? `<#${guild.afkChannelId}> (${guild.afkTimeout / 60} Min Timeout)` : "None", inline: true },
              ],
              thumbnail: { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096` },
              image: guild.banner !== null ? { url: `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.jpg?size=4096` } : null
            }

            await interaction.reply({ embeds: [serverEmbed] })
            break
          }

          case "user": {
            user = interaction.options.getUser("target") || interaction.user
            user = await user.fetch()
            nitroType = ["None", "Nitro Classic", "Nitro"]

            await interaction.reply({ embeds: [{
              color: parseInt(user.hexAccentColor ? user.hexAccentColor.slice(1) : colors[Math.floor(Math.random() * colors.length)], 16),
              author: { name: "User Info" },
              footer: { text: "Created On" },
              timestamp: user.createdAt.toISOString(),
              fields: [
                { name: "Name", value: user.username, inline: true },
                { name: "Tag", value: user.discriminator, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Banner", value: !user.banner ? user.hexAccentColor || "Default Color" : "Banner Image", inline: true },
                { name: "Nitro Type", value: nitroType[user.premium_type] || "None", inline: true },
              ],
              thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096` },
              image: user.banner ? { url: `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png` } : null
            }] })
            break
          }
        }
        break
      }

      case "random": {
        const mode = interaction.options._subcommand
        const amount = interaction.options.getInteger("amount")
        const min = interaction.options.getInteger("min") || 0
        const max = interaction.options.getInteger("max") || 100
        embed = {
          title: mode == "coin" ? "Coin flip" : mode == "dice" ? "Dice roll" : "Random numbers",
          description: ""
        }

        if (mode == "coin") {
          choices = ["Head", "Tail"]
        } else if (mode == "dice") {
          choices = [1, 2, 3, 4, 5, 6]
        } else if (mode == "number") {
          for (i = 0; i < amount; i++) embed.description += `${Math.floor(Math.random() * (max - min) + min)}, `
          embed.description = embed.description.slice(0, -2)
          await interaction.reply({ embeds: [embed] })
          break
        }

        for (i = 0; i < amount; i++) embed.description += `${choices[Math.floor(Math.random() * choices.length)]}, `
        embed.description = embed.description.slice(0, -2)

        await interaction.reply({ embeds: [embed] })
        break
      }

      default: {
        switch (interaction.options._subcommand) {
          case "calculate": {
            const expression = interaction.options.getString("expression")
            symbols = ["π", "τ"]
            symvals = [Math.PI, Math.PI * 2]

            let scope = {}
            symbols.forEach((value, i) => {
              if (typeof value == "object") {
                value.forEach((subvalue) => {
                  scope[subvalue] = symvals[i]
                })
              } else {
                scope[value] = symvals[i]
              }
            })

            try {
              result = evaluate(expression, scope)
              if (typeof result == "object") {result = result.entries.join("; ")}
              console.botLog(`${expression} = ${result}`)

              await interaction.reply({ embeds: [{
                title: "Calculation",
                color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
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
            const sent = await interaction.reply({ content: "Pinging...", fetchReply: true })

            pingEmbed = {
              title: "Pong!",
              color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
              fields: [
                { name: "Websocket Latency", value: `${interaction.client.ws.ping}ms`, inline: false },
                { name: "Roundtrip Latency", value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: false }
              ]
            }

            await interaction.editReply({ content: null, embeds: [pingEmbed] })
            break
          }

          case "poll": {
            placeholders = [["Do you like pineapples on pizza?", "Yes", "No", "Why even?", "What the heck is a pineapple pizza"], ["Where should we go to eat today", "McDonald's", "Burger King", "Taco Bell", "Wendy's"], ["What's your favorite primary color?", "Red", "Green", "Green", "Yellow"]]
            index = Math.floor(Math.random() * placeholders.length)

            modalData = {
              type: 9,
              data: {
                title: "Create a Poll",
                custom_id: "poll",
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: "Question",
                        placeholder: placeholders[index][0],
                        style: 1,
                        min_length: 1,
                        max_length: 500,
                        custom_id: "Poll Question",
                        required: true
                      }
                    ]
                  },
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: "Option 1",
                        placeholder: placeholders[index][1],
                        style: 1,
                        min_length: 1,
                        max_length: 100,
                        custom_id: "Opt1",
                        required: true
                      }
                    ]
                  },
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: "Option 2",
                        placeholder: placeholders[index][2],
                        style: 1,
                        min_length: 1,
                        max_length: 100,
                        custom_id: "Opt2",
                        required: true
                      }
                    ]
                  },
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: "Option 3",
                        placeholder: placeholders[index][3],
                        style: 1,
                        min_length: 1,
                        max_length: 100,
                        custom_id: "Opt3",
                        required: false
                      }
                    ]
                  },
                  {
                    type: 1,
                    components: [
                      {
                        type: 4,
                        label: "Option 4",
                        placeholder: placeholders[index][4],
                        style: 1,
                        min_length: 1,
                        max_length: 100,
                        custom_id: "Opt4",
                        required: false
                      }
                    ]
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
            //     color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
            //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
            //     fields: fields,
            //     footer: { text: "Last updated" },
            //     timestamp: new Date().toISOString()
            //   }

            //   await interaction.reply({ embeds: [embed], components: components })
            break
          }
        }
      }
    }
  },

  async button(interaction) {
    if (interaction.message.interaction.commandName == "poll") {
      embed = interaction.message.embeds[0]
      user = embed.description.split(" ").at(-1)
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
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<location>",
//   usage: "`/" + module.exports.data.name + " <location>`"
// }