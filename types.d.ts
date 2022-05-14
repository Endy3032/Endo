import { Temporal } from "temporal"
import { DiscordEmbed } from "discordeno"

declare global {
  interface Console {
    botLog: (content: string, logLevel?: string, embed?: DiscordEmbed) => void
    localLog: (content: string, logLevel?: string, log?: boolean) => { content: string, temporal: Temporal.Instant }
    tagLog: (tag: string, content: string, logLevel?: string) => void
    localTagLog: (tag: string, content: string, logLevel?: string) => void
  }

  enum nordColors {
    // Polar Night
    night1 = "2E3440",
    night2 = "3B4252",
    night3 = "434C5E",
    night4 = "4C566A",

    // Snow Storm
    storm1 = "D8DEE9",
    storm2 = "E5E9F0",
    storm3 = "ECEFF4",

    // Frost
    frost1 = "8FBCBB",
    frost2 = "88C0D0",
    frost3 = "81A1C1",
    frost4 = "5E81AC",

    // Aurora + Default Colors
    red = "BF616A",
    orange = "D08770",
    yellow = "EBCB8B",
    green = "A3BE8C",
    cyan = "88C0D0",
    blue = "81A1C1",
    magenta = "B48EAD",
    black = "2E3440",
    white = "ECEFF4",
    info = "A3BE8C",
    warn = "EBCB8B",
    error = "BF616A",
    debug = "D08770",
  }

  enum brightNordColors {
    // Polar Night
    night1 = "3E4450",
    night2 = "4B5262",
    night3 = "535C6E",
    night4 = "5C667A",

    // Snow Storm
    storm1 = "E8EEF9",
    storm2 = "F5F9F0",
    storm3 = "FCFFF4",

    // Frost
    frost1 = "9FCCCB",
    frost2 = "98D0E0",
    frost3 = "91B1D1",
    frost4 = "6E91BC",

    // Aurora + Default Colors
    red = "CF717A",
    orange = "E09780",
    yellow = "FBDB9B",
    green = "B3CE9C",
    cyan = "98D0E0",
    blue = "91B1D1",
    magenta = "C49EBD",
    black = "3E4450",
    white = "FCFFF4",
    info = "B3CE9C",
    warn = "FBDB9B",
    error = "CF717A",
    debug = "E09780"
  }

  enum darkNordColors {
    // Polar Night
    night1 = "1E2430",
    night2 = "2B3242",
    night3 = "333C4E",
    night4 = "3C465A",

    // Snow Storm
    storm1 = "C8CED9",
    storm2 = "D5D9E0",
    storm3 = "DCDFE4",

    // Frost
    frost1 = "7FACAB",
    frost2 = "78B0C0",
    frost3 = "7191B1",
    frost4 = "5E719C",

    // Aurora + Default Colors
    red = "AF515A",
    orange = "C07760",
    yellow = "CBBB7B",
    green = "93AE7C",
    cyan = "78B0C0",
    blue = "7191B1",
    magenta = "A47E9D",
    black = "1E2430",
    white = "DCDFE4",
    info = "93AE7C",
    warn = "CBBB7B",
    error = "AF515A",
    debug = "C07760"
  }
}
