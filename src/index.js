import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'
import moment from 'moment'

import { render } from './View'
import renderBrush from './Brush'

const $pixelRatio = document.querySelector('#ppx')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
const reducer = (state, data) => {
  const [dateMin, dateMax] = state.selected
  return data.filter(d => {
    return d.properties.date >= dateMin && d.properties.date <= dateMax
  })
}

const startup = async () => {
  // Set default values.
  $pixelRatio.value = 100000
  $levelFilter.value = 0
  $townFilter.value = ''
  let state = {
    selected: [new Date(), new Date()]
  }
  const rCol = R.prop('population')

  // Scales.
  const features = await (
    await window.fetch('/public/world.json')
  ).json()
  const rScale = d3.scaleSqrt()
  // const features = topo.feature(topologie, topologie.objects.departments)
  const geoProjection = d3.geoMercator().scale(1).translate([0, 0]).scale(1960).translate([301.20837411844354, 2046.5388369824584])

  const type = d => {
    return {
      ...d,
      properties: {
        ...d.properties,
        date: moment(d.properties.createdAt)
      }
    }
  }

  const data = (await (
    await window.fetch('public/geolocs.json')
  ).json()).features.map(type)

  const radiusDataExtent = d3.extent(data, rCol)
  rScale.domain(radiusDataExtent).range([
    1, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
  ])

  state.selected = d3.extent(data, d => d.properties.date)

  const toRender = render(
    geoProjection,
    _ => 10,
    features
  )
  renderBrush((mapped) => {
    state.selected = mapped
    toRender(reducer(state, data))
    // console.log('brush', mapped, d3.event.selection, toRender)
  })(data)
  const $scene = d3.select('svg g')
  d3.select('svg').call(d3.zoom().on('zoom', () =>
    $scene.attr('transform', d3.event.transform)
  ))

  toRender(reducer(state, data))
}

startup()
