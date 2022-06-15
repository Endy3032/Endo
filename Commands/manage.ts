import { checkPermission, defer, emojis, getSubcmd, getSubcmdGroup, getValue, respond } from "modules"
import { ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ChannelTypes, CreateApplicationCommand, CreateGuildChannel, Interaction, ModifyGuildChannelPositions } from "discordeno"

export const cmd: CreateApplicationCommand = {
  name: "manage",
  description: "Useful commands for server managing",
  defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
  options: [
    {
      name: "check",
      description: "Check some server informations",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "position",
          description: "Check the channels' position",
          type: ApplicationCommandOptionTypes.SubCommand,
        }
      ]
    },
    {
      name: "create",
      description: "Create something for the server",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "text",
          description: "Create a text channel",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "name",
              description: "The channel's name [Length 1~100]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "topic",
              description: "The channel's topic [Length 0~1024]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            },
            {
              name: "below",
              description: "Where to put the channel below (Default Top) [Text/Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "slowmode",
              description: "Slowmode cooldown in seconds [Integer 0~21600]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 21600,
              required: false,
            },
            {
              name: "restricted",
              description: "If the channel is NSFW (Default False) [Boolean]",
              type: ApplicationCommandOptionTypes.Boolean,
              required: false,
            },
            {
              name: "reason",
              description: "Reason for creation [Length 0~512]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            }
          ]
        },
        {
          name: "category",
          description: "Create a category",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "name",
              description: "The category's name [Length 1~100]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "below",
              description: "Where to put the category below (Default Top) [Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "reason",
              description: "Reason for creation [Length 0~512]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            }
          ]
        },
        {
          name: "voice",
          description: "Create a voice channel",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "name",
              description: "The channel's name [Length 1~100]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "type",
              description: "The channel's type (Default Voice)",
              type: ApplicationCommandOptionTypes.Integer,
              choices: [
                { name: "Voice", value: ChannelTypes.GuildVoice },
                { name: "Stage", value: ChannelTypes.GuildStageVoice },
              ],
              required: false,
            },
            {
              name: "below",
              description: "Where to put the channel below (Default Top) [Voice/Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildVoice, ChannelTypes.GuildStageVoice, ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "bitrate",
              description: "Audio bitrate in Kbps [Integer 0~384]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 8,
              maxValue: 384,
              required: false,
            },
            {
              name: "user-limit",
              description: "Maximum amount of user able to join [Integer 0~99]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 99,
              required: false,
            },
            {
              name: "reason",
              description: "Reason for creation [Length 0~512]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            }
          ]
        },
      ]
    },
    {
      name: "delete",
      description: "Delete something in the server",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "channel",
          description: "Delete a channel",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "channel",
              description: "The channel to delete [Channel]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildCategory, ChannelTypes.GuildVoice],
              required: true,
            },
            {
              name: "reason",
              description: "Reason for deleting the channel [Length 0~512]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            }
          ]
        }
      ]
    },
    {
      name: "purge",
      description: "Purge messages",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "amount",
          description: "Amount of messages to purge [Integer 1~100]",
          type: ApplicationCommandOptionTypes.Integer,
          minValue: 1,
          maxValue: 100,
          required: true,
        },
        {
          name: "option",
          description: "Option to filter messages",
          type: ApplicationCommandOptionTypes.String,
          choices: [
            { name: "Bots Only", value: "bots" },
            { name: "Users Only", value: "users" },
            // { name: "Texts Only", value: "texts" },
            // { name: "Mentions Only", value: "mentions" },
            // { name: "Links Only", value: "links" },
            // { name: "Embeds Only", value: "embeds" },
            // { name: "Attachments Only", value: "attachments" },
          ],
          required: false,
        },
        {
          name: "user",
          description: "Specific user to purge messages",
          type: ApplicationCommandOptionTypes.User,
          required: false,
        },
      ]
    }
  ]
}

export async function execute(bot: Bot, interaction: Interaction) {
  if (!interaction.guildId) return respond(bot, interaction, `${emojis.warn.shorthand} This command can only be used in servers.`, true)

  switch(getSubcmdGroup(interaction)) {
    case "check": {
      switch(getSubcmd(interaction)) {
        case "position": {
          const channels = (await bot.helpers.getChannels(interaction.guildId)).array().sort((a, b) => (a.position ?? 0) > (b.position ?? 1) ? 1 : -1)

          await respond(bot, interaction, {
            embeds: [{
              title: "Channels Position",
              fields: [
                { name: "Categories", value: `${channels.filter(channel => channel.type == ChannelTypes.GuildCategory).map(channel => `<#${channel.id}> ${channel.position}`).join("\n")}`, inline: false },
                { name: "Text Channels", value: `${channels.filter(channel => channel.type == ChannelTypes.GuildText).map(channel => `<#${channel.id}> ${channel.position}`).join("\n")}`, inline: false },
                { name: "Voice Channels", value: `${channels.filter(channel => channel.type == ChannelTypes.GuildVoice).map(channel => `<#${channel.id}> ${channel.position}`).join("\n")}`, inline: false },
              ]
            }]
          })
          break
        }
      }
      break
    }

    case "create": {
      await defer(bot, interaction, { content: "Creating channel..." }, true)
      if (checkPermission(bot, interaction, Permissions.MANAGE_CHANNELS)) return
      const channelName = getValue(interaction, "name", "String") ?? "channel"
      const reason = getValue(interaction, "reason", "String") ?? `Created by ${interaction.user.username}#${interaction.user.discriminator}`
      let parentId: bigint | undefined = undefined, position = 0
      const options: CreateGuildChannel = { name: channelName }
      const channels = await bot.helpers.getChannels(interaction.guildId)

      switch(getSubcmd(interaction)) {
        case "text": {
          const below = getValue(interaction, "below", "Channel")
          const nsfw = getValue(interaction, "nsfw", "Boolean") ?? false
          const slowmode = getValue(interaction, "slowmode", "Integer") ?? 0
          const topic = getValue(interaction, "topic", "String") ?? undefined

          if (below?.type === ChannelTypes.GuildCategory) {
            parentId = below.id
            position = channels.filter(channel => channel.parentId === parentId).array()
              .reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 0
          } else if (below?.type === ChannelTypes.GuildText) {
            const channel = await bot.helpers.getChannel(below.id)
            parentId = channel?.parentId ?? undefined
            position = channel?.position ? channel.position + 1 : 0
          }

          Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, {
            type: ChannelTypes.GuildText,
            rateLimitPerUser: slowmode,
            topic, nsfw, position, parentId
          })
          break
        }

        case "voice": {
          const below = getValue(interaction, "below", "Channel")
          const bitrate = getValue(interaction, "bitrate", "Integer") ?? 32000
          const userLimit = getValue(interaction, "user-limit", "Integer") ?? 0
          const type = getValue(interaction, "type", "Integer") ?? ChannelTypes.GuildVoice
          const reason = getValue(interaction, "reason", "String") ?? `Created by ${interaction.user.username}#${interaction.user.discriminator}`

          if (below?.type === ChannelTypes.GuildCategory) {
            parentId = below.id
            position = channels.filter(channel => channel.parentId === parentId).array()
              .reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 0
          } else if (below?.type === ChannelTypes.GuildVoice) {
            const channel = await bot.helpers.getChannel(below.id)
            parentId = channel?.parentId ?? undefined
            position = channel?.position ? channel.position + 1 : 0
          }

          Object.assign<CreateGuildChannel, Partial<CreateGuildChannel>>(options, {
            type, bitrate, userLimit, position, parentId
          })
          break
        }
      }

      await bot.helpers.createChannel(interaction.guildId, options, reason)
        .then(async channel => {
          await bot.helpers.editInteractionResponse(interaction.token, { content: `${emojis.success.shorthand} Created ${getSubcmd(interaction)} channel <#${channel.id}>` })

          const swapOptions: ModifyGuildChannelPositions[] = channels.filter(channel => channel.type == options.type)
            .map(channel => { return { id: channel.id.toString(), position: (channel.position ?? 0) >= (options.position ?? 0) ? (channel.position ?? 0) + 1 : channel.position } })

          swapOptions.push({ id: channel.id.toString(), position: options.position ?? 0 })
          await bot.helpers.swapChannels(channel.guildId, swapOptions)
        })
        .catch(async err => console.botLog(err))
      break
    }
  }
}
