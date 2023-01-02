import { ApplicationCommandOptionTypes, Attachment, Channel, Interaction, InteractionTypes, Member, Role, User } from "discordeno"

export function getCmdName(interaction: Interaction) {
	return [InteractionTypes.ApplicationCommand, InteractionTypes.ApplicationCommandAutocomplete].includes(interaction.type)
		? interaction.data?.name.replace(/^(\[.\]) /, "")
		: interaction.type === InteractionTypes.MessageComponent
		? interaction.message?.interaction?.name
		: interaction.type === InteractionTypes.ModalSubmit
		? interaction.data?.customId?.split("_")[0]
		: "null"
}

export function getSubcmd(interaction: Interaction) {
	if (interaction.data?.options === undefined) return null

	if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup) {
		return interaction.data.options?.[0].options?.[0].name
	}

	if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommand) return interaction.data.options[0].name
}

export function getSubcmdGroup(interaction: Interaction) {
	if (interaction.data?.options === undefined) return null

	if (interaction.data.options[0].type === ApplicationCommandOptionTypes.SubCommandGroup) return interaction.data.options[0].name
}

function getOptions(interaction: Interaction) {
	return interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup
		? interaction.data?.options?.[0].options?.[0].options
		: interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand
		? interaction.data?.options[0].options
		: interaction.data?.options
}

type ResolvedOptions = {
	[key in Extract<keyof typeof ApplicationCommandOptionTypes, "Attachment" | "Channel" | "Role">]: string
}

const resolvedOptionTypeToKey: ResolvedOptions = {
	Attachment: "attachments",
	Channel: "channels",
	Role: "roles",
}

const needResolved = [ApplicationCommandOptionTypes.Attachment, ApplicationCommandOptionTypes.Channel,
	ApplicationCommandOptionTypes.Role, ApplicationCommandOptionTypes.User]

export function getValue(interaction: Interaction, name: string, type?: "String" | "Modal"): string | undefined
export function getValue(interaction: Interaction, name: string, type?: "Boolean"): boolean | undefined
export function getValue(interaction: Interaction, name: string, type?: "Integer" | "Number"): number | undefined
export function getValue(interaction: Interaction, name: string, type?: "Role"): Role | undefined
export function getValue(interaction: Interaction, name: string, type?: "Channel"): Channel | undefined
export function getValue(interaction: Interaction, name: string, type?: "Attachment"): Attachment | undefined
export function getValue(interaction: Interaction, name: string, type?: "Mentionable"): User | Channel | Role | undefined
export function getValue(interaction: Interaction, name: string, type?: "User"): { user: User; member?: Member } | undefined
export function getValue(interaction: Interaction, name: string, type?: keyof typeof ApplicationCommandOptionTypes | "Modal") {
	if (interaction.type === InteractionTypes.ModalSubmit) {
		const modalData = interaction.data?.components?.map(component => component.components).flat()
		return modalData?.find(input => input?.customId === name)?.value
	}

	const options = getOptions(interaction)
	if (options === undefined) return undefined

	const option = options.find(option => {
		let cond = option.name === name
		if (type) cond = cond && option.type === ApplicationCommandOptionTypes[type]
		return cond
	})
	if (option === undefined) return undefined

	if (type && needResolved.includes(ApplicationCommandOptionTypes[type]) || needResolved.includes(option.type)) {
		const resolved = interaction.data?.resolved
		if (resolved === undefined) return undefined

		const key = resolvedOptionTypeToKey[type || option.type]
		const value = BigInt(option.value as string)
		if (![type, option.type].includes(ApplicationCommandOptionTypes.User)) {
			if (resolved[key] === undefined) return undefined
			return resolved[key].get(value)
		}

		return {
			user: resolved.users?.get(value) ?? undefined,
			member: resolved.members?.get(value) ?? undefined,
		}
	}

	return option.value
}

type AutocompleteOptionTypes = Extract<keyof typeof ApplicationCommandOptionTypes, "String" | "Integer" | "Number">
export function getFocused(interaction: Interaction, type?: "String"): string | null
export function getFocused(interaction: Interaction, type?: "Integer" | "Number"): number | null
export function getFocused(interaction: Interaction, type?: AutocompleteOptionTypes) {
	const options = getOptions(interaction)
	if (options === undefined) return null

	const option = options.find(option => {
		let cond = option.focused === true
		if (type) cond = cond && option.type === ApplicationCommandOptionTypes[type]
		return cond
	})
	if (option === undefined) return null
	return option.value
}
