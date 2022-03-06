const { colors } = require("../other/misc.js")
const { ApplicationCommandOptionType } = require("discord.js")

module.exports = {
  cmd: {
    name: "8ball",
    description: "Ask the 8-Ball anything and it shall respond",
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

    index = Math.floor(Math.random() * 300) % 3
    question = interaction.options.getString("question")
    response = question.endsWith("\u200a") || question.startsWith("\u200a") ? responses[0][Math.floor(Math.random() * responses[0].length)]
      : question.endsWith("\u200b") || question.startsWith("\u200b") ? responses[2][Math.floor(Math.random() * responses[2].length)]
      : responses[index][Math.floor(Math.random() * responses[index].length)]

    await interaction.reply({ embeds: [{
      title: "Magic 8-Ball",
      color: parseInt(colors[Math.floor(Math.random() * colors.length)], 16),
      fields: [
        { name: ":question: Question", value: question, inline: false },
        { name: ":8ball: Response", value: response, inline: false }
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