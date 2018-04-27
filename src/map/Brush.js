import * as d3 from 'd3'

const map = document.querySelector('#content')

export default function renderBrush(callback) {
  const outerWidth = map.clientWidth
  const outerHeight = 30
  const svg = d3.select('#content-container').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
    .attr('class', 'brush-map')
  const x = d3.scaleTime().range([0, outerWidth])
  const $xAxis = svg.append('g').attr('class', 'xAxis')
  const xAxis = d3.axisBottom(x)
  const context = svg.append('g')
  context.call(
    d3.brushX().on('brush', () =>
      callback(d3.event.selection.map(x.invert))
    )
  )
  return function render(data) {
    x.domain(d3.extent(data, d => d.properties.date))
    $xAxis
      .attr('class', 'axis axis--x')
      .call(xAxis)
  }
}