var axios = require('axios').default
const { colors, RGB, HSV, CMYK, Convert } = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
  data: new SlashCommandBuilder()
  .setName('utils')
  .setDescription('Random utilities for you to use!')
  .addSubcommandGroup(group => group
    .setName('weather')
    .setDescription('Get the current weather for any places from different sources')
    .addSubcommand(subcommand => subcommand
      .setName('current')
      .setDescription('Get the weather from the chosen provider')
      .addStringOption(option => option
        .setName('api')
        .setDescription('The data provider to use')
        // .addChoice('AccuWeather', 'forecast_accuweather')
        .addChoice('OpenWeatherMap', 'forecast_openweathermap')
        .addChoice('WeatherAPI', 'forecast_weatherapi')
        .setRequired(true)
        )
      .addStringOption(option => option
        .setName('location')
        .setDescription('The location to get the weather data [string]')
        .setRequired(true)
      )
      .addBooleanOption(option => option
        .setName('is_imperial')
        .setDescription('Whether to use imperial (˚F) for the result')
      )
    )
    /* .addSubcommand(subcommand => subcommand
      .setName('forecast')
      .setDescription('Get air pollution data from the chosen provider')
      .addStringOption(option => option
        .setName('api')
        .setDescription('The data provider to use')
        .addChoice('AccuWeather', 'forecast_accuweather')
        .addChoice('OpenWeatherMap', 'forecast_openweathermap')
        .addChoice('WeatherAPI', 'forecast_weatherapi')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('air_pollution')
      .setDescription('Get air pollution data from the chosen provider')
      .addStringOption(option => option
        .setName('api')
        .setDescription('The data provider to use')
        .addChoice('AccuWeather', 'forecast_accuweather')
        .addChoice('OpenWeatherMap', 'forecast_openweathermap')
        .addChoice('WeatherAPI', 'forecast_weatherapi')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('weather_map')
      .setDescription('Get a weather map from openweathermap.org')
      .addStringOption(option => option
        .setName('map_type')
        .setDescription('The type of map to get')
        .addChoice('Clouds', 'map_clouds')
        .addChoice('Precipitation', 'map_precipication')
        .addChoice('Pressure', 'map_pressure')
        .addChoice('Wind', 'map_wind')
        .addChoice('Temperature', 'map_temperature')
        .setRequired(true)
      )
    ) */
  )
  .addSubcommandGroup(group => group
    .setName('color')
    .setDescription('Return a preview of the color')
    .addSubcommand(subcommand => subcommand
      .setName('rgb')
      .setDescription('Input RGB color type')
      .addIntegerOption(option => option
        .setName('red')
        .setDescription('The red value of the RGB color [integer 0~255]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('green')
        .setDescription('The green value of the RGB color [integer 0~255]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('blue')
        .setDescription('The blue value of the RGB color [integer 0~255]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('hex')
      .setDescription('Input Hex color type')
      .addStringOption(option => option
        .setName('value')
        .setDescription('The Hex value of the color [hex, length 6]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('hsv')
      .setDescription('Input HSV color type')
      .addIntegerOption(option => option
        .setName('hue')
        .setDescription('The hue value of the HSV color [integer 0~360]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('saturation')
        .setDescription('The green value of the HSV color [integer 0~100]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('value')
        .setDescription('The value value of the HSV color [integer 0~100]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('cmyk')
      .setDescription('Input RGB color type')
      .addIntegerOption(option => option
        .setName('cyan')
        .setDescription('The cyan value of the CMYK color [integer 0~100]')
        .setRequired(true)
        )
      .addIntegerOption(option => option
        .setName('magenta')
        .setDescription('The magenta value of the CMYK color [integer 0~100]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('yellow')
        .setDescription('The yellow value of the CMYK color [integer 0~100]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('key')
        .setDescription('The key value of the CMYK color [integer 0~100]')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('random')
      .setDescription('Generate a random color')
    )
  ),

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
    }
  }
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "<location>",
  usage: '`/' + module.exports.data.name + ' <location>`'
}