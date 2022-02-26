const morgan = require("morgan")
const express = require("express")
const { createWriteStream } = require("fs")
const { nordChalk } = require("./other/misc")

const server = express()
const port = 3032

var httplog = createWriteStream("./logs/http.log", { flags: "a" })
server.use(morgan("[:date[web]] \":method :url\" :status :user-agent", { stream: httplog }))

server.all("/", (_, res) => {
  res.send("Website coming in the future\nStay tuned")
})

function keepAlive() {
  server.listen(port, () => {
    logTime = new Date().toLocaleString("default", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
  
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 2
    }).replace(",", "")

    console.log(`${nordChalk.blue(`${logTime} ${nordChalk.info("INFO")}  | ${nordChalk.bright.cyan("[Server]")} Ready`)}`)
  })
}

module.exports = keepAlive
