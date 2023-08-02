export const createElement = <Properties, Children extends any[], Return>(
	component: (props: Properties, children: Children) => Return,
	props: Properties,
	...children: Children
): Return => component({ ...props }, children)

window.createElement = createElement
export type CreateElement = typeof createElement

export const Fragment = <Properties, Children extends any[]>(_: Properties, children: Children) => children

window.Fragment = Fragment
export type Fragment = typeof Fragment

export * from "./button.ts"
export * from "./embed.ts"
export * from "./input.ts"
export * from "./menu.ts"
