import { ActionRow, InputTextComponent, MessageComponentTypes, TextStyles } from "discordeno"

type InputProps = Omit<InputTextComponent, "type" | "style"> & { style?: keyof typeof TextStyles }

export const Input = (props: InputProps): ActionRow => ({
	type: MessageComponentTypes.ActionRow,
	components: [{
		type: MessageComponentTypes.InputText,
		...props,
		style: TextStyles[props.style ?? "Short"],
	}],
})
