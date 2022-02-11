const { ApplicationCommandOptionType, ChannelType } = require("discord.js")
const { colors } = require("../other/misc.js")

module.exports = {
  cmd: {
    name: "info",
    description: "Get info about anything in the server",
    options: [
      {
        name: "server",
        description: "Get info about the server",
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: "user",
        description: "Get info about a user",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "target",
            description: "The user to get info [mention / none]",
            type: ApplicationCommandOptionType.User
          }
        ]
      },
      {
        name: "role",
        description: "Get info about a role",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "target",
            description: "The role to get info about [role]",
            type: ApplicationCommandOptionType.Role
          }
        ]
      },
      {
        name: "text_channel",
        description: "Get info about a text channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "target",
            description: "The text channel to get info about [text_channel]",
            channel_types: [ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildStore, ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread],
            type: ApplicationCommandOptionType.Channel
          }
        ]
      },
      {
        name: "voice_channel",
        description: "Get info about a voice channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "target",
            description: "The voice channel to get info about [voice_channel]",
            channel_types: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
            type: ApplicationCommandOptionType.Channel
          }
        ]
      },
      {
        name: "category",
        description: "Get info about a category",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "target",
            description: "The category to get info about [category]",
            channel_types: [ChannelType.GuildCategory],
            type: ApplicationCommandOptionType.Channel
          }
        ]
      }
    ]
  },
  
  async execute(interaction) {
    switch (interaction.options.getSubcommand()) {
    case "server": {
      guild = interaction.guild

      serverEmbed = {
        title: `Server Info - ${guild.name} [${guild.id}]`,
        color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
        description: guild.description ? `Server Description: ${guild.description}` : "Server Description: None",
        author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` },
        footer: { text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` },
        fields: [
          { name: "Owner", value: `<@${guild.ownerId}>`, inline: true },
          { name: "Verification Level", value: guild.verificationLevel.charAt(0).toUpperCase() + guild.verificationLevel.slice(1).toLowerCase(), inline: true },
          { name: "NSFW Level", value: guild.nsfwLevel.charAt(0).toUpperCase() + guild.nsfwLevel.slice(1).toLowerCase(), inline: true },
          { name: "Vanity URL", value: guild.vanityURLCode !== null ? guild.vanityURLCode : "None", inline: true },
          { name: "AFK Timeout", value: `${guild.afkTimeout / 60} Minutes`, inline: true },
          { name: "AFK Channel", value: guild.afkChannelId !== null ? guild.afkChannelId : "None", inline: true },
          { name: "Members", value: `${guild.memberCount}`, inline: true },
          { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
          { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
          { name: "Creation Date", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F> (<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`, inline: true }
        ],
        thumbnail: { url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=4096` },
        image: guild.banner !== null ? { url: `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.jpg?size=4096` } : null
      }

      await interaction.reply({ embeds: [serverEmbed] })
      break
    }

    case "user": {
      user = interaction.options.getUser("target") ? interaction.options.getUser("target") : interaction.user

      await interaction.reply({ embeds: [{
        title: "User Info",
        color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
        fields: [
          { name: "Name", value: `${user.username}`, inline: true },
          { name: "Tag", value: `${user.discriminator}`, inline: true },
          { name: "ID", value: `${user.id}`, inline: false },
        ],
        thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096` },
      }] })
      break
    }

    case "category": {
      interaction.options.getChannel("target") ? channel = interaction.options.getChannel("target") : channel = interaction.channel
      console.log(channel)
      await interaction.reply({ content: `${channel}`, ephemeral: true })
    }
    }

    // try {
    //   const msg = await interaction.fetchReply()
    //   console.log(msg.content)
    // } catch {
    //   console.log("Unable to fetch response [ephemeral]")
    // }
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "`<subcommand ['user', 'server']>`",
//   usage: '`/' + module.exports.data.name + ' <subcommand>`'
// }