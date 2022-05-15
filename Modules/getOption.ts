import { ApplicationCommandOptionTypes, Interaction } from "discordeno"

export const getSubcmd = (interaction: Interaction) => {
  if (interaction.data?.options === undefined) return null

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup)
    return interaction.data.options?.[0].options?.[0].name

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommand)
    return interaction.data.options[0].name
}

export const getSubcmdGroup = (interaction: Interaction) => {
  if (interaction.data?.options === undefined) return null

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup)
    return interaction.data.options[0].name
}

const getOptions = (interaction: Interaction) => {
  return interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup
    ? interaction.data?.options?.[0].options?.[0].options
    : interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand
      ? interaction.data?.options[0].options
      : interaction.data?.options
}

const resolvedOptionTypeToKey = {
  [ApplicationCommandOptionTypes.Attachment]: "attachments",
  [ApplicationCommandOptionTypes.Channel]: "channels",
  [ApplicationCommandOptionTypes.Role]: "roles"
}

const needResolved = [ApplicationCommandOptionTypes.Attachment, ApplicationCommandOptionTypes.Channel, ApplicationCommandOptionTypes.Role, ApplicationCommandOptionTypes.User]

export const getValue = (interaction: Interaction, name: string, type: ApplicationCommandOptionTypes | null = null) => {
  const options = getOptions(interaction)
  if (options === undefined) return null

  const option = options.find(option => {
    var cond = option.name === name
    if (type) cond = cond && option.type === type
    return cond
  })
  if (option === undefined) return null

  if (type && needResolved.includes(type) || needResolved.includes(option.type)) {
    const resolved = interaction.data?.resolved
    if (resolved === undefined) return null

    const key = resolvedOptionTypeToKey[type || option.type]
    const value = BigInt(option.value as string)

    if (![type, option.type].includes(ApplicationCommandOptionTypes.User)) {
      if (resolved[key] === undefined) return null
      return resolved[key].get(value)
    }

    return {
      user: resolved.users?.get(value) || null,
      member: resolved.members?.get(value) || null,
    }
  }

  return option.value
}
