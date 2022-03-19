const { emojis, nordChalk } = require("../modules")
const { ApplicationCommandOptionType, ButtonStyle, ComponentType, PermissionFlagsBits } = require("discord.js")

module.exports = {
  cmd: {
    name: "clear",
    description: "Clear messages",
    options: [
      {
        name: "amount",
        description: "Amount of messages to clear [integer 1~100]",
        type: ApplicationCommandOptionType.Integer,
        min_value: 1,
        max_value: 100,
        required: true,
      },
      {
        name: "option",
        description: "Option to filter out cleared messages",
        type: ApplicationCommandOptionType.String,
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
        description: "The user to clear messages from",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ]
  },

  async execute(interaction) {
    if (!interaction.guild) return await interaction.reply({ content: `${emojis.crossmark.shorthand} This command can only be used in a server`, ephemeral: true })

    const manageMsgs = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    const manageGuild = interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)

    if (!manageMsgs && !manageGuild) {
      console.botLog(`${nordChalk.yellow("Permissions")} [ ${manageMsgs ? nordChalk.green("Manage Messages") : nordChalk.red("Manage Messages")} | ${manageGuild ? nordChalk.green("Manage Server") : nordChalk.red("Manage Server")} ]`, "WARN")
      return await interaction.reply({ content: `Permissions needed to use the \`clear\` command:\n${manageMsgs ? emojis.checkmark.shorthand : emojis.crossmark.shorthand} \`Manage Messages\`\n${manageGuild ? emojis.checkmark.shorthand : emojis.crossmark.shorthand} \`Manage Server\``, ephemeral: true })
    }

    const amount = interaction.options.getInteger("amount")
    const option = interaction.options.getString("option")
    const user = interaction.options.getUser("user")
    content = `Press \`Confirm\` to delete \`${amount > 100 ? 100 : amount}\` messages.`
    if (option && user) {
      content += `\n**Option & User:** ${option}, ${user}`
    } else {
      content += option ? `\n**Option:** ${option}` : user ? `\n**User:** ${user}` : ""
    }

    interaction.reply({ content: content, components: [{
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          style: ButtonStyle.Danger,
          label: "Confirm",
          emoji: {
            name: "trash",
            id: emojis.trash.id
          },
          custom_id: `${amount <= 100 ? amount : 100}_${option || "none"}_${user?.id || "none"}`
        }
      ]
    }], ephemeral: true })
  },

  async button(interaction) {
    customID = interaction.customId
    const [amount, option, user] = customID.split("_")
    await interaction.deferUpdate()

    if (option == "none" && user == "none") {
      await interaction.channel.bulkDelete(amount, true)
        .then(console.botLog(`Cleared ${amount} messages`))
        .catch(console.error)
    } else {
      messages = await interaction.channel.messages.fetch({ limit: amount })
      if (option != "none") {
        option == "bots"
          ? clearList = messages.filter(message => message.author.bot)
          : clearList = messages.filter(message => !message.author.bot)
      } else if (user != "none") {
        clearList = messages.filter(message => message.author.id == user)
      }

      await interaction.channel.bulkDelete(clearList)
    }
  }
}
