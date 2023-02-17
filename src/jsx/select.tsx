import { ActionRow, MessageComponentTypes, SelectMenuComponent, SelectOption as Option } from "discordeno"

export function SelectMenu(props: Omit<SelectMenuComponent, "type">): ActionRow {
	const component: SelectMenuComponent = {
		type: MessageComponentTypes.SelectMenu,
		customId: props.customId,
		placeholder: props.placeholder,
		minValues: props.minValues,
		maxValues: props.maxValues,
		disabled: props.disabled,
		options: props.options,
	}

	return {
		type: MessageComponentTypes.ActionRow,
		components: [component],
	}
}

export function SelectOption(props: Option): Option {
	return {
		label: props.label,
		value: props.value,
		description: props.description,
		emoji: props.emoji,
		default: props.default,
	}
}
