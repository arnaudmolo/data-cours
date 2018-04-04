import * as d3 from 'd3'

// const format = d3.formatPrefix(`.${d3.precisionPrefix(1e5, 1.3e6)}`, 3e6)

// Snippet.
// const translate = (x, y) => `translate(${x}px, ${y}px)`
const monthLegend = document.getElementById('month')
const width = 300
const height = 10

const brushScale = d3.scaleLinear().domain([0, 300]).range([0, 11]).interpolate(d3.interpolateRound)

function createBrush (selection, map) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  function filterBy ([minMonth, maxMonth]) {
    const filters = [
      'all',
      ['>=', 'month', minMonth],
      ['<=', 'month', maxMonth]
    ]
    map.setFilter('points', filters)
    map.setFilter('route', filters)
    monthLegend.innerText = `Timeline from ${months[minMonth]} to ${months[maxMonth]}`
  }
  function brushed (e) {
    filterBy(d3.event.selection.map(brushScale))
  }
  filterBy([0, 11])

  selection
    .append('g')
    .attr('class', 'axis')
    .selectAll('text')
    .data(months)
    .enter()
    .append('text')
    .text(e => e.slice(0, 7))
    .attr('x', (_, i) => brushScale.invert(i))
    .attr('y', 15)

  selection
    .append('g')
    .attr('class', 'brush')
    .call(d3.brushX().on('brush', brushed))
}

export function render (map) {
  // Visualisation canvas.
  const svg = d3.select('#context')
  const $brush = svg.append('g')
  $brush.call(createBrush, map)
  return (data) => {
    // x.domain(d3.extent(data, d => d.createdAt))
  }
}
