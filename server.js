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

const sportiek =
  "https://raw.githubusercontent.com/DikkeTimo/proof-of-concept-Sportiek/main/json/localjssportiek.json";

const datasportiek = [[sportiek]];
const [data1] = await Promise.all(datasportiek.map(fetchJson));
const data = { data1 };

// app.get("/", async function (request, response) {

//   fetchJson(`${process.env.sportiek}`).then((data) => {
//     const allIds = [...new Set(data.map(item => item.accomodationId))]

//     const accomodations = []
//     allIds.forEach(id => {
//       const rows = data.filter(item => {
//         return item.accomodationId === id
//       })
//       if (rows.length) {
//         accomodations[id] = rows
//       }
//     })


//     response.render("index", { data, complex: accomodations })
//   })
// })


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
      duration: item.duration,
      departurePricePersons: item.departurePricePersons,
      departureDates: [item.departureDate]
    });
  }

  return acc;
}, []);

app.get("/", async function (request, response) {
  response.render("index", { data1: data1, filterData: filterData });
});


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