import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

import { render } from './View'
import renderBrush from './Brush'

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

  const data = (await (
    await window.fetch('public/geolocs.json')
  ).json()).features

  const radiusDataExtent = d3.extent(data, rCol)
  rScale.domain(radiusDataExtent).range([
    1, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
  ])

  const toRenderViz = render(
    geoProjection,
    _ => 2,
    features
  )
  const toRenderBrush = renderBrush()

  const toRender = data => {
    toRenderBrush(data)
    toRenderViz(data)
  }

  const $scene = d3.select('svg g')
  d3.select('svg').call(d3.zoom().on('zoom', () =>
    $scene.attr('transform', d3.event.transform)
  ))

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
