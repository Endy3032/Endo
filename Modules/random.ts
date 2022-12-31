export const randRange = (lower: number, upper = 0) => {
	if (upper > lower) [upper, lower] = [lower, upper]
	return Math.floor(Math.random() * (lower - upper + 1)) + upper
}

export const pickArray = (arr: any[]) => arr[randRange(arr.length)]
