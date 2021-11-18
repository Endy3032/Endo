const { colors } = require("../other/misc.js")
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')


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
      case 'user': {
        interaction.options.getUser('target') ? user = interaction.options.getUser('target') : user = interaction.user
        
        const user_embed = new MessageEmbed()
        .setTitle(`User Info`)
        .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
        .addFields(
          { name: 'Name', value: `${user.username}`, inline: true },
          { name: 'Tag', value: `${user.discriminator}`, inline: true },
          { name: 'ID', value: `${user.id}`, inline: false },
        )
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`)

    
        await interaction.reply({ embeds: [user_embed] })
        break
      }
      
      case 'server': {
        guild = interaction.guild

        const server_embed = new MessageEmbed()
        .setTitle(`Server Info - ${guild.name} [${guild.id}]`)
        .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
        .setDescription(guild.description !== null ? `Server Description: ${guild.description}` : 'Server Description: none')
        .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
        .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)
        .addFields(
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Verification Level', value: guild.verificationLevel.charAt(0).toUpperCase() + guild.verificationLevel.slice(1).toLowerCase(), inline: true },
          { name: 'NSFW Level', value: guild.nsfwLevel.charAt(0).toUpperCase() + guild.nsfwLevel.slice(1).toLowerCase(), inline: true },
          { name: 'Vanity URL', value: guild.vanityURLCode !== null ? guild.vanityURLCode : 'None', inline: true },
          { name: 'AFK Timeout', value: `${guild.afkTimeout / 60} Minutes`, inline: true },
          { name: 'AFK Channel', value: guild.afkChannelId !== null ? guild.afkChannelId : 'None', inline: true }
        )
        .setThumbnail(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`)
        guild.banner !== null ? server_embed.setImage(`https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.jpg?size=4096`) : null

        await interaction.reply({ embeds: [server_embed] })
        break
      }
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