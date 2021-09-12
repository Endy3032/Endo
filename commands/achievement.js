const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
  data: new SlashCommandBuilder()
  .setName('achievement')
  .setDescription('Send a custom Minecraft achievement!')
  .addSubcommand(subcommand => subcommand
    .setName('icon1')
    .setDescription('Send a custom Minecraft achievement with icons! [Icon pack 1]')
    .addStringOption(option => option
      .setName('icon')
      .setDescription('The icon for the achievement')
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
      .addChoice('random', '0')
    )
  )
  .addSubcommand(subcommand => subcommand
    .setName('icon2')
    .setDescription('Send a custom Minecraft achievement with icons! [Icon pack 2]')
    .addStringOption(option => option
      .setName('icon')
      .setDescription('The icon for the achievement')
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
      .addChoice('random', '0')
    )
  ),

  async execute(interaction) {
    symbols = ['π']
    symvalue = ['3.14']

    var expression = interaction.options.getString('expression')
    var expression_2 = expression
    symbols.forEach((value, i) => {
      expression_2 = expression_2.replace(value, symvalue[i])
    })

    await interaction.reply({ content: `${expression} = ${Math.exec(expression_2)}` })
    console.log(expression + ' = ' + Math.exec(expression_2))
  }
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "<expression [str]>",
  usage: '`/' + module.exports.data.name + ' <expression>`'
}