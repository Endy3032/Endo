const { ApplicationCommandOptionType } = require("discord.js")
const { colors } = require("../other/misc.js")

module.exports = {
  cmd: {
    name: "8ball",
    description: "Ask the 8-Ball anything",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "question",
        description: "The question to ask the 8-Ball [string]",
        required: true
      }
    ]
  },

  async execute(interaction) {
    responses = [
      yes = [
        "It's certain.",
        "It's decidedly so.",
        "Without a doubt.",
        "Yes, definitely.",
        "You may rely on it.",
        "As i see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to Yes.",
      ],
      neutral = [
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Can't predict now",
        "Concentrate and ask again",
      ],
      no = [
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful",
      ]
    ]

    question = interaction.options.getString("question")
    ch = Math.floor(Math.random() * 300)
    index = ch % 3 == 2 ? 2 : ch % 3 == 1 ? 1 : 0
    response = question.endsWith("​") ? responses[2][Math.floor(Math.random() * responses[2].length)]
      : question.endsWith(" ") ? responses[0][Math.floor(Math.random() * responses[0].length)]
        : responses[index][Math.floor(Math.random() * responses[index].length)]

    await interaction.reply({ embeds: [{
      title: "Magic 8-Ball",
      color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
      author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` },
      footer: { text: `${interaction.client.user.username}#${interaction.client.user.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png` },
      fields: [
        { name: ":question: Question", value: question, inline: false },
        { name: ":8ball: Answer", value: response, inline: false }
      ]
    }] })
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<expression [str]>",
//   usage: '`/' + module.exports.data.name + ' <expression>`'
// }