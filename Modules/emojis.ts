type Emojis = {
  [key: string]: { name: string; id: bigint; animated?: boolean; shorthand?: string }
}

const emojis: Emojis = {
  success: { name: "success", id: 959424285217271859n },
  warn: { name: "warn", id: 959424285162766377n },
  error: { name: "error", id: 959424285275992074n },
  trash: { name: "trash", id: 962374647104569365n },
  WeatherAPI: { name: "WeatherAPI", id: 932557801153241088n },
}

Object.keys(emojis).forEach(emoji => {
  emojis[emoji].shorthand = `<${emojis[emoji].animated ? "a" : ""}:${emojis[emoji].name}:${emojis[emoji].id}>`
})

export { emojis }
