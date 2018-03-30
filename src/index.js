import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'
import * as topo from 'topojson-client'

import * as cartho from 'd3-geo'

import { render } from './View'

const $pixelRatio = document.querySelector('#ppx')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

const type = d => {
  return {
    createdAt: new Date(d.createdAt),
    latLng: d.latLng,
    label: d.city || 'unknow city'
  }
}

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

  const outerWidth = 800
  const outerHeight = 500

  // Scales.
  const topologie = await (
    await window.fetch('/public/departments-simple.topojson')
  ).json()

  console.log(topologie)

  const features = topo.feature(topologie, topologie.objects.departments)
  const geoProjection = d3.geoMercator().scale(1).translate([0, 0]).scale(1960).translate([301.20837411844354, 2046.5388369824584])

  const toRender = render(
    geoProjection,
    e => 3,
    features,
  )

  const data = (
    await (
      await window.fetch('public/geolocs.json')
    ).json()
  ).map(type).filter(e => e)


  d3.select('svg')
    .call(d3.zoom().on('zoom', function (d) {
      const x = d3.mouse(this)
      geoProjection
        .scale(s + d3.event.transform.k * 1000)
        .translate([t[0] + d3.event.transform.x, t[1] + d3.event.transform.y])
      console.log(
        t[1] + d3.event.transform.y,
        t[1], d3.event.transform.y
      )
      console.log(
        t[0] + d3.event.transform.x,
        t[0], d3.event.transform.x
      )
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
