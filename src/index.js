import './styles.css'
import * as d3 from 'd3'

import mapboxgl from 'mapbox-gl'
import * as R from 'ramda'
import { render } from './View'
import renderBrush from './Brush'
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkbW9sbyIsImEiOiJjaW5zbjgxYXQwMGowdzdrbGQ5a2NlaGpuIn0.JxCzxWoDULTqfKatKDFg9g'
///utiliser render
d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})


// Return different version of the data
// depending on the state of the application.
let reducer = (state, data) => {

}
let state = {
  selected: [new Date(), new Date()]
}
const checkCache = (state) => state.selected.toString()
reducer = R.memoizeWith(checkCache, reducer)

const type = d => {
  return {
    Latitude: parseInt(d.Latitude),
    Longitude: parseInt(d.Longitude)
  }

}
const startup = async () => {
  let rawdata = await (await window.fetch('public/flight/airports.csv')).text()
  let data = d3.csvParse(rawdata).map(type).filter(d => d.Latitude < 90 && d.Latitude > -90)

//const startup = async () => {
//  const data = await (await window.fetch('public/flight/routes.csv')).text()
//  console.log(d3.csvParse(data))

//const startup = async () => {
//  const data = await (await window.fetch('public/flight/airlines.csv')).text()
//  console.log(d3.csvParse(data))

  const map = new mapboxgl.Map({
    container: 'content',
    style: 'mapbox://styles/arnaudmolo/cjfk1zs7bejmr2rnypmmdsy4s',
    center: [0.380435, 47.530053],
    zoom: 5.85,
    bearing: 0,
    pitch: 0
  })
 render(map)(data)
}



startup()
