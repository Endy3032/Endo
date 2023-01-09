export function capitalize(content: string, lower?: boolean) {
	return content[0].toUpperCase() + (lower ? content.slice(1).toLowerCase() : content.slice(1))
}
