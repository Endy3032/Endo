export const createElement = <Attributes, Children extends any[], Return>(
	component: (props: Attributes, children: Children) => Return,
	attributes: Attributes,
	...children: Children
): Return => component({ ...attributes }, children)

window.createElement = createElement
export type CreateElement = typeof createElement

export * from "./button.ts"
export * from "./embed.ts"
export * from "./input.ts"
export * from "./menu.ts"
