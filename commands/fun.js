const misc = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { t } = require("../other/misc.js")
const colors = misc.colors


module.exports = {
  data: new SlashCommandBuilder()
  .setName('fun')
  .setDescription('Random fun commands')
  .addSubcommandGroup(group => group
    .setName('achievement')
    .setDescription('Make your own Minecraft achievement')
    .addSubcommand(subcommand => subcommand
      .setName('icon_pack1')
      .setDescription('Make your own Minecraft achievement [Icon Pack #1]')
      .addStringOption(option => option
        .setName('icon')
        .setDescription('The icon for the achievement')
        .addChoice('random', '0')
        .addChoice('grass_block', '1')
        .addChoice('diamond', '2')
        .addChoice('diamond_sword', '3')
        .addChoice('creeper', '4')
        .addChoice('pig', '5')
        .addChoice('tnt', '6')
        .addChoice('cookie', '7')
        .addChoice('heart', '8')
        .addChoice('bed', '9')
        .addChoice('cake', '10')
        .addChoice('sign', '11')
        .addChoice('rail', '12')
        .addChoice('crafting_table', '13')
        .addChoice('redstone', '14')
        .addChoice('fire', '15')
        .addChoice('cobweb', '16')
        .addChoice('chest', '17')
        .addChoice('furnace', '18')
        .addChoice('book', '19')
        .addChoice('stone', '20')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('The content of the achievement')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('title')
        .setDescription('The title of the achievement')
        .setRequired(false)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('icon_pack2')
      .setDescription('Make your own Minecraft achievement [Icon Pack #2]')
      .addStringOption(option => option
        .setName('icon')
        .setDescription('The icon for the achievement')
        .addChoice('random', '0')
        .addChoice('planks', '21')
        .addChoice('iron_ingot', '22')
        .addChoice('gold_ingot', '23')
        .addChoice('oak_door', '24')
        .addChoice('iron_door', '25')
        .addChoice('diamond_armor', '26')
        .addChoice('flint_and_steel', '27')
        .addChoice('potion', '28')
        .addChoice('splash', '29')
        .addChoice('spawn_egg', '30')
        .addChoice('coal_block', '31')
        .addChoice('iron_sword', '32')
        .addChoice('bow', '33')
        .addChoice('arrow', '34')
        .addChoice('iron_armor', '35')
        .addChoice('bucket', '36')
        .addChoice('water', '37')
        .addChoice('lava', '38')
        .addChoice('milk', '39')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('content')
        .setDescription('The content of the achievement')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('title')
        .setDescription('The title of the achievement')
        .setRequired(false)
      )
    )
  ),

  async execute(interaction) {
    switch(interaction.options._group) {
      case 'achievement': {
        default_title = ['Achievement Get!', 'Advancement Made!', 'Goal Reached!', 'Challenge Complete!']

        interaction.options.getString('icon') !== '0' ? icon = interaction.options.getString('icon') : icon = Math.floor(Math.random() * 39)
        content = interaction.options.getString('content')
        interaction.options.getString('title') !== null ? title = interaction.options.getString('title') : title = default_title[Math.floor(Math.random() * default_title.length)]
        
        achievement_embed = new MessageEmbed()
        .setImage(`https://minecraftskinstealer.com/achievement/${icon}/${encodeURI(title)}/${encodeURI(content)}`)
        .setColor('#2f3136')

        await interaction.reply({embeds: [achievement_embed]})
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