import * as d3 from 'd3'
import moment from 'moment'

import { render } from './View'
import renderBrush from './Brush'

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
      date: moment(d.properties.timestamp * 1000)
    }
  }
}

export const startup = async () => {
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
