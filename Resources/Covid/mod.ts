import { ApplicationCommandOptionChoice } from "discordeno"

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Brunei ",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "CAR",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Caribbean Netherlands",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Channel Islands",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "DRC",
  "Denmark",
  "Diamond Princess",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "DPRK",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Faeroe Islands",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "MS Zaandam",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Réunion",
  "S. Korea",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St. Barth",
  "St. Vincent Grenadines",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turks and Caicos",
  "Tuvalu",
  "U.S. Virgin Islands",
  "UAE",
  "UK",
  "USA",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const

let choices: ApplicationCommandOptionChoice[] = []
const jsonFile = "./Resources/Covid/choices.json"

try {
  choices = JSON.parse(Deno.readTextFileSync("./choices.json"))
} catch {
  choices.push({ name: "Global", value: "Global" })
  choices.push(...countries.map(country => {
    return { name: country, value: country }
  }))
  Deno.writeTextFileSync(jsonFile, JSON.stringify(choices, null, 2))
}

type BaseCovidCase = {
  totalConfirmed: number
  totalDeaths: number
  totalRecovered: number
}

interface CountryCovidCase extends BaseCovidCase {
  countryCode: string
  country: CovidCountries
  countryName: string
  lat: number
  lng: number
  dailyConfirmed: number
  dailyDeaths: number
  activeCases: number
  totalCritical: number
  totalConfirmedPerMillionPopulation: number
  totalDeathsPerMillionPopulation: number
  FR: string
  PR: string
  lastUpdated: string
}

interface GlobalCovidCase extends BaseCovidCase {
  totalNewCases: number
  totalNewDeaths: number
  totalActiveCases: number
  totalCasesPerMillionPop: number
  created: string
}

type CovidCountries = typeof countries[number]
type CovidCache = {
  [country in CovidCountries]: CountryCovidCase;
} & {
  timestamp: number;
  Global: GlobalCovidCase;
}

export { choices, countries }
export type { CovidCache, CovidCountries, CountryCovidCase, GlobalCovidCase }
