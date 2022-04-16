export const pickFromArray = (arr: any[], start = 0, range = arr.length as number) => {
  if (start < 0) start = 0
  if (start > arr.length - 1) start = arr.length - 1
  if (range > arr.length - 1) range = arr.length - 1
  return arr[Math.floor(Math.random() * (range - start + 1)) + start]
}

export const randRange = (num1: number, num2 = 0) => {
  if (num2 > num1) [num2, num1] = [num1, num2]
  return Math.floor(Math.random() * (num1 - num2 + 1)) + num2
}
