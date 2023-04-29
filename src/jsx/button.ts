import { ActionRow, ButtonComponent, ButtonStyles, MessageComponentTypes } from "discordeno"

type BaseButton = Omit<ButtonComponent, "type" | "style">
type LinkButton = BaseButton & { style: "Link"; url: string }
type ActionButton = BaseButton & { style?: Exclude<keyof typeof ButtonStyles, "Link">; customId: string }

export function Button(props: LinkButton | ActionButton): ButtonComponent {
	if (props.style === "Link" && !props.url) throw new Error("Link button needs a URL")
	if (props.style !== "Link" && !props.customId) throw new Error("Button needs `customId` if it's not a link.")

	return {
		type: MessageComponentTypes.Button,
		customId: props.style === "Link" ? undefined : props.customId,
		label: props.label,
		style: ButtonStyles[props.style ?? "Primary"],
		emoji: props.emoji,
		url: props.style === "Link" ? props.url : undefined,
		disabled: props.disabled,
	}
}

type ButtonRow = ButtonComponent[]

export function Row(_: any, children: ButtonRow): ActionRow {
	if (children.length === 0) throw new Error("Row must have at least one child")
	if (children.length > 5) children = children.slice(0, 5)

	return {
		type: MessageComponentTypes.ActionRow,
		components: children as ActionRow["components"],
	}
}
