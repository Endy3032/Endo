export const capitalize = (content: string, lower?: boolean) =>
	content[0].toUpperCase() + (lower ? content.slice(1).toLowerCase() : content.slice(1))
