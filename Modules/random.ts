export const randRange = (lower: number, upper = 0) => {
	if (lower > upper) [upper, lower] = [lower, upper]
	return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export const pickArray = (arr: any[]) => arr[randRange(arr.length * 10) % arr.length]
