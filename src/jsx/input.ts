import { ActionRow, InputTextComponent, MessageComponentTypes, TextStyles } from "discordeno"

type InputProps = Omit<InputTextComponent, "type" | "style"> & { style?: keyof typeof TextStyles }

export function Input(props: InputProps): ActionRow {
	const component: InputTextComponent = {
		type: MessageComponentTypes.InputText,
		...props,
		style: TextStyles[props.style ?? "Short"],
	}

	return {
		type: MessageComponentTypes.ActionRow,
		components: [component],
	}
}
