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
// Popup container. Styled to follow the svg.
const $popupContainer = document.querySelector('#content')
const format = d3.formatPrefix(`.${d3.precisionPrefix(1e5, 1.3e6)}`, 3e6)

// Snippet.
const translate = (x, y) => `translate(${x}px, ${y}px)`

// Visualisation canvas.
const svg = d3.select('body').append('svg')
  .attr('width',  outerWidth)
  .attr('height', outerHeight)

// Scales.
const xScale = d3.scaleLinear()
  .range([margins.left, outerWidth - margins.right])
const yScale = d3.scaleLinear()
  .range([outerHeight - margins.top, margins.bottom])
const rScale = d3.scaleSqrt()
const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

// Views.
// function creating a snipped line.
const createText = text => selection =>
  selection
    .append('p')
    .text(text)
    .attr('opacity', 0)
    .transition()
    .attr('opacity', 1)

// function creating the Popup.
// argument 1 (x): function that define the x position.
// argument 2 (y): function that define the y position.
// argument 3 (container): dom element to append the element.
// return : a function taking 1 argument (data) to build the popup.
const createPopup = (x, y, container) => (data) => {
  const bar = container.selectAll('div').data(data)
  bar
    .enter()
    .append('div')
    .attr('class', 'popup-container')
    .style('transform', d => translate(x(d), y(d)))
    .each(function (d) {
      // transform a DOM element to d3 selection.
      const el = d3.select(this)
      // Syntax to call a function on a d3 selection.
      el
        .call(createText(d => d.label))
        .call(createText(d => format(d.population)))
    })
    bar
      .exit()
      .remove()
}

// function that render the visualisation.
// argument 1 (xCol): function that define the x of each data.
// argument 2 (yCol): function that define the y of each data.
// argument 3 (radiusCol): function that define the radius of each data.
// argument 4 (peoplePerPixel): function that define the people pet pixel ratio.
// argument 5 (data): data to build the visualisation
// return : a function taking 1 argument (data) to build the popup.
export function render(xCol, yCol, radiusCol, peoplePerPixel, data) {
  // Composition is cool. Seel http://ramdajs.com/docs/#compose
  // Equivalent to : d => xScale(xCol(d))
  const x = R.compose(xScale, xCol)
  const y = R.compose(yScale, yCol)
  const r = R.compose(rScale, radiusCol)
  const fill = R.compose(colorScale, radiusCol)
  const radiusDataExtent = d3.extent(data, radiusCol)

  xScale.domain(d3.extent(data, xCol))
  yScale.domain(d3.extent(data, yCol))
  // Need to fix the rScale domain on a fix point.
  // We don't want the representation to change depending on data.
  rScale.domain(radiusDataExtent).range([
    0, Math.sqrt(radiusDataExtent[1] / (peoplePerPixel * Math.PI))
  ])
  colorScale.domain(radiusDataExtent)

  const circlesGroup = svg.append('g')
  const circles = circlesGroup.selectAll('circle').data(data)

  // D3.zoom plugin: https://github.com/d3/d3-zoom.
  // Detect all zoom events.
  svg.call(d3.zoom().on('zoom', _ =>
    // apply zoom transform to all circles via the containing group.
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
      // Apply a notable interaction.
      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', d => r(d) * 2)
      // Finding the node position on the page to locate the popup.
      const bbox = svg.node().getBoundingClientRect()
      const doc = document.documentElement
      const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
      const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
      createPopup(
        _ => d3.event.pageX - bbox.x - left,
        _ => d3.event.pageY - bbox.y - top,
        d3.select($popupContainer)
      )([d])
    })
    .on('mouseleave', function (d) {
      // Set the normal size and remove the popup
      d3.select(this).transition().duration(100).attr('r', r)
      return createPopup(x, y, d3.select($popupContainer))([])
    })

  circles
    .exit()
    .transition()
    .duration(2000)
    .attr('r', 0)
    .remove()
}
