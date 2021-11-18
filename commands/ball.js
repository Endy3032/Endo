const { colors } = require('../other/misc.js');
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
  data: new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Ask the 8-Ball anything')
  .addStringOption(option => option
    .setName('question')
    .setDescription('The question to ask the 8-Ball [string]')
    .setRequired(true)
  ),
  async execute(interaction) {
    responses = [
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
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Can't predict now",
      "Concentrate and ask again",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful"
    ]

    ball_embed = new MessageEmbed()
    .setTitle('Magic 8-Ball')
    .setColor(`#${colors[Math.floor(Math.random() * colors.length)]}`)
    .setAuthor(`${interaction.user.username}#${interaction.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
    .setFooter(`${interaction.client.user.username}#${interaction.client.user.discriminator}`, `https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.png`)
    .addFields(
      { name: ':question: Question', value: interaction.options.getString('question'), inline: false },
      { name: ':8ball: Answer', value: `${responses[Math.floor(Math.random() * responses.length)]}`, inline: false }
    )

    await interaction.reply({ embeds: [ball_embed] })
  }
}

module.exports.help = {
  name: module.exports.data.name,
  description: module.exports.data.description,
  arguments: "<expression [str]>",
  usage: '`/' + module.exports.data.name + ' <expression>`'
}