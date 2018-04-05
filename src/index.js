import './styles.css'
import * as d3 from 'd3'
import moment from 'moment'

import { render } from './View'
import renderBrush from './Brush'

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

const type = d => {
  return {
    ...d,
    properties: {
      ...d.properties,
      date: moment(d.properties.createdAt)
    }
  }
}

const startup = async () => {
  let state = {
    selected: [new Date(), new Date()]
  }
  const data = (await (
    await window.fetch('public/geolocs.json')
  ).json()).features.map(type)

  state.selected = d3.extent(data, d => d.properties.date)

  const toRender = render(
    _ => 5
  )
  renderBrush((mapped) => {
    state.selected = mapped
    toRender(reducer(state, data))
    // console.log('brush', mapped, d3.event.selection, toRender)
  })(data)
  toRender(reducer(state, data))
}

startup()
