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

const sportiek = process.env.sportiek
const sportiek1 = process.env.sportiek
const dataSportiek = [sportiek]
const dataSportiek1 = [sportiek1]
const [data1] = await Promise.all(dataSportiek.map(fetchJson))
const [data2] = await Promise.all(dataSportiek1.map(fetchJson))
const data = { data1, data2 }



const filterData = data1.reduce((acc, item) => {
  const existingItem = acc.find((el) => el.variantName === item.variantName);

  if (existingItem) {
    // Voeg de huidige datum alleen toe als deze nog niet in de bestaande item is opgenomen
    if (!existingItem.departureDates.includes(item.departureDate)) {
      existingItem.departureDates.push(item.departureDate);
    }
  } else {
    // Voeg een nieuw item toe met de huidige variantName en datum
    acc.push({
      accomodationId: item.accomodationId,
      variantName: item.variantName,
      complex_name: item.complex_name,
      numberOfBeds: item.numberOfBeds,
      bedrooms: item.bedrooms,
      duration: item.duration,
      departurePricePersons: item.departurePricePersons,
      departureDates: [item.departureDate]
    })
  }
  return acc
}, [])

function sort(filter_property){
  // complex_name
  filterData.sort(function (a, b) {
    if (a[filter_property] < b[filter_property]) {
      return -1
    }
    if (a[filter_property] > b[filter_property]) {
      return 1 
    }
    return 0
  })
}

//route
app.get("/", async function (request, response) {
  let filter = request.query.filter || "complex_name"
  sort(filter)
  response.render("index", { filterData: filterData })
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

