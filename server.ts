import { createWriteStream } from "fs"
import * as express from "express"
import * as morgan from "morgan"

const server = express()
const port = 3032

var httplog = createWriteStream("./logs/http.log", { flags: "a" })
server.use(morgan("[:date[web]] \":method :url\" :status :user-agent", { stream: httplog }))

server.all("/", (_, res) => {
  res.send("Website coming in the future\nStay tuned")
})

function keepAlive() {
  server.listen(port, () => {console.log("Server is Ready!")})
}

export default keepAlive
