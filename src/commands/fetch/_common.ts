export interface WikiRestSearch {
	pages: {
		id: number
		key: string
		title: string
		excerpt: string
		matched_title: string
		description: string | null
		thumbnail: {
			mimetype: string
			size: number | null
			width: number | null
			height: number | null
			duration: number | null
			url: string
		} | null
	}[]
}
