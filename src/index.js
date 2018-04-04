import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

import { render } from './View'

const $pixelRatio = document.querySelector('#ppx')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

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
const reducer = (data) => {
  let result = data
  if ($townFilter.value.length) {
    // DOM values can be slow to read,
    // stocking it in a constant will improve performances.
    const val = $townFilter.value
    result = result.filter(d => d.label.slice(0, val.length) === val)
  }
  if ($levelFilter.value > 0) {
    const val = $levelFilter.value
    result = result.filter(d => d.population > val)
  }
  return result
}

const startup = async () => {
  // Set default values.
  $pixelRatio.value = 100000
  $levelFilter.value = 0
  $townFilter.value = ''
  const rCol = R.prop('population')

  // Scales.
  const features = await (
    await window.fetch('/public/world.json')
  ).json()
  const rScale = d3.scaleSqrt()
  // const features = topo.feature(topologie, topologie.objects.departments)
  const geoProjection = d3.geoMercator().scale(1).translate([0, 0]).scale(1960).translate([301.20837411844354, 2046.5388369824584])

  const data = d3.csvParse(
    await (
      await window.fetch('public/countries_population.csv')
    ).text()
  ).map(type).filter(e => e)

  const radiusDataExtent = d3.extent(data, rCol)
  rScale.domain(radiusDataExtent).range([
    1, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
  ])

  const toRender = render(
    geoProjection,
    R.compose(rScale, rCol),
    features
  )

  d3.select('svg')
    .call(d3.zoom().on('zoom', function (d) {
      geoProjection
        .scale(s + d3.event.transform.k * 1000)
        .translate([t[0] + d3.event.transform.x, t[1] + d3.event.transform.y])
      toRender(reducer(data))
    }))

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
}

startup()
