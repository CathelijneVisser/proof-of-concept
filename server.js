// Import the required modules
import express from "express"
import dotenv from 'dotenv'

// Create a new Express app
const app = express()
dotenv.config()

// Set EJS as the template engine and specify the views directory
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the public directory
app.use(express.static("public"))

app.get("/", async function (request, response) {

  fetchJson(`${process.env.sportiek}`).then((data) => {
    response.render("index", { data: data })
  })
})

//poortnummer instellen
app.set("port", 8000)
//start de server
app.listen(app.get("port"), () => {
  console.log(`Application started on http://localhost:${app.get("port")}`)
})

async function fetchJson(urls) {
  return await fetch(`${process.env.sportiek}`)
    .then((response) => response.json())
    .catch((error) => error)
}