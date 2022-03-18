const { colors, random } = require("../modules")
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
    response = question.endsWith("\u200a") || question.startsWith("\u200a") ? random.pickFromArray(responses[0])
      : question.endsWith("\u200b") || question.startsWith("\u200b") ? random.pickFromArray(responses[2])
      : responses[index][random.pickFromArray(responses[index])]

    await interaction.reply({ embeds: [{
      title: "Magic 8-Ball",
      color: parseInt(random.pickFromArray(colors), 16),
      fields: [
        { name: ":question: Question", value: question, inline: false },
        { name: ":8ball: Response", value: response, inline: false }
      ]
    }] })
  }
}
