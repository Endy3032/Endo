import { ApplicationCommandOptionTypes as CommandOptionTypes, Attachment, Channel, Interaction, InteractionDataOption,
	InteractionTypes, Member, Role, User } from "discordeno"

const resolvedKeys: { [key in Extract<keyof typeof CommandOptionTypes, "Attachment" | "Channel" | "Role">]: string } = {
	Attachment: "attachments",
	Channel: "channels",
	Role: "roles",
}

const resolvedTypes = [CommandOptionTypes.Attachment, CommandOptionTypes.Channel, CommandOptionTypes.Role, CommandOptionTypes.User]

export function getValue(interaction: Interaction, name: string, type?: "String" | "Modal"): string | undefined
export function getValue(interaction: Interaction, name: string, type?: "Boolean"): boolean | undefined
export function getValue(interaction: Interaction, name: string, type?: "Integer" | "Number"): number | undefined
export function getValue(interaction: Interaction, name: string, type?: "Role"): Role | undefined
export function getValue(interaction: Interaction, name: string, type?: "Channel"): Channel | undefined
export function getValue(interaction: Interaction, name: string, type?: "Attachment"): Attachment | undefined
export function getValue(interaction: Interaction, name: string, type?: "Mentionable"): User | Channel | Role | undefined
export function getValue(interaction: Interaction, name: string, type?: "User"): { user: User; member?: Member } | undefined
export function getValue(interaction: Interaction, name: string, type?: keyof typeof CommandOptionTypes | "Modal") {
	// Modal
	if (interaction.type === InteractionTypes.ModalSubmit) {
		const modalData = interaction.data?.components?.map(comp => comp.components).flat()
		return modalData?.find(comp => comp?.customId === name)?.value
	}

	// Getting data
	const options = getOptions(interaction)
	if (!options) return undefined

	const option = options.find(opt => {
		if (opt.name !== name) return false
		if (type) return opt.type === CommandOptionTypes[type]
		return true
	})
	if (!option) return undefined

	if (!resolvedTypes.includes(CommandOptionTypes[type ?? option.type])) return option.value

	// Resolved data
	const resolved = interaction.data?.resolved
	if (!resolved) return undefined

	const key = resolvedKeys[type || option.type]
	const value = BigInt(option.value as string)

	if ([type, option.type].includes(CommandOptionTypes.User)) {
		return {
			user: resolved.users?.get(value) ?? undefined,
			member: resolved.members?.get(value) ?? undefined,
		}
	}

	if (!resolved[key]) return undefined
	return resolved[key].get(value)
}

function getOptions(interaction: Interaction): InteractionDataOption[] | undefined {
	switch (interaction.data?.options?.[0].type) {
		case CommandOptionTypes.SubCommandGroup:
			return interaction.data?.options?.[0].options?.[0].options

		case CommandOptionTypes.SubCommand:
			return interaction.data?.options[0].options

		default:
			return interaction.data?.options
	}
}

type AutocompleteApplicationCommandOptionTypes = Extract<keyof typeof CommandOptionTypes, "String" | "Integer" | "Number">

export function getFocused(interaction: Interaction, type?: "String"): string | undefined
export function getFocused(interaction: Interaction, type?: "Integer" | "Number"): number | undefined
export function getFocused(interaction: Interaction, type?: AutocompleteApplicationCommandOptionTypes): string | number | undefined {
	const options = getOptions(interaction)
	if (!options) return undefined

	const option = options.find(option => {
		if (!option.focused) return false
		if (type) return option.type === CommandOptionTypes[type]
		return true
	})
	if (!option) return undefined
	return option.value as string | number | undefined
}
