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
const sportiek1 = process.env.sportiek1

const dataSportiek = [[sportiek], [sportiek1]]
const [data1, data2] = await Promise.all(dataSportiek.map(fetchJson))

const dorpen = {}
const skigebieden = {}

data2.forEach(acco => {
  dorpen[acco.accomodationId] = acco.dorp
  skigebieden[acco.accomodationId] = acco.skigebied
})

const data = data1.reduce((acc, item) => {
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
      dorp: dorpen[item.accomodationId],
      skigebied: skigebieden[item.accomodationId],
      variantName: item.variantName,
      complex_name: item.complex_name,
      numberOfBeds: item.numberOfBeds,
      bedrooms: item.bedrooms,
      duration: item.duration,
      number: item.number,
      departurePricePersons: item.departurePricePersons,
      departureDates: [item.departureDate]
    })
  }
  return acc
}, [])

const complexnamen = []
const beds = []
const bedrooms = []

data.forEach(datadingetje => {
  if (!complexnamen.includes(datadingetje.complex_name)) {
    complexnamen.push(datadingetje.complex_name)
  }
  if (!beds.includes(datadingetje.numberOfBeds)) {
    beds.push(datadingetje.numberOfBeds)
  }
  if (!bedrooms.includes(datadingetje.bedrooms)) {
    if (datadingetje.bedrooms != null){
    bedrooms.push(datadingetje.bedrooms)
  }}
})


complexnamen.sort()
beds.sort()


//sort function
function sortData(sort_property){
  data.sort(function (a, b) {
    if (a[sort_property] < b[sort_property]) {
      return -1
    }
    if (a[sort_property] > b[sort_property]) {
      return 1 
    }
    return 0
  })
}

// filter function
  function filterData(filter_property, input){
    return data.filter(a => a[filter_property] == input)
  }

//route
app.get("/", async function (request, response) {
  let sort = request.query.sort || "complex_name"
  let complex_name_input = request.query.complex_name 
  let result = filterData("complex_name", complex_name_input)
  sortData(sort)
  
    response.render("index", { data: result.length > 0 ? result : data, data2: data2, complexnamen: complexnamen, beds: beds, bedrooms: bedrooms})
  })

//poortnummer instellen
app.set("port", 8000)
//start de server
app.listen(app.get("port"), () => {
  console.log(`Application started on http://localhost:${app.get("port")}`)
})

async function fetchJson(urls) {
  return await fetch(urls)
    .then((response) => response.json())
    .catch((error) => error)
}
