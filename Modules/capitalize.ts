const capitalize = (content: string, start = 0, length = 1, lower = false) => {
  let out = content.slice(start, start + length).toUpperCase() + (lower ? content.slice(start + length).toLowerCase() : content.slice(start + length))
  if (start != 0) out = content.slice(0, start) + out
  return out
}

const capitalizeFirstLetter = (content: string) => capitalize(content, 0, 1, true)

export { capitalize, capitalizeFirstLetter }
