/* eslint-disable @typescript-eslint/ban-types */
declare global {
  interface Console {
    botLog: Function
    tagLog: Function
  }

  interface MMediaGroup {
    abbreviation: string
    continent: string
    country: string
    confirmed: Number
    deaths: Number
    recovered: Number
    administered: Number
    people_vaccinated: Number
    people_partially_vaccinated: Number
    updated: string
  }
}

export {}