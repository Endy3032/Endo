export function randRange(lower: number, upper = 0) {
	if (lower > upper) [upper, lower] = [lower, upper]
	return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export function pickArray(arr: any[]) {
	return arr[randRange(arr.length * 10) % arr.length]
}
