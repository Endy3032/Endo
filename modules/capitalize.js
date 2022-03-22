function capitalize(content, start = 0, length = 1, lower = false) {
  out = content.slice(start, start + length).toUpperCase() + (lower ? content.slice(start + length).toLowerCase() : content.slice(start + length))
  if (start != 0) out = content.slice(0, start) + out
  return out
}

function firstLetter(content) {
  capitalize(content, 0, 1, true)
}

module.exports = capitalize
Object.assign(module.exports, { firstLetter })