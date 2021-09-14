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
        // .addChoice('WeatherAPI', 'forecast_weatherapi')
        .setRequired(true)
        )
      .addStringOption(option => option
        .setName('location')
        .setDescription('The location to get the weather data')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('unit')
        .setDescription('The unit for the weather data')
        .addChoice('Metric (˚C)', 'weather_metric')
        .addChoice('Imperial (˚F)', 'weather_imperial')
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
  ),

  async execute(interaction) {
    await interaction.deferReply()

    switch(interaction.options._group) {
      case 'weather':
        switch (interaction.options._subcommand) {
          case 'current':
            location = interaction.options.getString('location')
            switch (interaction.options.getString('unit')) {
              case 'weather_metric':
                unit = 'metric'
                symbol = '˚C'
                speed = 'm/s'
              case 'weather_imperial':
                unit = 'imperial'
                symbol = '˚F'
                speed = 'mi/h'
              default:
                unit = 'metric'
                symbol = '˚C'
                speed = 'm/s'
            }

            request = {
              method: 'GET',
              url: encodeURI(`https://api.openweathermap.org/data/2.5/weather`),
              params: {q: location, units: unit, appid: process.env.OPENWEATHERMAP}
            }

            await axios.request(request)
            .then(response => {
              const weather_embed = new MessageEmbed()
                .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
                .setTitle(`${response.data.name} - GMT${response.data.timezone > 0 ? '+' : '-'}${response.data.timezone/3600}`)
                .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
                .setDescription(`${response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1)}`)
                .addFields(
                  { name: 'Temperature', value: `${response.data.main.temp}${symbol}`, inline: true },
                  { name: 'Feels Like', value: `${response.data.main.feels_like}${symbol}`, inline: true },
                  { name: 'Min/Max Temperature', value: `${response.data.main.temp_min}${symbol}/${response.data.main.temp_max}${symbol}`, inline: true },
                  { name: 'Pressure', value: `${response.data.main.pressure}hPa`, inline: true },
                  { name: 'Humidity', value: `${response.data.main.humidity}%`, inline: true },
                  { name: 'Wind', value: `${response.data.wind.speed}${speed} ${response.data.wind.deg}˚`, inline: true }
                )
                .setThumbnail(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
                .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)
                .setTimestamp()

              interaction.editReply({ embeds: [weather_embed] })
            })
            .catch(error => {
              interaction.editReply({ content: `Error: City not found. Check your spelling?`, ephemeral: true })
            })

              
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