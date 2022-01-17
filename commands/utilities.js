var axios = require('axios').default
const { colors, RGB, HSV, CMYK, Convert, a } = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
  cmd: {
    name: "utils",
    description: "Random utilities for you to use!",
    options: [
      {
        name: "weather",
        description: "Get the current weather for any places from www.weatherapi.com",
        type: 2,
        options: [
          {
            name: "current",
            description: "Get the weather from the chosen provider",
            type: 1,
            options: [
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
          // {
          //   name: "forecast",
          //   description: "Get the forecast from the chosen provider",
          //   type: 1,
          //   options: [
          //     {
          //       name: "location",
          //       description: "The location to get the weather data [string]",
          //       type: 3,
          //       required: true
          //     },
          //     {
          //       name: "is_imperial",
          //       description: "Whether to use imperial (˚F) for the result",
          //       type: 5,
          //       required: false
          //     }
          //   ]
          // }
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

        switch(interaction.options._subcommand) {
          case 'current': {
            location = interaction.options.getString('location')

            if (interaction.options.getBoolean('is_imperial')) {
              unit = 'imperial'
              dist = 'mi'
              symbol = '˚F'
              speed = 'mi/h'
            } else {
              unit = 'metric'
              dist = 'km'
              symbol = '˚C'
              speed = 'm/s'
            }

            request = {
              method: 'GET',
              url: encodeURI(`https://api.weatherapi.com/v1/forecast.json`),
              params: { key: process.env.WEATHERAPI, q: location, days: 1, aqi: 'yes' }
            }

            await axios.request(request)
            .then(response => {
              data = response.data
              
              now = new Date()
              data.deviceTime = new Date(now - now.getSeconds() * 1000 - now.getMilliseconds())
              data.localTime = new Date(data.location.localtime)
              data.tz = Math.round(-((data.deviceTime - data.localTime) / 60000 + data.deviceTime.getTimezoneOffset())/60)

              data.location.region == ''
              ? data.title = `${data.location.name} - ${data.location.country} (UTC${data.tz !== 0 ? data.tz > 0 ? ' +' : '' : ''}${data.tz !== 0 ? data.tz : ''})`
              : data.title = `${data.location.name} - ${data.location.region} - ${data.location.country} (UTC${data.tz !== 0 ? data.tz > 0 ? ' +' : '' : ''}${data.tz !== 0 ? data.tz : ''})`
            })
            .catch(e => {
              e.response.data.error.message == 'No matching location found.'
              ? interaction.editReply({ content: `The location \`${e.config.params.q}\` was not found. Maybe check your spelling?`, ephemeral: true })
              : interaction.editReply({ content: `There was an unknown problem responding to your requests.\n**Quick Info**\nStatus: ${e.response.status} - ${e.response.statusText}\nProvided Location: ${e.config.params.q}`, ephemeral: true })
              console.error(e)
            })

            times = [data.forecast.forecastday[0].astro.sunrise, data.forecast.forecastday[0].astro.sunset, data.forecast.forecastday[0].astro.moonrise, data.forecast.forecastday[0].astro.moonset]
            base = new Date(data.forecast.forecastday[0].date_epoch * 1000)
            astro_time = []
            aqi_ratings = [[null, 'Good', 'Moderate', 'Unhealthy for Sensitive Group', 'Unhealthy', 'Very Unhealthy', 'Hazardous'], [null, 'Low', 'Moderate', 'High', 'Very High']]

            times.forEach((time, ind) => {
              time = String(time)
              hr = parseInt(time.substring(0, 2)) - data.tz
              mn = parseInt(time.substring(3, 5))
              if (time.endsWith('PM')) hr += 12
              astro_time.push(new Date(base.getTime() + (hr * 3600 + mn * 60) * 1000).getTime() / 1000)
              if (time.startsWith('0')) time = time.substring(1)
              times[ind] = time
            })

            const weatherEmbed = new MessageEmbed()
            .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
            .setTitle(`${data.title}`)
            .setDescription(`${data.current.condition.text}\n\`\`\`Weather\`\`\``)
            .addFields(
              { name: 'Temperature   ', value: `${(unit == 'metric' ? data.current.temp_c : data.current.temp_f) + symbol}`, inline: true },
              { name: 'Feels Like   ', value: `${(unit == 'metric' ? data.current.feelslike_c : data.current.feelslike_f) + symbol}`, inline: true },
              { name: 'Min/Max Temp', value: `${unit == 'metric' ? data.forecast.forecastday[0].day.mintemp_c + symbol + '/' + data.forecast.forecastday[0].day.maxtemp_c + symbol : data.forecast.forecastday[0].day.mintemp_f + symbol + '/' + data.forecast.forecastday[0].day.maxtemp_f + symbol}`, inline: true },
              { name: 'Pressure', value: `${unit == 'metric' ? data.current.pressure_mb + ' hPa' : data.current.pressure_in + ' in'}`, inline: true },
              { name: 'Humidity', value: `${data.current.humidity}%`, inline: true },
              { name: 'Clouds', value: `${data.current.cloud}%`, inline: true },
              { name: 'Wind', value: `${(unit == 'metric' ? data.current.wind_kph : data.current.wind_mph) + speed} ${data.current.wind_degree}˚`, inline: true },
              { name: 'Gust', value: `${(unit == 'metric' ? data.current.gust_kph : data.current.gust_mph) + speed}`, inline: true },
              { name: 'Visibility', value: `${(unit == 'metric' ? data.current.vis_km : data.current.vis_miles) + dist}%`, inline: true },
              { name: 'Sunrise', value: `<t:${astro_time[0]}:T>\n${times[0]} Local`, inline: true },
              { name: 'Sunset', value: `<t:${astro_time[1]}:T>\n${times[1]} Local`, inline: true },
              { name: 'UV Index', value: `${data.current.uv}`, inline: true },
              { name: 'Moon Phase', value: `${data.forecast.forecastday[0].astro.moon_phase}\n${data.forecast.forecastday[0].astro.moon_illumination}% Illumination`, inline: true },
              { name: 'Moonrise', value: `<t:${astro_time[2]}:T>\n${times[2]} Local`, inline: true },
              { name: 'Moonset', value: `<t:${astro_time[3]}:T>\n${times[3]} Local`, inline: true },
              
              { name: '​', value: `\`\`\`Air Quality\`\`\``, inline: false },
              { name: 'US - EPA Rating', value: `${aqi_ratings[0][data.current.air_quality["us-epa-index"]]}`, inline: true },
              { name: 'UK Defra Rating', value: `${aqi_ratings[1][Math.ceil(data.current.air_quality["gb-defra-index"] / 3)]} Risk`, inline: true },
              { name: '​', value: `​`, inline: true },
              { name: 'CO', value: `${data.current.air_quality.co.toFixed(1)} μg/m³`, inline: true },
              { name: 'O₃', value: `${data.current.air_quality.o3.toFixed(1)} μg/m³`, inline: true },
              { name: 'NO₂', value: `${data.current.air_quality.no2.toFixed(1)} μg/m³`, inline: true },
              { name: 'SO₂', value: `${data.current.air_quality.so2.toFixed(1)} μg/m³`, inline: true },
              { name: 'PM 2.5', value: `${data.current.air_quality.pm2_5.toFixed(1)} μg/m³`, inline: true },
              { name: 'PM 10', value: `${data.current.air_quality.pm10.toFixed(1)} μg/m³`, inline: true },
              
              { name: '​', value: `Data Provided by <:WeatherAPI:932557801153241088> [WeatherAPI](https://www.weatherapi.com/)`, inline: true }
            )
            .setThumbnail(`https:${data.current.condition.icon}`)
            .setTimestamp()

            await interaction.editReply({ embeds: [weatherEmbed] })
            break
          }
          case 'forecast': {interaction.editReply('Not yet implemented...')}
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
        .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` })
        .setFooter({ text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` })
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