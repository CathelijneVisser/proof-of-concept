// Import
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
    const allIds = [...new Set(data.map(item => item.accomodationId))]

    const accomodations = []
    allIds.forEach(id => {
      const rows = data.filter(item => {
        return item.accomodationId === id;
      })
      if (rows.length) {
        accomodations[id] = rows
      }
    })


    response.render("index", { data, accomodations: accomodations })
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