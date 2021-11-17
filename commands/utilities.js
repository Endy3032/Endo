var axios = require('axios').default
const misc = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

const colors = misc.colors

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
        .setDescription('The red value of the color [integer 0~255]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('green')
        .setDescription('The green value of the color [integer 0~255]')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('blue')
        .setDescription('The blue value of the color [integer 0~255]')
        .setRequired(true)
      )
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
              const weather_embed = new MessageEmbed()
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

              interaction.editReply({ embeds: [weather_embed] })
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

            // if (r <= 255 && g <= 255 && b <= 255) {
            //   interaction.reply({ content: `${r}, ${g}, ${b} = #${r.toString(16)}${g.toString(16)}${b.toString(16)}` })
            // } else {
            //   interaction.reply({ content: 'The color values you provided is not valid. They must be between 0 and 255.', ephemeral: true })
            // }
            rgb = new misc.RGB(r, g, b)
            hex = misc.Convert.toHEX(rgb)
            hsv = misc.Convert.toHSV(rgb)
            cmyk = misc.Convert.toCMYK(rgb)

            console.log(hex.substring(1, 7))

            const color_embed = new MessageEmbed()
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
              {name: 'CMYK', value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`, inline: true}
            )
            .setThumbnail(`https://dummyimage.com/128/${hex.substring(1, 7)}/${hex.substring(1, 7)}.png`)

            await interaction.reply({embeds: [color_embed]})

            break
          }

        break
        }
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