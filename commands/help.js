const fs = require("fs")
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const colors = ['5865F2', '57F287', 'FEE75C', 'EB459E', 'ED4245',
          'F47B67', 'F8A532', '48B784', '45DDCO', '99AAB5',
          '23272A', 'B7C2CE', '4187ED', '36393F', '3E70DD',
          '4P5D7F', '7289DA', '4E5D94', '9C84EF', 'F47FFF',
          'FFFFFF', '9684ec', '583694', '37393e', '5866ef',
          '3da560', 'f9a62b', 'f37668', '49ddc1', '4f5d7e',
          '09bOf2', '2f3136', 'ec4145', 'fe73f6', '000000']

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && !file.startsWith('help'));
var names = ['help']
var descs = ['Show the list of all available commands']
var args = ['none']
var usage = ['`/help`']

commandFiles.forEach(f => {
  let props = require(`./${f}`)
  names.push(props.help.name)
  descs.push(props.help.description)
  args.push(props.help.usage)
  usage.push(props.help.usage)
})

options = []
names.forEach((x, i) => {
  option = {
    label: x,
    description: descs[i],
    value: x + '_opt'
  }

  options.push(option)
})

module.exports = {
  data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show the list of all available commands'),
  
  async execute(interaction) {
    const help_main = new MessageEmbed()
      .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
      .setTitle('Help')
      .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
      .setDescription('`[arguments]` are optional arguments\n`<arguments>` are required arguments')
      .addFields({ name: 'Navigate the help menu', value: 'Use the dropdown menu to navigate the help menu!' })
      .setTimestamp()
      .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)

    const menu = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('menu')
          .setPlaceholder('Select a command')
          .addOptions(options)
      )

    await interaction.reply({ embeds: [help_main], components: [menu] })
	}
}
