//import express en .env
import express from "express"
import dotenv from 'dotenv'

//activeer .env
dotenv.config()

//maak een nieuwe express app
const server = express()

//views en public instellen
server.use(express.static("public"))
server.set("view engine", "ejs")
server.set("views", "./views")

//route

server.get("/", (request, response) => {
  let url = `${process.env.API_URL}?page=0`
  fetchJson(url).then((accomodations) => {
      response.render("index", accomodations)
    })
})

//poortnummer instellen
server.set("port", 8000)

//start de server
server.listen(server.get("port"), () => {
  console.log(`Application started on http://localhost:${server.get("port")}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}
