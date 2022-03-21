let emojis = {
  success: { name: "success", id: "955083320247615528" },
  warn: { name: "warn", id: "955083320159502417" },
  error: { name: "error", id: "955083320193081364" },
  trash: { name: "trash", id: "927050313943380089" },
  WeatherAPI: { name: "WeatherAPI", id: "932557801153241088" },
}

Object.keys(emojis).forEach(emoji => {
  // emojis[emoji].name = emoji
  emojis[emoji].shorthand = `<:${emojis[emoji].name}:${emojis[emoji].id}>`
})

module.exports = emojis