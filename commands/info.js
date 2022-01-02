const { colors } = require("../other/misc.js")
const { MessageEmbed } = require('discord.js')

module.exports = {
  cmd: {
    name: "info",
    description: "Get info about anything in the server",
    options: [
      {
        name: "server",
        description: "Get info about the server",
        type: 1
      },
      {
        name: "user",
        description: "Get info about a user",
        type: 1,
        options: [
          {
            name: "target",
            description: "The user to get info [mention / none]",
            type: 6
          }
        ]
      },
      {
        name: "role",
        description: "Get info about a role",
        type: 1,
        options: [
          {
            name: "target",
            description: "The role to get info about [role]",
            type: 8
          }
        ]
      },
      {
        name: "text_channel",
        description: "Get info about a text_channel",
        type: 1,
        options: [
          {
            name: "target",
            description: "The role to get info about [role]",
            channel_types: [0, 5, 6, 10, 11, 12],
            type: 7
          }
        ]
      },
      {
        name: "voice_channel",
        description: "Get info about a voice channel",
        type: 1,
        options: [
          {
            name: "target",
            description: "The role to get info about [role]",
            channel_types: [2, 13],
            type: 7
          }
        ]
      },
      {
        name: "category",
        description: "Get info about a category",
        type: 1,
        options: [
          {
            name: "target",
            description: "The role to get info about [role]",
            channel_types: [4],
            type: 7
          }
        ]
      }
    ]
  },
  
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'server': {
        guild = interaction.guild

        const serverEmbed = new MessageEmbed()
        .setTitle(`Server Info - ${guild.name} [${guild.id}]`)
        .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
        .setDescription(guild.description ? `Server Description: ${guild.description}` : 'Server Description: None')
        .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` })
        .setFooter({ text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` })
        .addFields(
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Verification Level', value: guild.verificationLevel.charAt(0).toUpperCase() + guild.verificationLevel.slice(1).toLowerCase(), inline: true },
          { name: 'NSFW Level', value: guild.nsfwLevel.charAt(0).toUpperCase() + guild.nsfwLevel.slice(1).toLowerCase(), inline: true },
          { name: 'Vanity URL', value: guild.vanityURLCode !== null ? guild.vanityURLCode : 'None', inline: true },
          { name: 'AFK Timeout', value: `${guild.afkTimeout / 60} Minutes`, inline: true },
          { name: 'AFK Channel', value: guild.afkChannelId !== null ? guild.afkChannelId : 'None', inline: true },
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Creation Date', value: `<t:${Math.floor(guild.createdTimestamp/1000)}:F> (<t:${Math.floor(guild.createdTimestamp/1000)}:R>)`, inline: true }
        )
        .setThumbnail(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096`)
        guild.banner !== null ? serverEmbed.setImage(`https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.jpg?size=4096`) : null

        await interaction.reply({ embeds: [serverEmbed] })
        break
      }

      case 'user': {
        interaction.options.getUser('target') ? user = interaction.options.getUser('target') : user = interaction.user
        
        const userEmbed = new MessageEmbed()
        .setTitle(`User Info`)
        .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
        .addFields(
          { name: 'Name', value: `${user.username}`, inline: true },
          { name: 'Tag', value: `${user.discriminator}`, inline: true },
          { name: 'ID', value: `${user.id}`, inline: false },
        )
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`)

    
        await interaction.reply({ embeds: [userEmbed] })
        break
      }

      case 'category': {
        interaction.options.getChannel('target') ? channel = interaction.options.getChannel('target') : channel = interaction.channel
        console.log(channel)
        await interaction.reply({content: `${channel}`, ephemeral: true})
      }
    }

    try {
      const msg = await interaction.fetchReply()
      console.log(msg.content)
    } catch {
      console.log('Unable to fetch response [ephemeral]')
    }
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "`<subcommand ['user', 'server']>`",
//   usage: '`/' + module.exports.data.name + ' <subcommand>`'
// }