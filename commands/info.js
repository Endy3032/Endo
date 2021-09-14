const misc = require("../other/misc.js")
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const colors = misc.colors


module.exports = {
  data: new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get info about a user or the server')
  .addSubcommand(subcommand => subcommand
    .setName('user')
    .setDescription('Get info about a user')
    .addUserOption(option => option.setName('target').setDescription('The user to get info [mention / none]'))
  )
  .addSubcommand(subcommand => subcommand
    .setName('server')
    .setDescription('Get info about the server')
  ),
  
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'user':
        const user = interaction.options.getUser('target')
        const user_embed = new MessageEmbed()
        .setTitle('User Info')
        .setColor()
    
        user
        ? await interaction.reply(`Username: ${user.username}\nID: ${user.id}`)
        : await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`)
      
      case 'server':
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`)
    }

    const msg = await interaction.fetchReply()
    console.log(msg.content)
  }
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "`<subcommand ['user', 'server']>`",
  usage: '`/' + module.exports.data.name + ' <subcommand>`'
}