import { checkPermission, emojis, getSubcmd, getSubcmdGroup, getValue, respond } from "modules"
import { ApplicationCommandOptionTypes, BitwisePermissionFlags as Permissions, Bot, ChannelTypes, CreateApplicationCommand, CreateGuildChannel, Interaction } from "discordeno"

export const cmd: CreateApplicationCommand = {
  name: "manage",
  description: "Useful commands for server managing",
  defaultMemberPermissions: ["USE_SLASH_COMMANDS"],
  options: [
    {
      name: "create",
      description: "Create something in the server",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "text",
          description: "Create a text channel",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "name",
              description: "The channel's name [String 1~100 char]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "topic",
              description: "The channel's topic [String 0~1024 char]",
              type: ApplicationCommandOptionTypes.String,
              required: false,
            },
            {
              name: "below",
              description: "Put below this channel (Default Top) [Text/Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "slowmode",
              description: "The channel's slowmode cooldown (Text only) [Integer 0~21600]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 21600,
              required: false,
            },
            {
              name: "restricted",
              description: "The channel's NSFW restriction (Default False) [Boolean]",
              type: ApplicationCommandOptionTypes.Boolean,
              required: false,
            },
            {
              name: "reason",
              description: "The channel's creation reason [String 0~512 char]",
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
              description: "The category's name [String 1~100 char]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "below",
              description: "Put below this category (Default Top) [Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "reason",
              description: "The category's creation reason [String 0~512 char]",
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
              description: "The channel's name [String 1~100 char]",
              type: ApplicationCommandOptionTypes.String,
              required: true,
            },
            {
              name: "type",
              description: "The channel's type (Default Text)",
              type: ApplicationCommandOptionTypes.Integer,
              choices: [
                { name: "Voice", value: ChannelTypes.GuildVoice },
                { name: "Stage", value: ChannelTypes.GuildStageVoice },
              ],
              required: false,
            },
            {
              name: "below",
              description: "Put below this channel (Default Top) [Voice/Category]",
              type: ApplicationCommandOptionTypes.Channel,
              channelTypes: [ChannelTypes.GuildVoice, ChannelTypes.GuildText],
              required: false,
            },
            {
              name: "bitrate",
              description: "The channel's bitrate (Voice only) [Integer]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 384,
              required: false,
            },
            {
              name: "user-limit",
              description: "The channel's user limit (Voice only) [Integer]",
              type: ApplicationCommandOptionTypes.Integer,
              minValue: 0,
              maxValue: 99,
              required: false,
            },
            {
              name: "reason",
              description: "The channel's creation reason [String 0~512 char]",
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
              description: "Reason for deleting the channel [String 0~512 char]",
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
  if (!interaction.guildId) return respond(bot, interaction, {
    content: `${emojis.warn.shorthand} This command can only be used in servers.`,
  }, true)

  switch (getSubcmdGroup(interaction)) {
    case "create": {
      if (checkPermission(bot, interaction, Permissions.MANAGE_CHANNELS)) return
      const channelName = getValue(interaction, "name", "String") ?? "channel"
      const reason = getValue(interaction, "reason", "String") ?? `Created by ${interaction.user.username}#${interaction.user.discriminator}`
      let parentId: bigint | undefined = undefined, position: number | undefined = undefined
      const options: CreateGuildChannel = { name: channelName }

      switch (getSubcmd(interaction)) {
        case "text": {
          const topic = getValue(interaction, "topic", "String") ?? undefined
          const slowmode = getValue(interaction, "slowmode", "Integer") ?? 0
          const below = getValue(interaction, "below", "Channel")
          const nsfw = getValue(interaction, "nsfw", "Boolean") ?? false

          if (below?.type === ChannelTypes.GuildCategory) {
            parentId = below.id
            const channels = await bot.helpers.getChannels(interaction.guildId)
            position = channels.filter(channel => channel.parentId === parentId).array().reduce((a, b) => (a.position ?? 0) < (b.position ?? 0) ? a : b).position ?? 0
          } else if (below?.type === ChannelTypes.GuildText) {
            parentId = below.parentId ?? undefined
            position = (below.position ?? 0) + 1
          }

          Object.assign(options, {
            type: ChannelTypes.GuildText,
            rateLimitPerUser: slowmode,
            topic, nsfw, position, parentId,
          })
        }
      }

      await bot.helpers.createChannel(interaction.guildId, options, reason)
        .then(async channel => {
          await bot.helpers.swapChannels(channel.guildId, [{ id: channel.id.toString(), position: options.position ?? 0, parentId: parentId?.toString() }])
          await respond(bot, interaction, { content: `${emojis.success.shorthand} Created ${getSubcmd(interaction)} channel <#${channel.id}>` })
        })
        .catch(async err => console.botLog(err))
      break
    }
  }
}
