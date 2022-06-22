import axiod from "axiod"
import { ApplicationCommandOptionTypes, ApplicationCommandTypes, Bot, Interaction } from "discordeno"
import { capitalize, colors, defer, getSubcmd, getSubcmdGroup, getValue, pickFromArray, respond } from "modules"
import { Temporal } from "temporal"

export const cmd = {
  name: "fetch",
  description: "Fetches data from a source on the internet",
  type: ApplicationCommandTypes.ChatInput,
  options: [
    // #region crypto
    // {
    //   name: "crypto",
    //   description: "Gather details about cryptocurrencies",
    //   type: ApplicationCommandTypes.SubCommandGroup,
    //   options: [
    //     {
    //       name: "nomics",
    //       description: "Get data from Nomics",
    //       type: ApplicationCommandTypes.SubCommand,
    //       options: [
    //         {
    //           name: "currency",
    //           description: "The currency to get data for",
    //           type: ApplicationCommandTypes.String,
    //           autocomplete: true,
    //           required: true,
    //         }
    //       ]
    //     },
    //     {
    //       name: "coinmarketcap",
    //       description: "Get data from CoinMarketCap",
    //       type: ApplicationCommandTypes.SubCommand,
    //       options: [
    //         {
    //           name: "currency",
    //           description: "The currency to get data for",
    //           type: ApplicationCommandTypes.String,
    //           autocomplete: true,
    //           required: true,
    //         }
    //       ]
    //     },
    //     {
    //       name: "coingecko",
    //       description: "Get data from CoinGecko",
    //       type: ApplicationCommandTypes.SubCommand,
    //       options: [
    //         {
    //           name: "currency",
    //           description: "The currency to get data for",
    //           type: ApplicationCommandTypes.String,
    //           autocomplete: true,
    //           required: true,
    //         }
    //       ]
    //     },
    //   ]
    // },
    // #endregion
    {
      name: "covid",
      description: "Get data from the COVID-19 API",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [{
        name: "location",
        description: "The data's location",
        type: ApplicationCommandOptionTypes.String,
        autocomplete: true,
        required: true,
      }]
    },
    {
      name: "definition",
      description: "Fetch a definition from dictionaries",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "dictionary",
          description: "The dictionary to use",
          type: ApplicationCommandOptionTypes.String,
          facts: [
            { name: "Dictionary API", value: "dictapi" },
            { name: "Urban Dictionary", value: "urban" },
          ],
          required: true,
        },
        {
          name: "word",
          description: "The word to fetch the definition",
          type: ApplicationCommandOptionTypes.String,
          autocomplete: true,
          required: true,
        }
      ]
    },
    {
      name: "facts",
      description: "Get a fact from le internet",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "cat",
          description: "Get a random cat fact",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "date",
          description: "Get a fact about a date",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "day",
              description: "The date's day",
              type: ApplicationCommandOptionTypes.Integer,
              min_value: 1,
              max_value: 31,
              required: true,
            },
            {
              name: "month",
              description: "The date's month",
              type: ApplicationCommandOptionTypes.Integer,
              min_value: 1,
              max_value: 12,
              required: true,
            }
          ]
        },
        {
          name: "legacy",
          description: "Get a random fact from the legacy list",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "trivia",
          description: "Get a random trivia fact from API Ninjas",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "number",
          description: "Get a fact about a number",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "mode",
              description: "The fact's mode",
              type: ApplicationCommandOptionTypes.String,
              choices: [
                { name: "Trivia", value: "trivia" },
                { name: "Math", value: "math" },
                { name: "Year", value: "year" },
              ],
              required: true,
            },
            {
              name: "number",
              description: "The fact's number",
              type: ApplicationCommandOptionTypes.Integer,
              required: true,
            }
          ]
        },
        {
          name: "random",
          description: "Get a random fact",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
          name: "useless",
          description: "Get a random useless fact",
          type: ApplicationCommandOptionTypes.SubCommand,
        },
      ]
    },
    {
      name: "lyrics",
      description: "Fetch lyrics from Genius",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [{
        name: "song",
        description: "The song to search for",
        type: ApplicationCommandOptionTypes.String,
        autocomplete: true,
        required: true,
      }]
    },
    {
      name: "translation",
      description: "Fetch a translation from Google Translate",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "to",
          description: "The translated language",
          type: ApplicationCommandOptionTypes.String,
          autocomplete: true,
          required: true,
        },
        {
          name: "text",
          description: "The text to translate",
          type: ApplicationCommandOptionTypes.String,
          required: true,
        },
        {
          name: "from",
          description: "The source language",
          type: ApplicationCommandOptionTypes.String,
          autocomplete: true,
          required: false,
        },
      ]
    },
    {
      name: "weather",
      description: "Fetch the current weather for any places from www.weatherapi.com",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "location",
          description: "The location to fetch the weather data [string]",
          type: ApplicationCommandOptionTypes.String,
          required: true,
          autocomplete: true,
        },
        {
          name: "options",
          description: "Options to change the output",
          type: ApplicationCommandOptionTypes.String,
          facts: [
            { name: "Use Imperial (˚F)", value: "imp" },
            { name: "Includes Air Quality", value: "aq" },
            { name: "Both", value: "both" },
          ],
          required: false,
        }
      ]
    },
    {
      name: "wikipedia",
      description: "Fetch a Wikipedia article",
      type: ApplicationCommandOptionTypes.SubCommandGroup,
      options: [
        {
          name: "article",
          description: "Search for a Wikipedia article",
          type: ApplicationCommandOptionTypes.SubCommand,
          options: [
            {
              name: "query",
              description: "The query to search for",
              type: ApplicationCommandOptionTypes.String,
              autocomplete: true,
              required: true,
            }
          ]
        }
      ]
    },
  ]
}

export async function execute(bot: Bot, interaction: Interaction) {
  switch(getSubcmdGroup(interaction)) {
    case "facts": {
      await defer(bot, interaction)
      let fact: string | string[] = "Wow, such empty",
        source: string | undefined = undefined,
        url: string | undefined = undefined,
        iconUrl: string | undefined = undefined

      switch(getSubcmd(interaction)) {
        case "cat": {
          try {
            fact = JSON.parse(Deno.readTextFileSync("./Resources/cat-facts.json"))
          } catch {
            const { data } = await axiod.get("https://raw.githubusercontent.com/vadimdemedes/cat-facts/master/cat-facts.json")
            fact = data
            Deno.writeTextFileSync("./Resources/cat-facts.json", JSON.stringify(fact, null, 2))
          }

          [source, url] = ["vadimdemedes", "https://github.com/vadimdemedes/cat-facts"]
          break
        }

        case "date": {
          const day = getValue(interaction, "day", "Integer") ?? 1
          const month = getValue(interaction, "month", "Integer") ?? 1
          const date = Temporal.ZonedDateTime.from({ year: 2020, month, day, timeZone: "UTC" })
          const { data } = await axiod.get(`http://numbersapi.com/${date.month}/${date.day}/date`);
          [fact, source, url, iconUrl] = [data, "Numbers API", "http://numbersapi.com/", "http://numbersapi.com/img/favicon.ico"]
          break
        }

        case "legacy": {
          fact = [
            "The chicken came first or the egg? The answer is... `the chicken`",
            "The alphabet is completely random",
            "I ran out of facts. That's a fact",
            "Found this fact? You're lucky!",
            "There are 168 prime numbers between 1 and 1000",
            "`τ` is just `π` times two!",
            "`τ` is `tau` and `π` is `pi`!",
            "The F word is the most flexible word in English!",
            "`Homosapiens` are how biologists call humans!",
            "`Endy` is a cool bot! And that's a fact!",
            "`Long` is short and `short` is long!",
            "√-1 love you!",
            "There are 13 Slavic countries in the world -- Brought to you by your gopnik friend!",
            "There are plagues in 1620, 1720, 1820, 1920 and...",
            "The phrase: `The quick brown fox jumps over the lazy dog` contains every letter in the alphabet!",
            "There are no Nobel prizes for math because Nobel lost his love to a mathematician",
            "Endy is intellegent",
            "69 is just a normal number ok?",
            "There are 24 synthetic elements from 95~118",
            "Most of these facts are written by Adnagaporp#1965"
          ]
          break
        }

        case "number": {
          const mode = getValue(interaction, "mode", "String") ?? "trivia"
          const number = getValue(interaction, "number", "Integer") ?? 1
          const { data } = await axiod.get(`http://numbersapi.com/${number}/${mode}`);
          [fact, source, url, iconUrl] = [data, "Numbers API", "http://numbersapi.com/", "http://numbersapi.com/img/favicon.ico"]
          break
        }

        case "trivia": {
          const { data } = await axiod.get("https://facts-by-api-ninjas.p.rapidapi.com/v1/facts", {
            headers: {
              "X-RapidAPI-Key": Deno.env.get("RapidAPI"),
              "X-RapidAPI-Host": "facts-by-api-ninjas.p.rapidapi.com"
            }
          });
          [fact, source, url, iconUrl] = [data[0].fact, "API Ninjas", "https://api-ninjas.com/facts", "https://rapidapi-prod-apis.s3.amazonaws.com/0a046a2e-24a5-4309-aa42-f3521e784b30.png"]
          break
        }

        case "useless": {
          switch(pickFromArray(["pl", "sk"])) {
            case "pl": {
              const { data } = await axiod.get("https://useless-facts.sameerkumar.website/api");
              [fact, source, url] = [data.data, "sameerkumar18", "https://github.com/sameerkumar18/useless-facts-api"]
              break
            }

            case "sk": {
              const { data } = await axiod.get("https://useless-facts.sameerkumar.website/api");
              [fact, source, url] = [data.text, `${data.source} via jsph.pl`, "https://useless-facts.sameerkumar.website"]
              break
            }
          }
          break
        }
      }

      await respond(bot, interaction, { embeds: [{
        title: `${capitalize(getSubcmd(interaction) ?? "")} Fact`,
        author: source ? { name: `Source: ${source}`, url, iconUrl: iconUrl ?? "https://github.com/fluidicon.png" } : undefined,
        color: pickFromArray(colors),
        description: typeof fact === "string" ? fact : pickFromArray(fact),
      }] })
      break
    }
  }
}