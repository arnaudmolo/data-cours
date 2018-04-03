import './styles.css'
import * as d3 from 'd3'

const type = d => ({
  population: parseInt(d.population),
  latitude: parseFloat(d.latitude),
  longitude: +d.longitude,
  label: d.name
})

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
const reducer = (state) => {
  return state
}

const startup = async () => {
  return d3.csvParse(
    await (
      await window.fetch('public/countries_population.csv')
    ).text()
  ).map(type).filter(e => e)
}

startup()
