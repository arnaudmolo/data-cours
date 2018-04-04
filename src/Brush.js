import * as d3 from 'd3'

function createBrush (selection, callback) {
  selection
    .call(d3.brushX().on('brush', callback))
}

export default function renderBrush (callback) {
  const outerWidth = 800
  const outerHeight = 30
  const svg = d3.select('body').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  const x = d3.scaleTime().range([0, outerWidth])
  const $xAxis = svg.append('g').attr('class', 'xAxis')
  const xAxis = d3.axisBottom(x)
  const context = svg.append('g')
  return function render (data) {
    context.call(createBrush, callback)
    const xd = d3.extent(data, d => d.properties.createdAt)
    console.log(xd)
    x.domain(xd)
    $xAxis.call(xAxis)
  }
}
