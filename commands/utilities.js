var axios = require('axios').default
const { colors, RGB, HSV, CMYK, Convert } = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
  cmd: {
    name: "utils",
    description: "Random utilities for you to use!",
    options: [
      {
        name: "weather",
        description: "Get the current weather for any places from different sources",
        type: 2,
        options: [
          {
            name: "current",
            description: "Get the weather from the chosen provider",
            type: 1,
            options: [
              {
                name: "api",
                description: "The data provider to use",
                type: 3,
                choices: [
                  { name: "AccuWeather", value: "forecast_accuweather" },
                  { name: "OpenWeatherMap", value: "forecast_openweathermap" },
                  { name: "WeatherAPI", value: "forecast_weatherapi" }
                ],
                required: true
              },
              {
                name: "location",
                description: "The location to get the weather data [string]",
                type: 3,
                required: true
              },
              {
                name: "is_imperial",
                description: "Whether to use imperial (˚F) for the result",
                type: 5,
                required: false
              }
            ]
          },
          {
            name: "forecast",
            description: "Get the forecast from the chosen provider",
            type: 1,
            options: [
              {
                name: "api",
                description: "The data provider to use",
                type: 3,
                choices: [
                  { name: "AccuWeather", value: "forecast_accuweather" },
                  { name: "OpenWeatherMap", value: "forecast_openweathermap" },
                  { name: "WeatherAPI", value: "forecast_weatherapi" }
                ],
                required: true
              },
              {
                name: "location",
                description: "The location to get the weather data [string]",
                type: 3,
                required: true
              },
              {
                name: "is_imperial",
                description: "Whether to use imperial (˚F) for the result",
                type: 5,
                required: false
              }
            ]
          },
          {
            name: "air_pollution",
            description: "Get air pollution data from the chosen provider",
            type: 1,
            options: [
              {
                name: "api",
                description: "The data provider to use",
                type: 3,
                choices: [
                  { name: "AccuWeather", value: "forecast_accuweather" },
                  { name: "OpenWeatherMap", value: "forecast_openweathermap" },
                  { name: "WeatherAPI", value: "forecast_weatherapi" }
                ],
                required: true
              },
              {
                name: "location",
                description: "The location to get the weather data [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "weather_map",
            description: "Get a weather map from openweathermap.org",
            type: 1,
            options: [
              {
                name: "location",
                description: "The location to get the weather data [string]",
                type: 3,
                required: true
              },
              {
                name: "map_type",
                description: "The type of map to get",
                type: 3,
                choices: [
                  { name: "Clouds",         value: "map_clouds" },
                  { name: "Precipitation",  value: "map_precipication" },
                  { name: "Pressure",       value: "map_pressure" },
                  { name: "Temperature",    value: "map_temperature" },
                  { name: "Wind",           value: "map_wind" },
                ],
                required: true
              }
            ]
          },
        ]
      },
      {
        name: "color",
        description: "Return a preview of the color",
        type: 2,
        options: [
          { 
            name: "rgb",
            description: "Input RGB color type",
            type: 1,
            options: [
              {
                name: "red",
                description: "The red value of the RGB color [integer 0~255]",
                type: 4,
                "min-value": 0,
                "max-value": 255,
                required: true
              },
              {
                name: "green",
                description: "The green value of the RGB color [integer 0~255]",
                type: 4,
                "min-value": 0,
                "max-value": 255,
                required: true
              },
              {
                name: "blue",
                description: "The blue value of the RGB color [integer 0~255]",
                type: 4,
                "min-value": 0,
                "max-value": 255,
                required: true
              }
            ]
          },
          {
            name: "hex",
            description: "Input Hex color type",
            type: 1,
            options: [
              {
                name: "value",
                description: "The hex value of the color [string]",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: "hsv",
            description: "Input HSV color type",
            type: 1,
            options: [
              {
                name: "hue",
                description: "The hue value of the HSV color [integer 0~360]",
                type: 4,
                "min-value": 0,
                "max-value": 360,
                required: true
              },
              {
                name: "saturation",
                description: "The saturation value of the HSV color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "value",
                description: "The value value of the HSV color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              }
            ]
          },
          {
            name: "cmyk",
            description: "Input CMYK color type",
            type: 1,
            options: [
              {
                name: "cyan",
                description: "The cyan value of the CMYK color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "magenta",
                description: "The magenta value of the CMYK color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "yellow",
                description: "The yellow value of the CMYK color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              },
              {
                name: "key",
                description: "The key value of the CMYK color [integer 0~100]",
                type: 4,
                "min-value": 0,
                "max-value": 100,
                required: true
              }
            ]
          },
          {
            name: "random",
            description: "Generate a random color",
            type: 1
          }
        ]
      },
      { 
        name: "ping",
        description: "Get the bot latency info",
        type: 1
      }
    ]
  },

  async execute(interaction) {
    switch(interaction.options._group) {
      case 'weather': {
        await interaction.deferReply()
        switch (interaction.options._subcommand) {
          case 'current': {
            location = interaction.options.getString('location')
            console.log(interaction.options.getBoolean('is_imperial'))
            if (interaction.options.getBoolean('is_imperial')) {
              unit = 'imperial'
              symbol = '˚F'
              speed = 'mi/h'
            } else {
              unit = 'metric'
              symbol = '˚C'
              speed = 'm/s'
            }

            request = {
              method: 'GET',
              url: encodeURI(`https://api.openweathermap.org/data/2.5/weather`),
              params: {q: location, units: unit, appid: process.env.OPENWEATHERMAP}
            }

            console.log(unit, symbol, speed)

            await axios.request(request)
            .then(response => {
              const weatherEmbed = new MessageEmbed()
                .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
                .setTitle(`${response.data.name} - ${response.data.sys.country} (GMT${response.data.timezone > 0 ? '+' : ''}${response.data.timezone/3600})`)
                .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
                .setDescription(`${response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1)}`)
                .addFields(
                  { name: 'Temperature   ', value: `${response.data.main.temp}${symbol}`, inline: true },
                  { name: 'Feels Like   ', value: `${response.data.main.feels_like}${symbol}`, inline: true },
                  { name: 'Min/Max Temp', value: `${response.data.main.temp_min}${symbol}/${response.data.main.temp_max}${symbol}`, inline: true },
                  { name: 'Pressure', value: `${response.data.main.pressure}hPa`, inline: true },
                  { name: 'Humidity', value: `${response.data.main.humidity}%`, inline: true },
                  { name: 'Wind', value: `${response.data.wind.speed}${speed} ${response.data.wind.deg}˚`, inline: true },
                  { name: 'Clouds', value: `${response.data.clouds.all/100}%`, inline: true },
                  { name: 'Sunrise', value: `<t:${response.data.sys.sunrise}:T>`, inline: true },
                  { name: 'Sunset', value: `<t:${response.data.sys.sunset}:T>`, inline: true }
                )
                .setThumbnail(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
                .setFooter('OpenWeatherMap', `https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg`)
                .setTimestamp()

              interaction.editReply({ embeds: [weatherEmbed] })
            })
            .catch(_ => {
              interaction.editReply({ content: `The city you provided is not found. Maybe check your spelling?`, ephemeral: true })
            })

            break
          }
        }

        break
      }

      case 'color': {
        switch (interaction.options._subcommand) {
          case 'rgb': {
            r = interaction.options.getInteger('red')
            g = interaction.options.getInteger('green')
            b = interaction.options.getInteger('blue')

            rgb = new RGB(r, g, b)
            hex = Convert.toHEX(rgb)
            hsv = Convert.toHSV(rgb)
            cmyk = Convert.toCMYK(rgb)

            break
          }
          
          case 'hex': {
            hex = interaction.options.getString('value')
            hex.startsWith('#') && hex.length == 7 ? hex = hex.substring(1, 7) : hex

            rgb = Convert.toRGB(hex)
            hsv = Convert.toHSV(rgb)
            cmyk = Convert.toCMYK(rgb)
            hex = `#${hex}`

            break
          }

          case 'hsv': {
            h = interaction.options.getInteger('hue')
            s = interaction.options.getInteger('saturation')
            v = interaction.options.getInteger('value')

            hsv = new HSV(h, s, v)
            rgb = Convert.toRGB(hsv)
            hex = Convert.toHEX(rgb)
            cmyk = Convert.toCMYK(rgb)

            break
          }

          case 'cmyk': {
            c = interaction.options.getInteger('cyan')
            m = interaction.options.getInteger('magenta')
            y = interaction.options.getInteger('yellow')
            k = interaction.options.getInteger('key')

            cmyk = new CMYK(c, m, y, k)
            rgb = Convert.toRGB(cmyk)
            hex = Convert.toHEX(rgb)
            hsv = Convert.toHSV(rgb)

            break
          }

          case 'random': {
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

        const colorEmbed = new MessageEmbed()
        .setTitle('Color Conversion')
        .setColor(`${hex}`)
        .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
        .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)
        .setTimestamp()
        .addFields(
          {name: 'RGB', value: `${rgb.r}, ${rgb.g}, ${rgb.b}`, inline: true},
          {name: '​', value: `​`, inline: true},
          {name: 'HEX', value: `${hex}`, inline: true},
          {name: 'HSV', value: `${hsv.h}, ${hsv.s}, ${hsv.v}`, inline: true},
          {name: '​', value: `​`, inline: true},
          {name: 'CMYK', value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`, inline: true}
        )
        .setThumbnail(`https://dummyimage.com/128/${hex.substring(1, 7)}/${hex.substring(1, 7)}.png`)

        await interaction.reply({embeds: [colorEmbed]})
        break
      }

      default: {
        switch(interaction.options._subcommand) {
          case 'ping': {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

            const pingEmbed = new MessageEmbed()
            .setTitle('Pong!')
            .addFields(
              { name: 'Websocket Latency', value: `${interaction.client.ws.ping}ms`, inline: false },
              { name: 'Roundtrip Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: false }
            )

            await interaction.editReply({content: null, embeds: [pingEmbed]})

            break
          }
        }
      }

      break
    }
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<location>",
//   usage: '`/' + module.exports.data.name + ' <location>`'
// }