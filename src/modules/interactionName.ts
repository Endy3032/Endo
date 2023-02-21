import { ApplicationCommandOptionTypes as CommandOptionTypes, Interaction, InteractionTypes } from "discordeno"

export function getCmd(interaction: Interaction) {
	switch (interaction.type) {
		// Modal can be triggered via component or command
		// Message always present on component interaction
		case InteractionTypes.ModalSubmit:
		case InteractionTypes.MessageComponent:
			return (
				!interaction.message
					? interaction.data?.customId?.split(/[^\w]|_/)
					: interaction.message?.interaction?.name.split(" ")
			)?.[0] ?? undefined

		// Command name always present on other interactions
		default:
			return interaction.data?.name.replace(/^\[.\] /, "") ?? undefined
	}
}

export function getSubcmd(interaction: Interaction) {
	switch (interaction.type) {
		case InteractionTypes.ModalSubmit:
		case InteractionTypes.MessageComponent: {
			const cmd = !interaction.message
				? interaction.data?.customId?.split(/[^\w]|_/)
				: interaction.message?.interaction?.name.split(" ")

			return cmd?.length === 3 ? cmd[2] : cmd?.length === 2 ? cmd[1] : undefined
		}

		default: {
			if (!interaction.data?.options) return undefined

			switch (interaction.data.options[0].type) {
				case CommandOptionTypes.SubCommand:
					return interaction.data.options[0].name

				case CommandOptionTypes.SubCommandGroup:
					return interaction.data.options?.[0].options?.[0].name

				default:
					return undefined
			}
		}
	}
}

export function getGroup(interaction: Interaction) {
	switch (interaction.type) {
		case InteractionTypes.ModalSubmit:
		case InteractionTypes.MessageComponent: {
			const cmd = !interaction.message
				? interaction.data?.customId?.split(/[^\w]|_/)
				: interaction.message?.interaction?.name.split(" ")

			return cmd?.length === 3 ? cmd[1] : undefined
		}

		default: {
			if (interaction.data?.options?.[0].type === CommandOptionTypes.SubCommandGroup) return interaction.data.options[0].name
			return undefined
		}
	}
}
