import { emojis, MessageFlags, respond } from "modules"
import { ApplicationCommandOptionTypes, Bot, ChannelTypes, Interaction } from "discordeno"

export const cmd = {
  name: "mod",
  description: "Useful commands for moderators",
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
              channel_types: [ChannelTypes.GuildText, ChannelTypes.GuildCategory],
              required: false,
            },
            {
              name: "slowmode",
              description: "The channel's slowmode cooldown (Text only) [Integer 0~21600]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 21600,
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
              channel_types: [ChannelTypes.GuildCategory],
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
              channel_types: [ChannelTypes.GuildVoice, ChannelTypes.GuildText],
              required: false,
            },
            {
              name: "bitrate",
              description: "The channel's bitrate (Voice only) [Integer]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 384,
              required: false,
            },
            {
              name: "user-limit",
              description: "The channel's user limit (Voice only) [Integer]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 99,
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
              channel_types: [ChannelTypes.GuildText, ChannelTypes.GuildCategory, ChannelTypes.GuildVoice],
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
          min_value: 1,
          max_value: 100,
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
  if (!interaction.guildId) respond(bot, interaction, {
    content: `${emojis.warn.shorthand} This command can only be used in servers.`,
    flags: MessageFlags.Ephemeral
  })
}
