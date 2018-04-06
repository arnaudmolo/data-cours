import './styles.css'
import * as d3 from 'd3'
import moment from 'moment'
import mapboxgl from 'mapbox-gl'
import * as R from 'ramda'

import { render } from './View'
import renderBrush from './Brush'

const type = d => {
  return {
    ...d,
    properties: {
      ...d.properties,
      date: moment(d.properties.createdAt)
    }
  }
}

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
let reducer = (state, data) => {
  const [dateMin, dateMax] = state.selected
  return data.filter(d => {
    return d.properties.date >= dateMin && d.properties.date <= dateMax
  })
}
let state = {
  selected: [new Date(), new Date()]
}
const checkCache = (state) => state.selected.toString()
reducer = R.memoizeWith(checkCache, reducer)

function createLines (map, data) {
  const lines = {
    type: 'FeatureCollection',
    features: data
      .sort((a, b) =>
        a.properties.date > b.properties.date
      )
      .reduce((previous, d, i) => {
        if (!data[i + 1]) {
          return previous
        }
        const next = data[i + 1]
        return [...previous, {
          properties: {
            ...d.properties,
            dateNumber: +d.properties.date
          },
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [d.geometry.coordinates, next.geometry.coordinates]
          }
        }]
      }, [])
  }
  map.on('load', () => {
    map.addSource('fb-lines', {
      type: 'geojson',
      data: lines
    })

    map.addLayer({
      id: 'facebook-roads',
      type: 'line',
      source: 'fb-lines',
      layout: {
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'hsl(154, 44%, 47%)',
        'line-width': 2
      }
    })
  })
}

const startup = async () => {
  const data = (await (
    await window.fetch('public/geolocs.json')
  ).json()).features.map(type)

  state = {
    ...state,
    selected: d3.extent(data, d => d.properties.date)
  }

  function filterBy ([minMonth, maxMonth]) {
    const filters = [
      'all',
      ['>=', 'dateNumber', +minMonth],
      ['<=', 'dateNumber', +maxMonth]
    ]
    map.setFilter('facebook-roads', filters)
  }

  const map = new mapboxgl.Map({
    container: 'content',
    style: 'mapbox://styles/arnaudmolo/cjfk1zs7bejmr2rnypmmdsy4s',
    center: [0.380435, 47.530053],
    zoom: 5.85,
    bearing: 0,
    pitch: 0
  })

  const toRender = render(map)
  createLines(map, reducer(state, data))

  map.on('zoom', () => {
    toRender(reducer(state, data))
  })
  map.on('drag', () => {
    toRender(reducer(state, data))
  })

  renderBrush((mapped) => {
    state = {
      ...state,
      selected: mapped
    }
    toRender(reducer(state, data))
    filterBy(state.selected)
  })(data)

  window.addEventListener('resize', event => {
    toRender(reducer(state, data))
  })

  toRender(reducer(state, data))
}

startup()
