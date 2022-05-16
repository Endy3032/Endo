import { getSubcmdGroup, getSubcmd, getValue, toTimestamp, maxRes, pickFromArray, colors, imageURL } from "Modules"
import { ApplicationCommandOptionTypes, Bot, Embed, Interaction, InteractionResponseTypes, Member, User } from "discordeno"

export const cmd = {
  name: "utils",
  description: "Random utilities for you to use!",
  options: [
    {
      name: "color",
      description: "Return a preview of the color",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "random",
          description: "Generate a random color",
          type: ApplicationCommandOptionTypes.SubCommand
        },
        {
          name: "rgb",
          description: "Input RGB color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "red",
              description: "The red value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "green",
              description: "The green value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            },
            {
              name: "blue",
              description: "The blue value of the RGB color [integer 0~255]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 255,
              required: true
            }
          ]
        },
        {
          name: "decimal",
          description: "Input decimal color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The value of the color [integer 0~16777215]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 0,
            "max_value": 16777215,
            required: true
          }]
        },
        {
          name: "hex",
          description: "Input Hex color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "value",
            description: "The hex value of the color [string]",
            type: ApplicationCommandOptionTypes.String,
            required: true
          }]
        },
        {
          name: "hsl",
          description: "Input HSL color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The lightness value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "hsv",
          description: "Input HSV color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "hue",
              description: "The hue value of the HSV color [integer 0~360]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 360,
              required: true
            },
            {
              name: "saturation",
              description: "The saturation value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "value",
              description: "The value value of the HSV color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
        {
          name: "cmyk",
          description: "Input CMYK color type",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "cyan",
              description: "The cyan value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "magenta",
              description: "The magenta value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "yellow",
              description: "The yellow value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            },
            {
              name: "key",
              description: "The key value of the CMYK color [integer 0~100]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              "max_value": 100,
              required: true
            }
          ]
        },
      ]
    },
    {
      name: "calculate",
      description: "Calculate an expression and return the result",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [{
        name: "expression",
        description: "The expression to calculate [string]",
        type: ApplicationCommandOptionTypes.String,
        required: true
      }]
    },
    {
      name: "info",
      description: "Get info about anything in the server",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "server",
          description: "Get info about the server",
          type: ApplicationCommandOptionTypes.SubCommand
        },
        {
          name: "user",
          description: "Get info about a user",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "target",
              description: "The user to get info [mention / none]",
              type: ApplicationCommandOptionTypes.User
            }
          ]
        }
      ]
    },
    {
      name: "ping",
      description: "Get the bot's latency info",
      type: ApplicationCommandOptionTypes.SubCommand
    },
    {
      name: "poll",
      description: "Make a poll!",
      type: ApplicationCommandOptionTypes.SubCommand
    },
    {
      name: "random",
      description: "Roll a dice, flip a coin, do anything!",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "coin",
          description: "Flip a coin",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "amount",
            description: "The amount of coins to flip [integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "dice",
          description: "Roll dices",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [{
            name: "amount",
            description: "The amount of dice to roll [integer 1~10]",
            type: ApplicationCommandOptionTypes.Integer,
            "min_value": 1,
            "max_value": 10,
            required: true
          }]
        },
        {
          name: "number",
          description: "Generate random numbers",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "amount",
              description: "The amount of numbers to generate [integer 1~10]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 1,
              "max_value": 10,
              required: true
            },
            {
              name: "min",
              description: "The minimum limit for the numbers [integer]",
              type: ApplicationCommandOptionTypes.Integer,
              "min_value": 0,
              required: false
            },
            {
              name: "max",
              description: "The maximum limit for the numbers [integer]",
              "max_value": 20000,
              type: ApplicationCommandOptionTypes.Integer,
            }
          ]
        },
      ]
    },
    {
      name: "timestamp",
      description: "Get the current timestamp or from a provided date",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "year",
          description: "The timestamp's year [Integer -271821~275760]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": -271821,
          "max_value": 275760,
          required: true
        },
        {
          name: "month",
          description: "The timestamp's month [Integer 1~12]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 1,
          "max_value": 12,
          required: false
        },
        {
          name: "day",
          description: "The timestamp's day [Integer 1~31]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 1,
          "max_value": 31,
          required: false
        },
        {
          name: "hour",
          description: "The timestamp's hours [Integer 0~23]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 23,
          required: false
        },
        {
          name: "minute",
          description: "The timestamp's minutes [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "second",
          description: "The timestamp's seconds [Integer 0~59]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 59,
          required: false
        },
        {
          name: "millisecond",
          description: "The timestamp's milliseconds [Integer 0~999]",
          type: ApplicationCommandOptionTypes.Integer,
          "min_value": 0,
          "max_value": 999,
          required: false
        },
      ]
    }
  ]
}

export const execute = async (bot: Bot, interaction: Interaction) => {
  switch (getSubcmdGroup(interaction)) {
    case "info": {
      switch (getSubcmd(interaction)) {
        case "user": {
          const target = getValue(interaction, "target", ApplicationCommandOptionTypes.User) as { user: User, member: Member } || { user: interaction.user, member: interaction.member }
          const { user } = target
          const createdAt = toTimestamp(user.id)
          const embed: Embed = {
            color: pickFromArray(colors),
            fields: [
              { name: "Name", value: user.username, inline: true },
              { name: "Tag", value: user.discriminator, inline: true },
              { name: "ID", value: user.id.toString(), inline: true },
              { name: "Creation Date", value: `<t:${createdAt}:f>\n<t:${createdAt}:R>` }
            ],
            // image: { url: maxRes(imageURL(user.id, user.bannerURL, "banners") as string) },
            thumbnail: { url: maxRes(imageURL(user.id, user.avatar, "avatars") || "") },
            author: { name: "User Info" },
          }
          console.log(user)
          await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              embeds: [embed]
            }
          })
        }
      }
    }
  }
}