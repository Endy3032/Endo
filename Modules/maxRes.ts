export const maxRes = (link: string): string => {
	if (link.length == 0) return ""
	const url = new URL(link.replace(/.(jpg|jpeg|webp)/gi, ".png"))
	url.searchParams.delete("size")
	url.searchParams.set("size", "4096")
	return url.href
}
