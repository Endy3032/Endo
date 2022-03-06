var axios = require("axios").default
const { ApplicationCommandOptionType, ChannelType } = require("discord.js")
const { colors, RGB, HSV, CMYK, Convert } = require("../other/misc.js")
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
                "min-value": 0,
                "max-value": 255,
                required: true
              },
              {
                name: "green",
                description: "The green value of the RGB color [integer 0~255]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 255,
                required: true
              },
              {
                name: "blue",
                description: "The blue value of the RGB color [integer 0~255]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 255,
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
                "min-value": 0,
                "max-value": 360,
                required: true
              },
              {
                name: "saturation",
                description: "The saturation value of the HSV color [integer 0~100]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "value",
                description: "The value value of the HSV color [integer 0~100]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 100,
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
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "magenta",
                description: "The magenta value of the CMYK color [integer 0~100]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "yellow",
                description: "The yellow value of the CMYK color [integer 0~100]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "key",
                description: "The key value of the CMYK color [integer 0~100]",
                type: ApplicationCommandOptionType.Integer,
                "min-value": 0,
                "max-value": 100,
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
        name: "weather",
        description: "Get the current weather for any places from www.weatherapi.com",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: "current",
            description: "Get the weather from the chosen provider",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "location",
                description: "The location to get the weather data [string]",
                type: ApplicationCommandOptionType.String,
                required: true
              },
              {
                name: "options",
                description: "Options to change the output",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                  { name: "Use Imperial (˚F)", value: "imp" },
                  { name: "Includes Air Quality", value: "aq" },
                  { name: "Both", value: "both" }
                ]
              }
            ]
          },
          // #region forecast
          // {
          //   name: "forecast",
          //   description: "Get the forecast from the chosen provider",
          //   type: ApplicationCommandOptionType.Subcommand,
          //   options: [
          //     {
          //       name: "location",
          //       description: "The location to get the weather data [string]",
          //       type: ApplicationCommandOptionType.String,
          //       required: true
          //     },
          //     {
          //       name: "options",
          //       description: "Several options to change the output",
          //       type: ApplicationCommandOptionType.String,
          //       required: false,
          //       choices: [
          //         { name: "Use Imperial (˚F)", value: "imp" },
          //         { name: "Includes Air Quality", value: "aq" },
          //         { name: "Both", value: "both" }
          //       ]
          //     }
          //   ]
          // }
          // #endregion
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
            hex.startsWith("#") && hex.length == 7 ? hex = hex.substring(1, 7) : hex

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
          color: parseInt(hex.substring(1), 16),
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
          thumbnail: { url: `https://dummyimage.com/128/${hex.substring(1, 7)}/${hex.substring(1, 7)}.png` },
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
            console.log(user)
            nitroType = ["None", "Nitro Classic", "Nitro"]

            await interaction.reply({ embeds: [{
              color: parseInt(user.hexAccentColor ? user.hexAccentColor.substring(1) : colors[Math.floor(Math.random() * colors.length)], 16),
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

      case "weather": {
        await interaction.deferReply()

        switch (interaction.options._subcommand) {
          case "current": {
            location = interaction.options.getString("location")
            options = interaction.options.getString("options")

            if (options == "imp" || options == "both") {
              unit = "imperial"
              dist = "mi"
              symbol = "˚F"
              speed = "mi/h"
            } else {
              unit = "metric"
              dist = "km"
              symbol = "˚C"
              speed = "m/s"
            }

            request = {
              method: "GET",
              url: encodeURI("https://api.weatherapi.com/v1/forecast.json"),
              params: { key: process.env.WEATHERAPI, q: location, days: 1, aqi: "yes" }
            }

            await axios.request(request)
              .then(response => {
                data = response.data

                now = new Date()
                data.deviceTime = new Date(now - now.getSeconds() * 1000 - now.getMilliseconds())
                data.localTime = new Date(data.location.localtime)
                data.tz = Math.round(-((data.deviceTime - data.localTime) / 60000 + data.deviceTime.getTimezoneOffset()) / 60)

                data.location.region == ""
                  ? data.title = `${data.location.name} - ${data.location.country} (UTC${data.tz !== 0 ? data.tz > 0 ? " +" : "" : ""}${data.tz !== 0 ? data.tz : ""})`
                  : data.title = `${data.location.name} - ${data.location.region} - ${data.location.country} (UTC${data.tz !== 0 ? data.tz > 0 ? " +" : "" : ""}${data.tz !== 0 ? data.tz : ""})`

                times = [data.forecast.forecastday[0].astro.sunrise, data.forecast.forecastday[0].astro.sunset, data.forecast.forecastday[0].astro.moonrise, data.forecast.forecastday[0].astro.moonset]
                base = new Date(data.forecast.forecastday[0].date_epoch * 1000)
                astro_time = []
                aqi_ratings = [[null, "Good", "Moderate", "Unhealthy for Sensitive Group", "Unhealthy", "Very Unhealthy", "Hazardous"], [null, "Low", "Moderate", "High", "Very High"]]

                times.forEach((time, ind) => {
                  time = String(time)
                  hr = parseInt(time.substring(0, 2)) - data.tz
                  mn = parseInt(time.substring(3, 5))
                  if (time.endsWith("PM"))
                    hr += 12
                  astro_time.push(new Date(base.getTime() + (hr * 3600 + mn * 60) * 1000).getTime() / 1000)
                  if (time.startsWith("0"))
                    time = time.substring(1)
                  times[ind] = time
                })

                // Data Provided by <:WeatherAPI:932557801153241088> [WeatherAPI](https://www.weatherapi.com/)
                weatherEmbed = {
                  title: data.title,
                  description: `${data.current.condition.text}\n\`\`\`Weather\`\`\``,
                  color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
                  fields: [
                    { name: "Temperature   ", value: `${(unit == "metric" ? data.current.temp_c : data.current.temp_f) + symbol}`, inline: true },
                    { name: "Feels Like   ", value: `${(unit == "metric" ? data.current.feelslike_c : data.current.feelslike_f) + symbol}`, inline: true },
                    { name: "Min/Max Temp", value: `${unit == "metric" ? data.forecast.forecastday[0].day.mintemp_c + symbol + "/" + data.forecast.forecastday[0].day.maxtemp_c + symbol : data.forecast.forecastday[0].day.mintemp_f + symbol + "/" + data.forecast.forecastday[0].day.maxtemp_f + symbol}`, inline: true },
                    { name: "Pressure", value: `${unit == "metric" ? data.current.pressure_mb + " hPa" : data.current.pressure_in + " in"}`, inline: true },
                    { name: "Humidity", value: `${data.current.humidity}%`, inline: true },
                    { name: "Clouds", value: `${data.current.cloud}%`, inline: true },
                    { name: "Wind", value: `${(unit == "metric" ? data.current.wind_kph : data.current.wind_mph) + speed} ${data.current.wind_degree}˚`, inline: true },
                    { name: "Gust", value: `${(unit == "metric" ? data.current.gust_kph : data.current.gust_mph) + speed}`, inline: true },
                    { name: "Visibility", value: `${(unit == "metric" ? data.current.vis_km : data.current.vis_miles) + dist}%`, inline: true },
                    { name: "Sunrise", value: `<t:${astro_time[0]}:T>\n${times[0]} Local`, inline: true },
                    { name: "Sunset", value: `<t:${astro_time[1]}:T>\n${times[1]} Local`, inline: true },
                    { name: "UV Index", value: `${data.current.uv}`, inline: true },
                    { name: "Moon Phase", value: `${data.forecast.forecastday[0].astro.moon_phase}\n${data.forecast.forecastday[0].astro.moon_illumination}% Illumination`, inline: true },
                    { name: "Moonrise", value: `<t:${astro_time[2]}:T>\n${times[2]} Local`, inline: true },
                    { name: "Moonset", value: `<t:${astro_time[3]}:T>\n${times[3]} Local`, inline: true },
                  ],
                  thumbnail: { url: `https:${data.current.condition.icon}` },
                  footer: { text: "Data Provided by WeatherAPI", icon_url: "https://cdn.discordapp.com/attachments/927068773104619570/927444221403746314/WeatherAPI.png" },
                  timestamp: new Date().toISOString(),
                }

                if (options == "aq" || options == "both") {
                  weatherEmbed.fields.push(
                    { name: "\u200b", value: "```Air Quality```", inline: false },
                    { name: "US - EPA Rating", value: `${aqi_ratings[0][data.current.air_quality["us-epa-index"]]}`, inline: true },
                    { name: "UK Defra Rating", value: `${aqi_ratings[1][Math.ceil(data.current.air_quality["gb-defra-index"] / 3)]} Risk`, inline: true },
                    { name: "\u200b", value: "\u200b", inline: true },
                    { name: "CO", value: `${data.current.air_quality.co.toFixed(1)} μg/m³`, inline: true },
                    { name: "O₃", value: `${data.current.air_quality.o3.toFixed(1)} μg/m³`, inline: true },
                    { name: "NO₂", value: `${data.current.air_quality.no2.toFixed(1)} μg/m³`, inline: true },
                    { name: "SO₂", value: `${data.current.air_quality.so2.toFixed(1)} μg/m³`, inline: true },
                    { name: "PM 2.5", value: `${data.current.air_quality.pm2_5.toFixed(1)} μg/m³`, inline: true },
                    { name: "PM 10", value: `${data.current.air_quality.pm10.toFixed(1)} μg/m³`, inline: true },
                  )
                }

                interaction.editReply({ embeds: [weatherEmbed] })
              })
              .catch(e => {
                e.response.data.error.message == "No matching location found."
                  ? interaction.editReply({ content: `The location \`${e.config.params.q}\` was not found. Maybe check your spelling?`, ephemeral: true })
                  : interaction.editReply({ content: `There was an unknown problem responding to your requests.\n**Quick Info**\nStatus: ${e.response.status} - ${e.response.statusText}\nProvided Location: ${e.config.params.q}`, ephemeral: true })
              })
            break
          }
          case "forecast": { interaction.editReply("Not yet implemented...") }
        }
        break
      }

      default: {
        switch (interaction.options._subcommand) {
          case "eval": {
            const expression = interaction.options.getString("expression")
            symbols = ["π", "τ", ["a", "b"]]
            symvals = [Math.PI, Math.PI * 2, 1]

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
              index.log(`${expression} = ${result}`)

              await interaction.reply({ embeds: [{
                title: "Calculation",
                color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
                fields: [
                  { name: "Expression", value: expression, inline: false },
                  { name: "Result", value: result, inline: false }
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
            //     { name: `${opt1.charAt(0).toUpperCase() + opt1.substring(1)} • 0/${amount} Votes • ${split1[1]}%`, value: `[${split1[0]}]`, inline: false },
            //     { name: `${opt2.charAt(0).toUpperCase() + opt2.substring(1)} • 0/${amount} Votes • ${split2[1]}%`, value: `[${split2[0]}]`, inline: false },
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
            //     fields.push({ name: `${opt3.charAt(0).toUpperCase() + opt3.substring(1)} • 0/${amount} Votes • ${split3[1]}%`, value: `[${split3[0]}]`, inline: false })
            //     components[0].components.push({ "type": 2, "style": 2, "label": opt3, "custom_id": "poll_3_0" })
            //   }

            //   if (opt4) {
            //     const split4 = splitBar(100, 0, 25)
            //     fields.push({ name: `${opt4.charAt(0).toUpperCase() + opt4.substring(1)} • 0/${amount} Votes • ${split4[1]}%`, value: `[${split4[0]}]`, inline: false })
            //     components[0].components.push({ "type": 2, "style": 2, "label": opt4, "custom_id": "poll_4_0" })
            //   }

            //   if (opt5) {
            //     const split5 = splitBar(100, 0, 25)
            //     fields.push({ name: `${opt5.charAt(0).toUpperCase() + opt5.substring(1)} • 0/${amount} Votes • ${split5[1]}%`, value: `[${split5[0]}]`, inline: false })
            //     components[0].components.push({ "type": 2, "style": 2, "label": opt5, "custom_id": "poll_5_0" })
            //   }

            //   embed = {
            //     title: `Poll - ${ques.charAt(0).toUpperCase() + ques.substring(1)}`,
            //     color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
            //     description: `0 votes so far\nPoll Created <t:${creation}:R> by <@${interaction.user.id}>`,
            //     fields: fields,
            //     footer: { text: "Last updated" },
            //     timestamp: new Date().toISOString()
            //   }

            //   await interaction.reply({ embeds: [embed], components: components })
          }
        }
      }

        break
    }
  },

  async button(interaction) {
    if (interaction.message.interaction.commandName == "poll") {
      embed = interaction.message.embeds[0]
      user = embed.description.split(" ").at(-1)
      user = user.substring(2, user.length - 1)
      switch (true) {
        case interaction.customId.startsWith("poll"): {
          switch (interaction.customId.substring(5)) {
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