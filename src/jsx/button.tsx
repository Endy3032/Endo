import { ButtonComponent, ButtonStyles, MessageComponentTypes } from "discordeno"

export function Button(props: Omit<ButtonComponent, "style" | "type"> & { style?: keyof typeof ButtonStyles }): ButtonComponent {
	if (!props.customId && props.style !== "Link") throw new Error("Button needs a custom id if it is not of link type.")
	if (props.style === "Link" && !props.url) throw new Error("Link buttons need a URL")

	return {
		type: MessageComponentTypes.Button,
		customId: props.customId,
		label: props.label,
		style: ButtonStyles[props.style ?? "Primary"],
		emoji: props.emoji,
		url: props.url,
		disabled: props.disabled,
	}
}
