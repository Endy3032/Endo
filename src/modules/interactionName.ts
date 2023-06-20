import { ApplicationCommandOptionTypes as CommandOptionTypes, Interaction, InteractionTypes } from "discordeno"

export function getCmd(interaction: Interaction) {
	let name: string | undefined

	if ([InteractionTypes.ModalSubmit, InteractionTypes.MessageComponent].includes(interaction.type)) {
		// Modals can be triggered via component or command
		// Message always present on component interaction
		name = interactionName(interaction)?.[0]
	} else {
		// Command name always present on other interactions
		name = interaction.data?.name
	}

	return name?.replace(/^\[.\] */, "") ?? undefined
}

export function getGroup(interaction: Interaction) {
	switch (interaction.type) {
		case InteractionTypes.ModalSubmit:
		case InteractionTypes.MessageComponent: {
			const cmd = interactionName(interaction)
			return cmd?.length === 3 ? cmd[1] : undefined
		}

		default: {
			if (interaction.data?.options?.[0].type === CommandOptionTypes.SubCommandGroup) return interaction.data.options[0].name
			return undefined
		}
	}
}

export function getSubcmd(interaction: Interaction) {
	switch (interaction.type) {
		case InteractionTypes.ModalSubmit:
		case InteractionTypes.MessageComponent: {
			const cmd = interactionName(interaction)
			return cmd?.length === 3 ? cmd[2] : cmd?.length === 2 ? cmd[1] : undefined
		}

		default: {
			if (!interaction.data?.options) return undefined

			switch (interaction.data.options[0].type) {
				case CommandOptionTypes.SubCommand:
					return interaction.data.options[0].name

				case CommandOptionTypes.SubCommandGroup:
					return interaction.data.options[0].options![0].name

				default:
					return undefined
			}
		}
	}
}

export function interactionName(interaction: Interaction) {
	return !interaction.message
		? interaction.data?.customId?.split(/[^\w]|_/)
		: interaction.message?.interaction?.name.split(" ")
}
