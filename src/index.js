import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

import { render } from './View'

const $pixelRatio = document.querySelector('#ppx')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

console.log('Bienvenue dans l\'app')

const type = d => ({
  population: parseInt(d.population),
  latitude: parseFloat(d.latitude),
  longitude: +d.longitude,
  label: d.name
})

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function(error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
    d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
const reducer = (data) => {
  let result = data
  if ($townFilter.value.length) {
    // DOM values can be slow to read,
    // stocking it in a constant will improve performances.
    const val = $townFilter.value
    result = result.filter(d => d.label.slice(0, val.length) === val)
  }
  if ($levelFilter.value) {
    const val = $levelFilter.value
    result = result.filter(d => d.population > val)
  }
  return result
}

// Download the needed data.
d3.csv('public/countries_population.csv', type, data => {
  // Set default values.
  $pixelRatio.value = 100000
  $levelFilter.value = 0
  $townFilter.value = ''

  const outerWidth = 800
  const outerHeight = 500
  const radius = 2
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }

  // Scales.
  const xScale = d3.scaleLinear()
    .range([margins.left, outerWidth - margins.right])
  const yScale = d3.scaleLinear()
    .range([outerHeight - margins.top, margins.bottom])
  const rScale = d3.scaleSqrt()
  const colorScale = d3.scaleSequential(
    d3.interpolateViridis
  )

  // Create accessors.
  // http://ramdajs.com/docs/#prop
  // Equivalent : d => d['longitude']
  const xCol = R.prop('longitude')
  const yCol = R.prop('latitude')
  const rCol = R.prop('population')

  const radiusDataExtent = d3.extent(data, rCol)

  xScale.domain(d3.extent(data, xCol))
  yScale.domain(d3.extent(data, yCol))
  // Need to fix the rScale domain on a fix point.
  // We don't want the representation to change depending on data.
  rScale.domain(radiusDataExtent).range([
    0, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
  ])
  colorScale.domain(radiusDataExtent)

  // Currying the render function to avoid repetition:
  // http://ramdajs.com/docs/#curry
  // Equivalent : (x, y, z) => (data) =>
  const toRender = R.curry(render)(
    // Composition is cool. Seel http://ramdajs.com/docs/#compose
    // Equivalent to : d => xScale(xCol(d))
    R.compose(xScale, xCol),
    R.compose(yScale, yCol),
    R.compose(rScale, rCol),
    R.compose(colorScale, rCol)
  )
  toRender(reducer(data))
  $pixelRatio.addEventListener('change', _ => {
    if ($pixelRatio.value.length === 0) {
      $pixelRatio.value = 100000
    }
    rScale.domain(radiusDataExtent).range([
      0, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
    ])
    toRender(reducer(data))
  })
  $levelFilter.addEventListener('change', _ => toRender(
    reducer(data)
  ))
  $townFilter.addEventListener('change', _ => toRender(
    reducer(data)
  ))
})
