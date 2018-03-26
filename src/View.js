import * as R from 'ramda'
import * as d3 from 'd3'

const outerWidth = 800
const outerHeight = 500
const radius = 2
const margins = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
}

const translate = (x, y) => `translate(${x}, ${y})`

const svg = d3.select('body').append('svg')
  .attr('width',  outerWidth)
  .attr('height', outerHeight)
const xScale = d3.scaleLinear()
  .range([margins.left, outerWidth - margins.right])
const yScale = d3.scaleLinear()
  .range([outerHeight - margins.top, margins.bottom])
const rScale = d3.scaleSqrt()
const colorScale = d3.scaleLinear().range(['red', 'blue'])

const renderPopup = (x, y, container) => (data) => {
  const bar = container.selectAll('g').data(data)
  const createText = text => s => s
    .append('text')
    .attr('dy', '.35em')
    .text(text)
    .attr('opacity', 0)
    .transition()
    .attr('opacity', 1)

  bar
    .enter()
    .append('g')
    .attr('class', 'popup-container')
    .attr('transform', d => translate(x(d), y(d)))
    .each(function (d) {
      const innerBar = d3.select(this)
      const rect = innerBar
        .append('rect')
        .attr('class', 'popup-background')
        .attr('height', 0)
        .attr('rx', 5)
        .attr('ry', 5)
      const textGroup = innerBar.append('g')
      textGroup.call(createText(d => d.label))
      textGroup.call(createText(d => d.population))
      .attr('x', 20)
      const bbox = textGroup.node().getBoundingClientRect()
      textGroup.attr('transform', translate(- bbox.width / 2, bbox.height / 2))
      const rectWidth = bbox.width + 20
      rect
        .attr('width', rectWidth)
        .attr('x', - rectWidth / 2)
        .transition()
        .attr('height', bbox.height + 20)
    })
    bar
      .exit()
      .remove()
}

function wrap(text, width) {
  text.each(function () {
    const text = d3.select(this)
    const words = text.text().split(/\s+/).reverse()
    let word
    let line = []
    let lineNumber = 0
    const lineHeight = 1.1 // em
    const y = text.attr('y')
    const dy = parseFloat(text.attr('dy'))
    let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em')
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(' '))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
      }
    }
  })
}

export function render(xCol, yCol, radiusCol, peoplePerPixel, data) {
  const x = R.compose(xScale, xCol)
  const y = R.compose(yScale, yCol)
  const r = R.compose(rScale, radiusCol)
  const fill = R.compose(colorScale, radiusCol)
  const radiusDataExtent = d3.extent(data, radiusCol)

  xScale.domain(d3.extent(data, xCol))
  yScale.domain(d3.extent(data, yCol))
  rScale.domain(radiusDataExtent).range([
    0, Math.sqrt(radiusDataExtent[1] / (peoplePerPixel * Math.PI))
  ])
  colorScale.domain(radiusDataExtent)
  const circlesGroup = svg.append('g')
  const markG = svg.append('g')
  const circles = circlesGroup.selectAll('circle').data(data)

  svg.call(d3.zoom().on('zoom', d =>
    circlesGroup.attr('transform', d3.event.transform)
  ))

  circles
    .enter()
    .append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', r)
    .attr('fill', fill)
    .on('mouseenter', function (d) {
      const el = d3.select(this)
      el.transition()
        .duration(100)
        .attr('r', d => r(d) * 2)
      const bbox = svg.node().getBoundingClientRect()
      renderPopup(
        _ => d3.event.pageX - bbox.x,
        _ => d3.event.pageY - bbox.y,
        markG
      )([d])
    })
    .on('mouseleave', function (d) {
      d3.select(this).transition().duration(100).attr('r', r)
      return renderPopup(x, y, markG)([])
    })

  circles
    .exit()
    .transition()
    .duration(2000)
    .attr('r', 0)
    .remove()
}
