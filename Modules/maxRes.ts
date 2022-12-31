export const maxRes = (link: string): string => {
	if (!link) return ""
	const url = new URL(link.replace(/.(jpg|jpeg|webp)/i, ".png"))
	url.searchParams.set("size", "4096")
	return url.href
}
