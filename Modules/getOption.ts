import { ApplicationCommandOptionTypes, Attachment, Channel, Interaction, Member, Role, User } from "discordeno"

export function getSubcmd(interaction: Interaction) {
  if (interaction.data?.options === undefined) return null

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup)
    return interaction.data.options?.[0].options?.[0].name

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommand)
    return interaction.data.options[0].name
}

export function getSubcmdGroup(interaction: Interaction) {
  if (interaction.data?.options === undefined) return null

  if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup)
    return interaction.data.options[0].name
}

function getOptions(interaction: Interaction) {
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

export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.String): string | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Boolean): boolean | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Integer | ApplicationCommandOptionTypes.Number): number | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Role): Role | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Channel): Channel | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Attachment): Attachment | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.Mentionable): User | Channel | Role | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes.User): { user: User, member?: Member } | null
export function getValue(interaction: Interaction, name: string, type?: ApplicationCommandOptionTypes) {
  const options = getOptions(interaction)
  if (options === undefined) return null

  const option = options.find(option => {
    let cond = option.name === name
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
      user: resolved.users?.get(value) ?? null,
      member: resolved.members?.get(value) ?? null,
    }
  }

  return option.value
}
