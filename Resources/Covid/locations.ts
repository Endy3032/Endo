import { existsSync, readFileSync, writeFileSync } from "fs"
import { ApplicationCommandOptionChoice } from "discord.js"

const continents = ["Asia", "Africa", "Europe", "North America", "South America", "Oceania", "Antarctica"]

// Source: https://github.com/M-Media-Group/country-json/blob/master/src/countries-master.json
const countries = [
  {
    country: "Afghanistan",
    continent: "Asia",
    abbreviation: "AF",
    location: "Southern and Central Asia",
    iso: "4",
    capital_city: "Kabul"
  },
  {
    country: "Albania",
    continent: "Europe",
    abbreviation: "AL",
    location: "Southern Europe",
    iso: "8",
    capital_city: "Tirana"
  },
  {
    country: "Algeria",
    continent: "Africa",
    abbreviation: "DZ",
    location: "Northern Africa",
    iso: "12",
    capital_city: "Alger"
  },
  {
    country: "American Samoa",
    continent: "Oceania",
    abbreviation: "AS",
    location: "Polynesia",
    iso: "16",
    capital_city: "Fagatogo"
  },
  {
    country: "Andorra",
    continent: "Europe",
    abbreviation: "AD",
    location: "Southern Europe",
    iso: "20",
    capital_city: "Andorra la Vella"
  },
  {
    country: "Angola",
    continent: "Africa",
    abbreviation: "AO",
    location: "Central Africa",
    iso: "24",
    capital_city: "Luanda"
  },
  {
    country: "Anguilla",
    continent: "North America",
    abbreviation: "AI",
    location: "Caribbean",
    iso: "660",
    capital_city: "The Valley"
  },
  {
    country: "Antarctica",
    continent: "Antarctica",
    abbreviation: "AQ",
    location: "Antarctica",
    iso: "10",
    capital_city: null
  },
  {
    country: "Antigua and Barbuda",
    continent: "North America",
    abbreviation: "AG",
    location: "Caribbean",
    iso: "28",
    capital_city: "Saint John's"
  },
  {
    country: "Argentina",
    continent: "South America",
    abbreviation: "AR",
    location: "South America",
    iso: "32",
    capital_city: "Buenos Aires"
  },
  {
    country: "Armenia",
    continent: "Asia",
    abbreviation: "AM",
    location: "Middle East",
    iso: "51",
    capital_city: "Yerevan"
  },
  {
    country: "Aruba",
    continent: "North America",
    abbreviation: "AW",
    location: "Caribbean",
    iso: "533",
    capital_city: "Oranjestad"
  },
  {
    country: "Australia",
    continent: "Oceania",
    abbreviation: "AU",
    location: "Australia and New Zealand",
    iso: "36",
    capital_city: "Canberra"
  },
  {
    country: "Austria",
    continent: "Europe",
    abbreviation: "AT",
    location: "Western Europe",
    iso: "40",
    capital_city: "Wien"
  },
  {
    country: "Azerbaijan",
    continent: "Asia",
    abbreviation: "AZ",
    location: "Middle East",
    iso: "31",
    capital_city: "Baku"
  },
  {
    country: "Bahamas",
    continent: "North America",
    abbreviation: "BS",
    location: "Caribbean",
    iso: "44",
    capital_city: "Nassau"
  },
  {
    country: "Bahrain",
    continent: "Asia",
    abbreviation: "BH",
    location: "Middle East",
    iso: "48",
    capital_city: "al-Manama"
  },
  {
    country: "Bangladesh",
    continent: "Asia",
    abbreviation: "BD",
    location: "Southern and Central Asia",
    iso: "50",
    capital_city: "Dhaka"
  },
  {
    country: "Barbados",
    continent: "North America",
    abbreviation: "BB",
    location: "Caribbean",
    iso: "52",
    capital_city: "Bridgetown"
  },
  {
    country: "Belarus",
    continent: "Europe",
    abbreviation: "BY",
    location: "Eastern Europe",
    iso: "112",
    capital_city: "Minsk"
  },
  {
    country: "Belgium",
    continent: "Europe",
    abbreviation: "BE",
    location: "Western Europe",
    iso: "56",
    capital_city: "Bruxelles [Brussel]"
  },
  {
    country: "Belize",
    continent: "North America",
    abbreviation: "BZ",
    location: "Central America",
    iso: "84",
    capital_city: "Belmopan"
  },
  {
    country: "Benin",
    continent: "Africa",
    abbreviation: "BJ",
    location: "Western Africa",
    iso: "204",
    capital_city: "Porto-Novo"
  },
  {
    country: "Bermuda",
    continent: "North America",
    abbreviation: "BM",
    location: "North America",
    iso: "60",
    capital_city: "Hamilton"
  },
  {
    country: "Bhutan",
    continent: "Asia",
    abbreviation: "BT",
    location: "Southern and Central Asia",
    iso: "64",
    capital_city: "Thimphu"
  },
  {
    country: "Bolivia",
    continent: "South America",
    abbreviation: "BO",
    location: "South America",
    iso: "68",
    capital_city: "La Paz"
  },
  {
    country: "Bosnia and Herzegovina",
    continent: "Europe",
    abbreviation: "BA",
    location: "Southern Europe",
    iso: "70",
    capital_city: "Sarajevo"
  },
  {
    country: "Botswana",
    continent: "Africa",
    abbreviation: "BW",
    location: "Southern Africa",
    iso: "72",
    capital_city: "Gaborone"
  },
  {
    country: "Bouvet Island",
    continent: "Antarctica",
    abbreviation: "BV",
    location: "Antarctica",
    iso: "74",
    capital_city: null
  },
  {
    country: "Brazil",
    continent: "South America",
    abbreviation: "BR",
    location: "South America",
    iso: "76",
    capital_city: "Brasília"
  },
  {
    country: "British Indian Ocean Territory",
    continent: "Africa",
    abbreviation: "IO",
    location: "Eastern Africa",
    iso: "86",
    capital_city: null
  },
  {
    country: "Brunei",
    continent: "Asia",
    abbreviation: "BN",
    location: "Southeast Asia",
    iso: "96",
    capital_city: "Bandar Seri Begawan"
  },
  {
    country: "Bulgaria",
    continent: "Europe",
    abbreviation: "BG",
    location: "Eastern Europe",
    iso: "100",
    capital_city: "Sofia"
  },
  {
    country: "Burkina Faso",
    continent: "Africa",
    abbreviation: "BF",
    location: "Western Africa",
    iso: "854",
    capital_city: "Ouagadougou"
  },
  {
    country: "Burundi",
    continent: "Africa",
    abbreviation: "BI",
    location: "Eastern Africa",
    iso: "108",
    capital_city: "Bujumbura"
  },
  {
    country: "Cambodia",
    continent: "Asia",
    abbreviation: "KH",
    location: "Southeast Asia",
    iso: "116",
    capital_city: "Phnom Penh"
  },
  {
    country: "Cameroon",
    continent: "Africa",
    abbreviation: "CM",
    location: "Central Africa",
    iso: "120",
    capital_city: "Yaound"
  },
  {
    country: "Canada",
    continent: "North America",
    abbreviation: "CA",
    location: "North America",
    iso: "124",
    capital_city: "Ottawa"
  },
  {
    country: "Cape Verde",
    continent: "Africa",
    abbreviation: "CV",
    location: "Western Africa",
    iso: "132",
    capital_city: "Praia"
  },
  {
    country: "Cayman Islands",
    continent: "North America",
    abbreviation: "KY",
    location: "Caribbean",
    iso: "136",
    capital_city: "George Town"
  },
  {
    country: "Central African Republic",
    continent: "Africa",
    abbreviation: "CF",
    location: "Central Africa",
    iso: "140",
    capital_city: "Bangui"
  },
  {
    country: "Chad",
    continent: "Africa",
    abbreviation: "TD",
    location: "Central Africa",
    iso: "148",
    capital_city: "N'Djam"
  },
  {
    country: "Chile",
    continent: "South America",
    abbreviation: "CL",
    location: "South America",
    iso: "152",
    capital_city: "Santiago de Chile"
  },
  {
    country: "China",
    continent: "Asia",
    abbreviation: "CN",
    location: "Eastern Asia",
    iso: "156",
    capital_city: "Peking"
  },
  {
    country: "Christmas Island",
    continent: "Oceania",
    abbreviation: "CX",
    location: "Australia and New Zealand",
    iso: "162",
    capital_city: "Flying Fish Cove"
  },
  {
    country: "Cocos (Keeling) Islands",
    continent: "Oceania",
    abbreviation: "CC",
    location: "Australia and New Zealand",
    iso: null,
    capital_city: "West Island"
  },
  {
    country: "Colombia",
    continent: "South America",
    abbreviation: "CO",
    location: "South America",
    iso: "170",
    capital_city: "Santaf"
  },
  {
    country: "Comoros",
    continent: "Africa",
    abbreviation: "KM",
    location: "Eastern Africa",
    iso: "174",
    capital_city: "Moroni"
  },
  {
    country: "Congo",
    continent: "Africa",
    abbreviation: "CG",
    location: "Central Africa",
    iso: null,
    capital_city: "Brazzaville"
  },
  {
    country: "Cook Islands",
    continent: "Oceania",
    abbreviation: "CK",
    location: "Polynesia",
    iso: "184",
    capital_city: "Avarua"
  },
  {
    country: "Costa Rica",
    continent: "North America",
    abbreviation: "CR",
    location: "Central America",
    iso: "188",
    capital_city: "San Jos"
  },
  {
    country: "Croatia",
    continent: "Europe",
    abbreviation: "HR",
    location: "Southern Europe",
    iso: "191",
    capital_city: "Zagreb"
  },
  {
    country: "Cuba",
    continent: "North America",
    abbreviation: "CU",
    location: "Caribbean",
    iso: "192",
    capital_city: "La Habana"
  },
  {
    country: "Cyprus",
    continent: "Asia",
    abbreviation: "CY",
    location: "Middle East",
    iso: "196",
    capital_city: "Nicosia"
  },
  {
    country: "Czechia",
    continent: "Europe",
    abbreviation: "CZ",
    location: "Eastern Europe",
    iso: "203",
    capital_city: "Praha"
  },
  {
    country: "Denmark",
    continent: "Europe",
    abbreviation: "DK",
    location: "Nordic Countries",
    iso: "208",
    capital_city: "Copenhagen"
  },
  {
    country: "Djibouti",
    continent: "Africa",
    abbreviation: "DJ",
    location: "Eastern Africa",
    iso: "262",
    capital_city: "Djibouti"
  },
  {
    country: "Dominica",
    continent: "North America",
    abbreviation: "DM",
    location: "Caribbean",
    iso: "212",
    capital_city: "Roseau"
  },
  {
    country: "Dominican Republic",
    continent: "North America",
    abbreviation: "DO",
    location: "Caribbean",
    iso: "214",
    capital_city: "Santo Domingo de Guzm"
  },
  {
    country: "East Timor",
    continent: "Asia",
    abbreviation: "TP",
    location: "Southeast Asia",
    iso: "626",
    capital_city: "Dili"
  },
  {
    country: "Ecuador",
    continent: "South America",
    abbreviation: "EC",
    location: "South America",
    iso: "218",
    capital_city: "Quito"
  },
  {
    country: "Egypt",
    continent: "Africa",
    abbreviation: "EG",
    location: "Northern Africa",
    iso: "818",
    capital_city: "Cairo"
  },
  {
    country: "El Salvador",
    continent: "North America",
    abbreviation: "SV",
    location: "Central America",
    iso: "222",
    capital_city: "San Salvador"
  },
  {
    country: "England",
    continent: "Europe",
    location: null,
    iso: null,
    capital_city: "London"
  },
  {
    country: "Equatorial Guinea",
    continent: "Africa",
    abbreviation: "GQ",
    location: "Central Africa",
    iso: "226",
    capital_city: "Malabo"
  },
  {
    country: "Eritrea",
    continent: "Africa",
    abbreviation: "ER",
    location: "Eastern Africa",
    iso: "232",
    capital_city: "Asmara"
  },
  {
    country: "Estonia",
    continent: "Europe",
    abbreviation: "EE",
    location: "Baltic Countries",
    iso: "233",
    capital_city: "Tallinn"
  },
  {
    country: "Ethiopia",
    continent: "Africa",
    abbreviation: "ET",
    location: "Eastern Africa",
    iso: "231",
    capital_city: "Addis Abeba"
  },
  {
    country: "Falkland Islands",
    continent: "South America",
    abbreviation: "FK",
    location: "South America",
    iso: "238",
    capital_city: "Stanley"
  },
  {
    country: "Faroe Islands",
    continent: "Europe",
    abbreviation: "FO",
    location: "Nordic Countries",
    iso: "234",
    capital_city: "Tórshavn"
  },
  {
    country: "Fiji",
    continent: "Oceania",
    abbreviation: "FJ",
    location: "Melanesia",
    iso: null,
    capital_city: "Suva"
  },
  {
    country: "Finland",
    continent: "Europe",
    abbreviation: "FI",
    location: "Nordic Countries",
    iso: "246",
    capital_city: "Helsinki [Helsingfors]"
  },
  {
    country: "France",
    continent: "Europe",
    abbreviation: "FR",
    location: "Western Europe",
    iso: "250",
    capital_city: "Paris"
  },
  {
    country: "French Guiana",
    continent: "South America",
    abbreviation: "GF",
    location: "South America",
    iso: "254",
    capital_city: "Cayenne"
  },
  {
    country: "French Polynesia",
    continent: "Oceania",
    abbreviation: "PF",
    location: "Polynesia",
    iso: "258",
    capital_city: "Papeete"
  },
  {
    country: "French Southern territories",
    continent: "Antarctica",
    abbreviation: "TF",
    location: "Antarctica",
    iso: "260",
    capital_city: null
  },
  {
    country: "Gabon",
    continent: "Africa",
    abbreviation: "GA",
    location: "Central Africa",
    iso: "266",
    capital_city: "Libreville"
  },
  {
    country: "Gambia",
    continent: "Africa",
    abbreviation: "GM",
    location: "Western Africa",
    iso: "270",
    capital_city: "Banjul"
  },
  {
    country: "Georgia",
    continent: "Asia",
    abbreviation: "GE",
    location: "Middle East",
    iso: "268",
    capital_city: "Tbilisi"
  },
  {
    country: "Germany",
    continent: "Europe",
    abbreviation: "DE",
    location: "Western Europe",
    iso: "276",
    capital_city: "Berlin"
  },
  {
    country: "Ghana",
    continent: "Africa",
    abbreviation: "GH",
    location: "Western Africa",
    iso: "288",
    capital_city: "Accra"
  },
  {
    country: "Gibraltar",
    continent: "Europe",
    abbreviation: "GI",
    location: "Southern Europe",
    iso: "292",
    capital_city: "Gibraltar"
  },
  {
    country: "Greece",
    continent: "Europe",
    abbreviation: "GR",
    location: "Southern Europe",
    iso: "300",
    capital_city: "Athenai"
  },
  {
    country: "Greenland",
    continent: "North America",
    abbreviation: "GL",
    location: "North America",
    iso: "304",
    capital_city: "Nuuk"
  },
  {
    country: "Grenada",
    continent: "North America",
    abbreviation: "GD",
    location: "Caribbean",
    iso: "308",
    capital_city: "Saint George's"
  },
  {
    country: "Guadeloupe",
    continent: "North America",
    abbreviation: "GP",
    location: "Caribbean",
    iso: "312",
    capital_city: "Basse-Terre"
  },
  {
    country: "Gua",
    continent: "Oceania",
    abbreviation: "GU",
    location: "Micronesia",
    iso: "316",
    capital_city: "Aga"
  },
  {
    country: "Guatemala",
    continent: "North America",
    abbreviation: "GT",
    location: "Central America",
    iso: "320",
    capital_city: "Ciudad de Guatemala"
  },
  {
    country: "Guinea",
    continent: "Africa",
    abbreviation: "GN",
    location: "Western Africa",
    iso: "324",
    capital_city: "Conakry"
  },
  {
    country: "Guinea-Bissau",
    continent: "Africa",
    abbreviation: "GW",
    location: "Western Africa",
    iso: "624",
    capital_city: "Bissau"
  },
  {
    country: "Guyana",
    continent: "South America",
    abbreviation: "GY",
    location: "South America",
    iso: "328",
    capital_city: "Georgetown"
  },
  {
    country: "Haiti",
    continent: "North America",
    abbreviation: "HT",
    location: "Caribbean",
    iso: "332",
    capital_city: "Port-au-Prince"
  },
  {
    country: "Heard Island and McDonald Islands",
    continent: "Antarctica",
    abbreviation: "HM",
    location: "Antarctica",
    iso: "334",
    capital_city: null
  },
  {
    country: "Holy See",
    continent: "Europe",
    abbreviation: "VA",
    location: "Southern Europe",
    iso: null,
    capital_city: "Citt"
  },
  {
    country: "Honduras",
    continent: "North America",
    abbreviation: "HN",
    location: "Central America",
    iso: "340",
    capital_city: "Tegucigalpa"
  },
  {
    country: "Hong Kong",
    continent: "Asia",
    abbreviation: "HK",
    location: "Eastern Asia",
    iso: "344",
    capital_city: "Victoria"
  },
  {
    country: "Hungary",
    continent: "Europe",
    abbreviation: "HU",
    location: "Eastern Europe",
    iso: "348",
    capital_city: "Budapest"
  },
  {
    country: "Iceland",
    continent: "Europe",
    abbreviation: "IS",
    location: "Nordic Countries",
    iso: "352",
    capital_city: "Reykjav"
  },
  {
    country: "India",
    continent: "Asia",
    abbreviation: "IN",
    location: "Southern and Central Asia",
    iso: "356",
    capital_city: "New Delhi"
  },
  {
    country: "Indonesia",
    continent: "Asia",
    abbreviation: "ID",
    location: "Southeast Asia",
    iso: "360",
    capital_city: "Jakarta"
  },
  {
    country: "Iran",
    continent: "Asia",
    abbreviation: "IR",
    location: "Southern and Central Asia",
    iso: "364",
    capital_city: "Tehran"
  },
  {
    country: "Iraq",
    continent: "Asia",
    abbreviation: "IQ",
    location: "Middle East",
    iso: "368",
    capital_city: "Baghdad"
  },
  {
    country: "Ireland",
    continent: "Europe",
    abbreviation: "IE",
    location: "British Isles",
    iso: "372",
    capital_city: "Dublin"
  },
  {
    country: "Israel",
    continent: "Asia",
    abbreviation: "IL",
    location: "Middle East",
    iso: "376",
    capital_city: "Jerusalem"
  },
  {
    country: "Italy",
    continent: "Europe",
    abbreviation: "IT",
    location: "Southern Europe",
    iso: "380",
    capital_city: "Roma"
  },
  {
    country: "Cote d'Ivoire",
    continent: "Africa",
    abbreviation: "CI",
    location: "Western Africa",
    iso: "384",
    capital_city: "Yamoussoukro"
  },
  {
    country: "Jamaica",
    continent: "North America",
    abbreviation: "JM",
    location: "Caribbean",
    iso: "388",
    capital_city: "Kingston"
  },
  {
    country: "Japan",
    continent: "Asia",
    abbreviation: "JP",
    location: "Eastern Asia",
    iso: "392",
    capital_city: "Tokyo"
  },
  {
    country: "Jordan",
    continent: "Asia",
    abbreviation: "JO",
    location: "Middle East",
    iso: "400",
    capital_city: "Amman"
  },
  {
    country: "Kazakhstan",
    continent: "Asia",
    abbreviation: "KZ",
    location: "Southern and Central Asia",
    iso: null,
    capital_city: "Astana"
  },
  {
    country: "Kenya",
    continent: "Africa",
    abbreviation: "KE",
    location: "Eastern Africa",
    iso: "404",
    capital_city: "Nairobi"
  },
  {
    country: "Kiribati",
    continent: "Oceania",
    abbreviation: "KI",
    location: "Micronesia",
    iso: "296",
    capital_city: "Bairiki"
  },
  {
    country: "Kuwait",
    continent: "Asia",
    abbreviation: "KW",
    location: "Middle East",
    iso: "414",
    capital_city: "Kuwait"
  },
  {
    country: "Kyrgyzstan",
    continent: "Asia",
    abbreviation: "KG",
    location: "Southern and Central Asia",
    iso: "417",
    capital_city: "Bishkek"
  },
  {
    country: "Laos",
    continent: "Asia",
    abbreviation: "LA",
    location: "Southeast Asia",
    iso: "418",
    capital_city: "Vientiane"
  },
  {
    country: "Latvia",
    continent: "Europe",
    abbreviation: "LV",
    location: "Baltic Countries",
    iso: "428",
    capital_city: "Riga"
  },
  {
    country: "Lebanon",
    continent: "Asia",
    abbreviation: "LB",
    location: "Middle East",
    iso: "422",
    capital_city: "Beirut"
  },
  {
    country: "Lesotho",
    continent: "Africa",
    abbreviation: "LS",
    location: "Southern Africa",
    iso: "426",
    capital_city: "Maseru"
  },
  {
    country: "Liberia",
    continent: "Africa",
    abbreviation: "LR",
    location: "Western Africa",
    iso: "430",
    capital_city: "Monrovia"
  },
  {
    country: "Libya",
    continent: "Africa",
    abbreviation: "LY",
    location: "Northern Africa",
    iso: null,
    capital_city: "Tripoli"
  },
  {
    country: "Liechtenstein",
    continent: "Europe",
    abbreviation: "LI",
    location: "Western Europe",
    iso: "438",
    capital_city: "Vaduz"
  },
  {
    country: "Lithuania",
    continent: "Europe",
    abbreviation: "LT",
    location: "Baltic Countries",
    iso: "440",
    capital_city: "Vilnius"
  },
  {
    country: "Luxembourg",
    continent: "Europe",
    abbreviation: "LU",
    location: "Western Europe",
    iso: "442",
    capital_city: "Luxembourg [Luxemburg/L"
  },
  {
    country: "Macao",
    continent: "Asia",
    abbreviation: "MO",
    location: "Eastern Asia",
    iso: "446",
    capital_city: "Macao"
  },
  {
    country: "North Macedonia",
    continent: "Europe",
    abbreviation: "MK",
    location: "Southern Europe",
    iso: "807",
    capital_city: "Skopje"
  },
  {
    country: "Madagascar",
    continent: "Africa",
    abbreviation: "MG",
    location: "Eastern Africa",
    iso: "450",
    capital_city: "Antananarivo"
  },
  {
    country: "Malawi",
    continent: "Africa",
    abbreviation: "MW",
    location: "Eastern Africa",
    iso: "454",
    capital_city: "Lilongwe"
  },
  {
    country: "Malaysia",
    continent: "Asia",
    abbreviation: "MY",
    location: "Southeast Asia",
    iso: "458",
    capital_city: "Kuala Lumpur"
  },
  {
    country: "Maldives",
    continent: "Asia",
    abbreviation: "MV",
    location: "Southern and Central Asia",
    iso: "462",
    capital_city: "Male"
  },
  {
    country: "Mali",
    continent: "Africa",
    abbreviation: "ML",
    location: "Western Africa",
    iso: "466",
    capital_city: "Bamako"
  },
  {
    country: "Malta",
    continent: "Europe",
    abbreviation: "MT",
    location: "Southern Europe",
    iso: "470",
    capital_city: "Valletta"
  },
  {
    country: "Marshall Islands",
    continent: "Oceania",
    abbreviation: "MH",
    location: "Micronesia",
    iso: "584",
    capital_city: "Dalap-Uliga-Darrit"
  },
  {
    country: "Martinique",
    continent: "North America",
    abbreviation: "MQ",
    location: "Caribbean",
    iso: "474",
    capital_city: "Fort-de-France"
  },
  {
    country: "Mauritania",
    continent: "Africa",
    abbreviation: "MR",
    location: "Western Africa",
    iso: "478",
    capital_city: "Nouakchott"
  },
  {
    country: "Mauritius",
    continent: "Africa",
    abbreviation: "MU",
    location: "Eastern Africa",
    iso: "480",
    capital_city: "Port-Louis"
  },
  {
    country: "Mayotte",
    continent: "Africa",
    abbreviation: "YT",
    location: "Eastern Africa",
    iso: "175",
    capital_city: "Mamoutzou"
  },
  {
    country: "Mexico",
    continent: "North America",
    abbreviation: "MX",
    location: "Central America",
    iso: "484",
    capital_city: "Ciudad de M"
  },
  {
    country: "Micronesia, Federated States of",
    continent: "Oceania",
    abbreviation: "FM",
    location: "Micronesia",
    iso: null,
    capital_city: "Palikir"
  },
  {
    country: "Moldova",
    continent: "Europe",
    abbreviation: "MD",
    location: "Eastern Europe",
    iso: "498",
    capital_city: "Chisinau"
  },
  {
    country: "Monaco",
    continent: "Europe",
    abbreviation: "MC",
    location: "Western Europe",
    iso: "492",
    capital_city: "Monaco-Ville"
  },
  {
    country: "Mongolia",
    continent: "Asia",
    abbreviation: "MN",
    location: "Eastern Asia",
    iso: "496",
    capital_city: "Ulan Bator"
  },
  {
    country: "Montserrat",
    continent: "North America",
    abbreviation: "MS",
    location: "Caribbean",
    iso: "500",
    capital_city: "Plymouth"
  },
  {
    country: "Morocco",
    continent: "Africa",
    abbreviation: "MA",
    location: "Northern Africa",
    iso: "504",
    capital_city: "Rabat"
  },
  {
    country: "Mozambique",
    continent: "Africa",
    abbreviation: "MZ",
    location: "Eastern Africa",
    iso: "508",
    capital_city: "Maputo"
  },
  {
    country: "Myanmar",
    continent: "Asia",
    abbreviation: "MM",
    location: "Southeast Asia",
    iso: null,
    capital_city: "Rangoon (Yangon)"
  },
  {
    country: "Namibia",
    continent: "Africa",
    abbreviation: "NA",
    location: "Southern Africa",
    iso: "516",
    capital_city: "Windhoek"
  },
  {
    country: "Nauru",
    continent: "Oceania",
    abbreviation: "NR",
    location: "Micronesia",
    iso: "520",
    capital_city: "Yaren"
  },
  {
    country: "Nepal",
    continent: "Asia",
    abbreviation: "NP",
    location: "Southern and Central Asia",
    iso: "524",
    capital_city: "Kathmandu"
  },
  {
    country: "Netherlands",
    continent: "Europe",
    abbreviation: "NL",
    location: "Western Europe",
    iso: "528",
    capital_city: "Amsterdam"
  },
  {
    country: "Netherlands Antilles",
    continent: "North America",
    abbreviation: "AN",
    location: "Caribbean",
    iso: null,
    capital_city: "Willemstad"
  },
  {
    country: "New Caledonia",
    continent: "Oceania",
    abbreviation: "NC",
    location: "Melanesia",
    iso: "540",
    capital_city: "Noum"
  },
  {
    country: "New Zealand",
    continent: "Oceania",
    abbreviation: "NZ",
    location: "Australia and New Zealand",
    iso: "554",
    capital_city: "Wellington"
  },
  {
    country: "Nicaragua",
    continent: "North America",
    abbreviation: "NI",
    location: "Central America",
    iso: "558",
    capital_city: "Managua"
  },
  {
    country: "Niger",
    continent: "Africa",
    abbreviation: "NE",
    location: "Western Africa",
    iso: "562",
    capital_city: "Niamey"
  },
  {
    country: "Nigeria",
    continent: "Africa",
    abbreviation: "NG",
    location: "Western Africa",
    iso: "566",
    capital_city: "Abuja"
  },
  {
    country: "Niue",
    continent: "Oceania",
    abbreviation: "NU",
    location: "Polynesia",
    iso: "570",
    capital_city: "Alofi"
  },
  {
    country: "Norfolk Island",
    continent: "Oceania",
    abbreviation: "NF",
    location: "Australia and New Zealand",
    iso: "574",
    capital_city: "Kingston"
  },
  {
    country: "Korea, North",
    continent: "Asia",
    abbreviation: "KP",
    location: "Eastern Asia",
    iso: "408",
    capital_city: "Pyongyang"
  },
  {
    country: "Northern Ireland",
    continent: "Europe",
    abbreviation: "GB",
    location: null,
    iso: null,
    capital_city: "Belfast"
  },
  {
    country: "Northern Mariana Islands",
    continent: "Oceania",
    abbreviation: "MP",
    location: "Micronesia",
    iso: "580",
    capital_city: "Garapan"
  },
  {
    country: "Norway",
    continent: "Europe",
    abbreviation: "NO",
    location: "Nordic Countries",
    iso: "578",
    capital_city: "Oslo"
  },
  {
    country: "Oman",
    continent: "Asia",
    abbreviation: "OM",
    location: "Middle East",
    iso: "512",
    capital_city: "Masqat"
  },
  {
    country: "Pakistan",
    continent: "Asia",
    abbreviation: "PK",
    location: "Southern and Central Asia",
    iso: "586",
    capital_city: "Islamabad"
  },
  {
    country: "Palau",
    continent: "Oceania",
    abbreviation: "PW",
    location: "Micronesia",
    iso: "585",
    capital_city: "Koror"
  },
  {
    country: "Palestine",
    continent: "Asia",
    abbreviation: "PS",
    location: "Middle East",
    iso: "275",
    capital_city: "Gaza"
  },
  {
    country: "Panama",
    continent: "North America",
    abbreviation: "PA",
    location: "Central America",
    iso: "591",
    capital_city: "Ciudad de Panam"
  },
  {
    country: "Papua New Guinea",
    continent: "Oceania",
    abbreviation: "PG",
    location: "Melanesia",
    iso: "598",
    capital_city: "Port Moresby"
  },
  {
    country: "Paraguay",
    continent: "South America",
    abbreviation: "PY",
    location: "South America",
    iso: "600",
    capital_city: "Asunci"
  },
  {
    country: "Peru",
    continent: "South America",
    abbreviation: "PE",
    location: "South America",
    iso: "604",
    capital_city: "Lima"
  },
  {
    country: "Philippines",
    continent: "Asia",
    abbreviation: "PH",
    location: "Southeast Asia",
    iso: "608",
    capital_city: "Manila"
  },
  {
    country: "Pitcairn",
    continent: "Oceania",
    abbreviation: "PN",
    location: "Polynesia",
    iso: null,
    capital_city: "Adamstown"
  },
  {
    country: "Poland",
    continent: "Europe",
    abbreviation: "PL",
    location: "Eastern Europe",
    iso: "616",
    capital_city: "Warszawa"
  },
  {
    country: "Portugal",
    continent: "Europe",
    abbreviation: "PT",
    location: "Southern Europe",
    iso: "620",
    capital_city: "Lisboa"
  },
  {
    country: "Puerto Rico",
    continent: "North America",
    abbreviation: "PR",
    location: "Caribbean",
    iso: "630",
    capital_city: "San Juan"
  },
  {
    country: "Qatar",
    continent: "Asia",
    abbreviation: "QA",
    location: "Middle East",
    iso: "634",
    capital_city: "Doha"
  },
  {
    country: "Reunion",
    continent: "Africa",
    abbreviation: "RE",
    location: "Eastern Africa",
    iso: "638",
    capital_city: "Saint-Denis"
  },
  {
    country: "Romania",
    continent: "Europe",
    abbreviation: "RO",
    location: "Eastern Europe",
    iso: "642",
    capital_city: "Bucuresti"
  },
  {
    country: "Russia",
    continent: "Europe",
    abbreviation: "RU",
    location: "Eastern Europe",
    iso: null,
    capital_city: "Moscow"
  },
  {
    country: "Rwanda",
    continent: "Africa",
    abbreviation: "RW",
    location: "Eastern Africa",
    iso: "646",
    capital_city: "Kigali"
  },
  {
    country: "Saint Helena",
    continent: "Africa",
    abbreviation: "SH",
    location: "Western Africa",
    iso: "654",
    capital_city: "Jamestown"
  },
  {
    country: "Saint Kitts and Nevis",
    continent: "North America",
    abbreviation: "KN",
    location: "Caribbean",
    iso: "659",
    capital_city: "Basseterre"
  },
  {
    country: "Saint Lucia",
    continent: "North America",
    abbreviation: "LC",
    location: "Caribbean",
    iso: "662",
    capital_city: "Castries"
  },
  {
    country: "Saint Pierre and Miquelon",
    continent: "North America",
    abbreviation: "PM",
    location: "North America",
    iso: "666",
    capital_city: "Saint-Pierre"
  },
  {
    country: "Saint Vincent and the Grenadines",
    continent: "North America",
    abbreviation: "VC",
    location: "Caribbean",
    iso: "670",
    capital_city: "Kingstown"
  },
  {
    country: "Samoa",
    continent: "Oceania",
    abbreviation: "WS",
    location: "Polynesia",
    iso: "882",
    capital_city: "Apia"
  },
  {
    country: "San Marino",
    continent: "Europe",
    abbreviation: "SM",
    location: "Southern Europe",
    iso: "674",
    capital_city: "San Marino"
  },
  {
    country: "Sao Tome and Principe",
    continent: "Africa",
    abbreviation: "ST",
    location: "Central Africa",
    iso: "678",
    capital_city: "S"
  },
  {
    country: "Saudi Arabia",
    continent: "Asia",
    abbreviation: "SA",
    location: "Middle East",
    iso: "682",
    capital_city: "Riyadh"
  },
  {
    country: "Scotland",
    continent: "Europe",
    location: null,
    iso: null,
    capital_city: "Edinburgh"
  },
  {
    country: "Senegal",
    continent: "Africa",
    abbreviation: "SN",
    location: "Western Africa",
    iso: "686",
    capital_city: "Dakar"
  },
  {
    country: "Seychelles",
    continent: "Africa",
    abbreviation: "SC",
    location: "Eastern Africa",
    iso: "690",
    capital_city: "Victoria"
  },
  {
    country: "Sierra Leone",
    continent: "Africa",
    abbreviation: "SL",
    location: "Western Africa",
    iso: "694",
    capital_city: "Freetown"
  },
  {
    country: "Singapore",
    continent: "Asia",
    abbreviation: "SG",
    location: "Southeast Asia",
    iso: "702",
    capital_city: "Singapore"
  },
  {
    country: "Slovakia",
    continent: "Europe",
    abbreviation: "SK",
    location: "Eastern Europe",
    iso: "703",
    capital_city: "Bratislava"
  },
  {
    country: "Slovenia",
    continent: "Europe",
    abbreviation: "SI",
    location: "Southern Europe",
    iso: "705",
    capital_city: "Ljubljana"
  },
  {
    country: "Solomon Islands",
    continent: "Oceania",
    abbreviation: "SB",
    location: "Melanesia",
    iso: "90",
    capital_city: "Honiara"
  },
  {
    country: "Somalia",
    continent: "Africa",
    abbreviation: "SO",
    location: "Eastern Africa",
    iso: "706",
    capital_city: "Mogadishu"
  },
  {
    country: "South Africa",
    continent: "Africa",
    abbreviation: "ZA",
    location: "Southern Africa",
    iso: "710",
    capital_city: "Pretoria"
  },
  {
    country: "South Georgia and the South Sandwich Islands",
    continent: "Antarctica",
    abbreviation: "GS",
    location: "Antarctica",
    iso: "239",
    capital_city: null
  },
  {
    country: "Korea, South",
    continent: "Asia",
    abbreviation: "KR",
    location: "Eastern Asia",
    iso: "410",
    capital_city: "Seoul"
  },
  {
    country: "South Sudan",
    continent: "Africa",
    abbreviation: "SS",
    location: "Eastern Africa",
    iso: "728",
    capital_city: "Juba"
  },
  {
    country: "Spain",
    continent: "Europe",
    abbreviation: "ES",
    location: "Southern Europe",
    iso: "724",
    capital_city: "Madrid"
  },
  {
    country: "Sri Lanka",
    location: null,
    iso: null,
    capital_city: null
  },
  {
    country: "Sudan",
    continent: "Africa",
    abbreviation: "SD",
    location: "Northern Africa",
    iso: "729",
    capital_city: "Khartum"
  },
  {
    country: "Suriname",
    continent: "South America",
    abbreviation: "SR",
    location: "South America",
    iso: "740",
    capital_city: "Paramaribo"
  },
  {
    country: "Svalbard and Jan Mayen",
    continent: "Europe",
    abbreviation: "SJ",
    location: "Nordic Countries",
    iso: "744",
    capital_city: "Longyearbyen"
  },
  {
    country: "Swaziland",
    continent: "Africa",
    abbreviation: "SZ",
    location: "Southern Africa",
    iso: "748",
    capital_city: "Mbabane"
  },
  {
    country: "Sweden",
    continent: "Europe",
    abbreviation: "SE",
    location: "Nordic Countries",
    iso: "752",
    capital_city: "Stockholm"
  },
  {
    country: "Switzerland",
    continent: "Europe",
    abbreviation: "CH",
    location: "Western Europe",
    iso: "756",
    capital_city: "Bern"
  },
  {
    country: "Syria",
    continent: "Asia",
    abbreviation: "SY",
    location: "Middle East",
    iso: "760",
    capital_city: "Damascus"
  },
  {
    country: "Tajikistan",
    continent: "Asia",
    abbreviation: "TJ",
    location: "Southern and Central Asia",
    iso: "762",
    capital_city: "Dushanbe"
  },
  {
    country: "Tanzania",
    continent: "Africa",
    abbreviation: "TZ",
    location: "Eastern Africa",
    iso: "834",
    capital_city: "Dodoma"
  },
  {
    country: "Thailand",
    continent: "Asia",
    abbreviation: "TH",
    location: "Southeast Asia",
    iso: "764",
    capital_city: "Bangkok"
  },
  {
    country: "The Democratic Republic of Congo",
    continent: "Africa",
    abbreviation: "CD",
    location: null,
    iso: null,
    capital_city: null
  },
  {
    country: "Togo",
    continent: "Africa",
    abbreviation: "TG",
    location: "Western Africa",
    iso: "768",
    capital_city: "Lom"
  },
  {
    country: "Tokelau",
    continent: "Oceania",
    abbreviation: "TK",
    location: "Polynesia",
    iso: "772",
    capital_city: "Fakaofo"
  },
  {
    country: "Tonga",
    continent: "Oceania",
    abbreviation: "TO",
    location: "Polynesia",
    iso: "776",
    capital_city: "Nuku'alofa"
  },
  {
    country: "Trinidad and Tobago",
    continent: "North America",
    abbreviation: "TT",
    location: "Caribbean",
    iso: "780",
    capital_city: "Port-of-Spain"
  },
  {
    country: "Tunisia",
    continent: "Africa",
    abbreviation: "TN",
    location: "Northern Africa",
    iso: "788",
    capital_city: "Tunis"
  },
  {
    country: "Turkey",
    continent: "Asia",
    abbreviation: "TR",
    location: "Middle East",
    iso: "792",
    capital_city: "Ankara"
  },
  {
    country: "Turkmenistan",
    continent: "Asia",
    abbreviation: "TM",
    location: "Southern and Central Asia",
    iso: "795",
    capital_city: "Ashgabat"
  },
  {
    country: "Turks and Caicos Islands",
    continent: "North America",
    abbreviation: "TC",
    location: "Caribbean",
    iso: "796",
    capital_city: "Cockburn Town"
  },
  {
    country: "Tuvalu",
    continent: "Oceania",
    abbreviation: "TV",
    location: "Polynesia",
    iso: "798",
    capital_city: "Funafuti"
  },
  {
    country: "Uganda",
    continent: "Africa",
    abbreviation: "UG",
    location: "Eastern Africa",
    iso: "800",
    capital_city: "Kampala"
  },
  {
    country: "Ukraine",
    continent: "Europe",
    abbreviation: "UA",
    location: "Eastern Europe",
    iso: "804",
    capital_city: "Kyiv"
  },
  {
    country: "United Arab Emirates",
    continent: "Asia",
    abbreviation: "AE",
    location: "Middle East",
    iso: "784",
    capital_city: "Abu Dhabi"
  },
  {
    country: "United Kingdom",
    continent: "Europe",
    abbreviation: "GB",
    location: "British Isles",
    iso: "826",
    capital_city: "London"
  },
  {
    country: "US",
    continent: "North America",
    abbreviation: "US",
    location: "North America",
    iso: "840",
    capital_city: "Washington"
  },
  {
    country: "United States Minor Outlying Islands",
    continent: "Oceania",
    abbreviation: "UM",
    location: "Micronesia/Caribbean",
    iso: null,
    capital_city: null
  },
  {
    country: "Uruguay",
    continent: "South America",
    abbreviation: "UY",
    location: "South America",
    iso: "858",
    capital_city: "Montevideo"
  },
  {
    country: "Uzbekistan",
    continent: "Asia",
    abbreviation: "UZ",
    location: "Southern and Central Asia",
    iso: "860",
    capital_city: "Toskent"
  },
  {
    country: "Vanuatu",
    continent: "Oceania",
    abbreviation: "VU",
    location: "Melanesia",
    iso: "548",
    capital_city: "Port-Vila"
  },
  {
    country: "Venezuela",
    continent: "South America",
    abbreviation: "VE",
    location: "South America",
    iso: "862",
    capital_city: "Caracas"
  },
  {
    country: "Vietnam",
    continent: "Asia",
    abbreviation: "VN",
    location: "Southeast Asia",
    iso: "704",
    capital_city: "Hanoi"
  },
  {
    country: "Virgin Islands, British",
    continent: "North America",
    abbreviation: "VG",
    location: null,
    iso: null,
    capital_city: "Road Town"
  },
  {
    country: "Virgin Islands, U.S.",
    continent: "North America",
    abbreviation: "VI",
    location: null,
    iso: null,
    capital_city: "Charlotte Amalie"
  },
  {
    country: "Wales",
    continent: "Europe",
    location: null,
    iso: null,
    capital_city: "Cardiff"
  },
  {
    country: "Wallis and Futuna",
    continent: "Oceania",
    abbreviation: "WF",
    location: "Polynesia",
    iso: "876",
    capital_city: "Mata-Utu"
  },
  {
    country: "Western Sahara",
    continent: "Africa",
    abbreviation: "EH",
    location: "Northern Africa",
    iso: "732",
    capital_city: "El-Aai"
  },
  {
    country: "Yemen",
    continent: "Asia",
    abbreviation: "YE",
    location: "Middle East",
    iso: "887",
    capital_city: "Sanaa"
  },
  {
    country: "Yugoslavia",
    continent: "Europe",
    abbreviation: "YU",
    location: "Southern Europe",
    iso: null,
    capital_city: "Beograd"
  },
  {
    country: "Zambia",
    continent: "Africa",
    abbreviation: "ZM",
    location: "Eastern Africa",
    iso: "894",
    capital_city: "Lusaka"
  },
  {
    country: "Zimbabwe",
    continent: "Africa",
    abbreviation: "ZW",
    location: "Eastern Africa",
    iso: "716",
    capital_city: "Harare"
  }
]

var locationChoices: ApplicationCommandOptionChoice[] = []

if (!existsSync("./Resources/Covid/locations.json")) {
  continents.forEach(continent => {
    locationChoices.push({ name: continent, value: `_continent${continent}` })
  })

  locationChoices.push(...countries.map(country => {
    return { name: country.country, value: country.country }
  }))

  writeFileSync("./Resources/Covid/locations.json", JSON.stringify(locationChoices, null, 2))
} else {
  locationChoices = JSON.parse(readFileSync("../Resources/Covid/locations.json").toString()) as ApplicationCommandOptionChoice[]
}

export default locationChoices