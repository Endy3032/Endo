import { ActionRow, InputTextComponent, MessageComponentTypes, SelectMenuComponent, SelectOption as Option } from "discordeno"

export function Input(props: Omit<InputTextComponent, "type">): ActionRow {
	const component: InputTextComponent = {
		type: MessageComponentTypes.InputText,
		style: props.style,
		customId: props.customId,
		label: props.label,
		placeholder: props.placeholder,
		minLength: props.minLength,
		maxLength: props.maxLength,
		required: props.required,
		value: props.value,
	}

	return {
		type: MessageComponentTypes.ActionRow,
		components: [component],
	}
}
