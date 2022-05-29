export const capitalize = (content: string, options?: { start?: number; length?: number; lower?: boolean }) => {
  const { start, length, lower } = Object.assign({ start: 0, length: 1, lower: false }, options)
  let out = content.slice(start, start + length).toUpperCase() + (lower ? content.slice(start + length).toLowerCase() : content.slice(start + length))
  if (start != 0) out = content.slice(0, start) + out
  return out
}
