import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'
import { transform as d3transform } from 'd3-transform'

import { render } from './View'
const $pixelRatio = document.querySelector('#ppx')
const $popupContainer = document.querySelector('#content')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

const type = d => ({
  population: parseInt(d.population),
  latitude: parseFloat(d.latitude),
  longitude: +d.longitude,
  label: d.name
})

d3.csv('public/countries_population.csv', type, data => {
  $pixelRatio.value = 100000
  const toRender = R.curry(render)(
    R.prop('longitude'),
    R.prop('latitude'),
    R.prop('population')
  )
  toRender(
    $pixelRatio.value,
    data
  )
  $pixelRatio.addEventListener('change', (event) => {
    toRender(
      $pixelRatio.value,
      data
    )
  })
  $levelFilter.addEventListener('change', event => toRender(
    $pixelRatio.value,
    data.filter(d => d.population > event.target.value)
  ))
  $townFilter.addEventListener('change', event => toRender(
    $pixelRatio.value,
    data.filter(d =>
      d.label.slice(0, event.target.value.length) === event.target.value
    )
  ))
})
