const { emojis, nordChalk } = require("../modules")
const { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  cmd: {
    name: "mod",
    description: "Useful commands for moderators",
    options: [
      {
        name: "create",
        description: "Create something in the server",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: "text-channel",
            description: "Create a text channel",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "name",
                description: "Name of the channel [String 1~100 char]",
                type: ApplicationCommandOptionType.String,
                required: true,
              },
              {
                name: "type",
                description: "The channel's type (Default Text)",
                type: ApplicationCommandOptionType.Integer,
                choices: [
                  { name: "Text", value: ChannelType.GuildText },
                  { name: "Category", value: ChannelType.GuildCategory },
                  { name: "Announcements/News", value: ChannelType.GuildNews },
                ],
                required: false,
              },
              {
                name: "topic",
                description: "The channel's topic [String 0~1024 char]",
                type: ApplicationCommandOptionType.String,
                required: false,
              },
              {
                name: "below",
                description: "Put below this channel (Default Top) [Text/Category/Voice]",
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText, ChannelType.GuildCategory],
                required: false,
              },
              {
                name: "slowmode",
                description: "The channel's slowmode cooldown (Text only) [Integer 0~21600]",
                type: ApplicationCommandOptionType.Integer,
                "min_value": 0,
                "max_value": 21600,
                required: false,
              },
              {
                name: "restricted",
                description: "The channel's NSFW restriction (Default False) [Boolean]",
                type: ApplicationCommandOptionType.Boolean,
                required: false,
              },
              {
                name: "reason",
                description: "Reason for creating the channel [String 0~512 char]",
                type: ApplicationCommandOptionType.String,
                required: false,
              }
            ]
          },
          {
            name: "voice-channel",
            description: "Create a voice channel",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "name",
                description: "Name of the channel [String 1~100 char]",
                type: ApplicationCommandOptionType.String,
                required: true,
              },
              {
                name: "type",
                description: "The channel's type (Default Text)",
                type: ApplicationCommandOptionType.Integer,
                choices: [
                  { name: "Voice", value: ChannelType.GuildVoice },
                  { name: "Stage", value: ChannelType.GuildStageVoice },
                ],
                required: false,
              },
              {
                name: "below",
                description: "Put below this channel (Default Top) [Text/Category/Voice]",
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText, ChannelType.GuildCategory, ChannelType.GuildVoice],
                required: false,
              },
              {
                name: "bitrate",
                description: "The channel's bitrate (Voice only) [Integer]",
                type: ApplicationCommandOptionType.Integer,
                "min_value": 0,
                "max_value": 384,
                required: false,
              },
              {
                name: "user-limit",
                description: "The channel's user limit (Voice only) [Integer]",
                type: ApplicationCommandOptionType.Integer,
                "min_value": 0,
                "max_value": 99,
                required: false,
              },
              {
                name: "reason",
                description: "Reason for creating the channel [String 0~512 char]",
                type: ApplicationCommandOptionType.String,
                required: false,
              }
            ]
          },
        ]
      },
      {
        name: "delete",
        description: "Delete something in the server",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: "channel",
            description: "Delete a channel",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "channel",
                description: "The channel to delete [Channel]",
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText, ChannelType.GuildCategory, ChannelType.GuildVoice],
                required: true,
              },
              {
                name: "reason",
                description: "Reason for deleting the channel [String 0~512 char]",
                type: ApplicationCommandOptionType.String,
                required: false,
              }
            ]
          }
        ]
      }
    ]
  },

  async execute(interaction) {
    switch (interaction.options._group) {
      case "create": {
        switch (interaction.options._subcommand) {
          case "text-channel": {
            const name = interaction.options.getString("name")
            const type = interaction.options.getInteger("type") || ChannelType.GuildText
            const topic = interaction.options.getString("topic") || null
            const slowmode = interaction.options.getInteger("slowmode") || 0
            const below = interaction.options.getChannel("below")
            const nsfw = interaction.options.getBoolean("nsfw") || false
            const reason = interaction.options.getString("reason") || `Created by ${interaction.user.tag}`

            switch (type) {
              case ChannelType.GuildText: {
                if (below?.isCategory()) {
                  parentID = below.id
                  try {position = below.children.cache.map(child => child.rawPosition).reduce((prev, curr) => {return (curr < prev ? curr : prev)})}
                  catch {position = 0}
                } else if (below?.isText()) {
                  parentID = below.parentId
                  position = below.rawPosition + 1
                } else {
                  parentID = position = null
                }
                options = { type: type, topic: topic, slowmode: slowmode, parent: parentID, nsfw: nsfw, reason: reason }
                break
              }

              // case ChannelType.GuildVoice: {
              //   parentID = below?.isCategory() ? below?.id : below?.parentId
              //   break
              // }
            }

            await interaction.guild.channels.create(name, options)
              .then(channel => {channel.setPosition(position); interaction.reply({ content: `${emojis.checkmark.shorthand} Created <#${channel.id}>`, ephemeral: true })})
              .catch(err => {interaction.reply({ content: `${emojis.crossmark.shorthand} Failed to create ${name}\n\`\`\`${err}\`\`\``, ephemeral: true }); console.botLog(err, "ERROR")})
            break
          }

          case "voice-channel": {
            const name = interaction.options.getString("name")
            const type = interaction.options.getInteger("type") || ChannelType.GuildText
            const bitrate = interaction.options.getInteger("bitrate") || 64
            const userLimit = interaction.options.getInteger("userLimit") || 0
            const below = interaction.options.getChannel("below")
            const reason = interaction.options.getString("reason") || `Created by ${interaction.user.tag}`

            switch (type) {
              case ChannelType.GuildText: {
                if (below?.isCategory()) {
                  parentID = below.id
                  console.log(below.children.cache.at(0))
                  position = below.children.cache.at(0).rawPosition + 1
                } else if (below?.isText()) {
                  parentID = below.parentID
                  position = below.rawPosition + 1
                }
                options = { type: type, topic: topic, slowmode: slowmode, position: position, parent: parentID, nsfw: nsfw, reason: reason }
                break
              }

              // case ChannelType.GuildVoice: {
              //   parentID = below?.isCategory() ? below?.id : below?.parentId
              //   break
              // }
            }

            await interaction.guild.channels.create(name, options)
            break
          }
        }
        break
      }

      case "delete": {
        switch (interaction.options._subcommand) {
          case "channel": {
            const channel = interaction.options.getChannel("channel")
            const reason = interaction.options.getString("reason") || `Deleted by ${interaction.user.tag}`

            await channel.delete(reason)
              .then(interaction.reply({ content: `${emojis.checkmark.shorthand} Deleted ${channel.name}`, ephemeral: true }))
              .catch(err => {interaction.reply({ content: `${emojis.crossmark.shorthand} Failed to delete ${channel.name}\n\`\`\`${err}\`\`\``, ephemeral: true }); console.botLog(err, "ERROR")})
            break
          }
        }
        break
      }
    }
  },
}
