import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

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
  const radius = 2
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }

  // Scales.
  const geoProjection = cartho.geoOrthographic()
    .translate([outerWidth / 2, outerHeight  / 2])

  // Currying the render function to avoid repetition:
  // http://ramdajs.com/docs/#curry
  // Equivalent : (x, y, z) => (data) =>
  const toRender = render(
    // Composition is cool. Seel http://ramdajs.com/docs/#compose
    // Equivalent to : d => xScale(xCol(d))
    geoProjection,
    e => 1,
    await (
      await window.fetch('/public/world.json')
    ).json(),
  )

  const data = (
    await (
      await window.fetch('public/geolocs.json')
    ).json()
  ).map(type).filter(e => e)

  toRender(reducer(data))

  let m0
  let o0
  d3.select('svg')
    .on('mousedown', d => {
      m0 = [d3.event.pageX, d3.event.pageY]
      o0 = geoProjection.rotate()
      d3.event.preventDefault()
    })
    .on('mousemove', _ => {
      if (m0) {
        const m1 = [d3.event.pageX, d3.event.pageY]
        const o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6]
        o1[1] = o1[1] > 30  ? 30  :
              o1[1] < -30 ? -30 :
              o1[1];
        geoProjection.rotate(o1)
        toRender(reducer(data))
      }
    })
    .on('mouseup', _ => {m0 = undefined})
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
