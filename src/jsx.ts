export const Fragment = <Children extends any[]>({ children }: { children: Children }) => children

export const createElement = <Attributes, Children extends any[], Return>(
	component: (props: Attributes & { children: Children }) => Return,
	attributes: Attributes,
	...children: Children
): Return => component({ ...attributes, children })

window.createElement = createElement
window.Fragment = Fragment
