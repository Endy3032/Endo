import { ActionRow, MessageComponentTypes, SelectMenuComponent, SelectOption } from "discordeno"

type SelectProps = Omit<SelectMenuComponent, "type" | "options">

export function SelectMenu(props: SelectProps, children: SelectOption[]): ActionRow {
	const component: SelectMenuComponent = {
		type: MessageComponentTypes.SelectMenu,
		...props,
		options: children.filter(e => !!e),
	}

	return {
		type: MessageComponentTypes.ActionRow,
		components: [component],
	}
}

type OptionProps =
	& Omit<SelectOption, "emoji">
	& {
		emojiId?: bigint
		emojiName?: string
		animated?: boolean
	}

export function Option(props: OptionProps): SelectOption {
	return {
		...props,
		emoji: { id: props.emojiId, name: props.emojiName, animated: props.animated },
	}
}
