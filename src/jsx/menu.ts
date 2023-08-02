import { ActionRow, MessageComponentTypes, SelectMenuComponent, SelectOption } from "discordeno"

type SelectProps = Omit<SelectMenuComponent, "type" | "options">

export const SelectMenu = (props: SelectProps, children: SelectOption[]): ActionRow => ({
	type: MessageComponentTypes.ActionRow,
	components: [{
		type: MessageComponentTypes.SelectMenu,
		...props,
		options: children.flat().filter(e => !!e).slice(0, 25),
	}],
})

type OptionProps =
	& Omit<SelectOption, "emoji">
	& {
		emojiId?: bigint
		emojiName?: string
		animated?: boolean
	}

export const Option = (props: OptionProps): SelectOption => ({
	...props,
	emoji: { id: props.emojiId, name: props.emojiName, animated: props.animated },
})
