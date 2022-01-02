const { Permissions } = require('discord.js');

module.exports = {
  cmd: {
    name: "clear",
    description: "Clear messages in the channel",
    options: [
      {
        type: 4,
        name: "amount",
        description: "Amount of messages to clear [integer 1~100]",
        required: true,
        min_value: 1,
        max_value: 100
      }
    ]
  },

  async execute(interaction) {
    if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES && Permissions.FLAGS.MANAGE_SERVER)) {
      const amount = interaction.options.getInteger('amount')
      
      components = [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 4,
              "label": "Confirm",
              "emoji": "<:trash:927050313943380089>",
              "custom_id": `${amount <= 100 ? amount : 100}`
            }
          ]
        }
      ]

      amount <= 100
      ? interaction.reply({ content: `Press \`Confirm\` to delete \`${amount}\` messages or \`Dismiss message\` to cancel.`, components: components, ephemeral: true })
      : interaction.reply({ content: `It seems like you've somehow bypassed the 1-100 integer limit\n>100 clear is dangerous and won't be implemented (learning from past mistake)\n\nAre you sure you want to delete \`100\` messages?`, components: components, ephemeral: true })
    } else {
      await interaction.reply({ content: `You can't use the \`clear\` command without having "Manage Message" and "Manage Server" permissions.`, ephemeral: true })
      console.log('BUT FAILED MISERABLY HAHAHAHAHAHHAHAHWAIHUFAIUFAIWF')
    }
  },

  async btnpress(interaction) {
    channelID = interaction.message.channelId
    amount = interaction.customId
    
    interaction.channel.bulkDelete(amount)
    .then(console.log(`Cleared ${amount} messages`))
    .catch(console.error)
    
    await interaction.reply({ content: `Cleared \`${amount}\` messages. Feel free to dismiss the messages.`, ephemeral: true })
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<amount [int 1~100]>",
//   usage: '`/' + module.exports.data.name + ' <amount>`'
// }