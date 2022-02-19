const { ApplicationCommandOptionType, ButtonStyle, ComponentType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  cmd: {
    name: "clear",
    description: "Clear messages in the channel",
    options: [
      {
        type: ApplicationCommandOptionType.Integer,
        name: "amount",
        description: "Amount of messages to clear [integer 1~100]",
        required: true,
        min_value: 1,
        max_value: 100
      }
    ]
  },

  async execute(interaction) {
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages && PermissionFlagsBits.ManageGuild) || !interaction.guild) {
      const amount = interaction.options.getInteger("amount")
      
      components = [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Danger,
              label: "Confirm",
              emoji: {
                name: "trash",
                id: "927050313943380089"
              },
              custom_id: `${amount <= 100 ? amount : 100}`
            }
          ]
        }
      ]

      amount <= 100
        ? interaction.reply({ content: `Press \`Confirm\` to delete \`${amount}\` messages or \`Dismiss message\` to cancel.`, components: components, ephemeral: true })
        : interaction.reply({ content: "It seems like you've somehow bypassed the 1-100 integer limit\n>100 clear is dangerous and won't be implemented (learning from past mistake)\n\nAre you sure you want to delete `100` messages?", components: components, ephemeral: true })
    } else {
      await interaction.reply({ content: "You can't use the `clear` command without having \"Manage Message\" and \"Manage Server\" permissions.", ephemeral: true })
      console.log("BUT FAILED MISERABLY HAHAHAHAHAHHAHAHWAIHUFAIUFAIWF")
    }
  },

  async button(interaction) {
    amount = interaction.customId
    
    interaction.channel.bulkDelete(amount)
      .then(console.log(`Cleared ${amount} messages`))
      .then(await interaction.deferUpdate())
      .catch(console.error)
  }
}

// module.exports.help = {
//   name: module.exports.data.name,
//   description: module.exports.data.description,
//   arguments: "<amount [int 1~100]>",
//   usage: '`/' + module.exports.data.name + ' <amount>`'
// }