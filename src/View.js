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
const $popupContainer = document.querySelector('#content')

const translate = (x, y) => `translate(${x}px, ${y}px)`

const svg = d3.select('body').append('svg')
  .attr('width',  outerWidth)
  .attr('height', outerHeight)
const xScale = d3.scaleLinear()
  .range([margins.left, outerWidth - margins.right])
const yScale = d3.scaleLinear()
  .range([outerHeight - margins.top, margins.bottom])
const rScale = d3.scaleSqrt()
const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
const createText = text => selection =>
  selection
    .append('p')
    .text(text)
    .attr('opacity', 0)
    .transition()
    .attr('opacity', 1)

const renderPopup = (x, y, container) => (data) => {
  const bar = container.selectAll('div').data(data)
  bar
    .enter()
    .append('div')
    .attr('class', 'popup-container')
    .style('transform', d => translate(x(d), y(d)))
    .each(function (d) {
      const innerBar = d3.select(this)
      innerBar.call(createText(d => d.label))
      const format = d3.formatPrefix(`.${d3.precisionPrefix(1e5, 1.3e6)}`, 3e6)
      innerBar.call(createText(d => format(d.population)))
    })
    bar
      .exit()
      .remove()
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

  svg.call(d3.zoom().on('zoom', _ =>
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
      const doc = document.documentElement
      const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
      renderPopup(
        _ => d3.event.pageX - bbox.x - left,
        _ => d3.event.pageY - bbox.y - top,
        d3.select($popupContainer)
      )([d])
    })
    .on('mouseleave', function (d) {
      d3.select(this).transition().duration(100).attr('r', r)
      return renderPopup(x, y, d3.select($popupContainer))([])
    })

  circles
    .exit()
    .transition()
    .duration(2000)
    .attr('r', 0)
    .remove()
}
