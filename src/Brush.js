import * as d3 from 'd3'

export default function renderBrush (callback) {
  const margins = {
    left: 10,
    right: 10
  }
  const container = d3.select('#legend')
  const outerWidth = parseInt(container.style('width'))
  const outerHeight = 30
  const svg = container.append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  const x = d3.scaleTime().range([0, outerWidth - margins.left - margins.right])
  const $xAxis = svg.append('g').attr('class', 'xAxis').attr('transform', `translate(${margins.left}, 0)`)
  const xAxis = d3.axisBottom(x)
  const context = svg.append('g')
  context.call(
    d3.brushX().on('brush', () =>
      callback(d3.event.selection.map(x.invert))
    )
  )
  return function render (data) {
    x.domain(d3.extent(data, d => d.properties.date))
    $xAxis
      .attr('class', 'axis axis--x')
      .call(xAxis)
  }
}
