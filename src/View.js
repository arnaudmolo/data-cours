import * as d3 from 'd3'
/* hidding world
const outerWidth = 800
const outerHeight = 500
// Popup container. Styled to follow the svg.
const $popupContainer = document.querySelector('#content')
const format = d3.formatPrefix(`.${d3.precisionPrefix(1e5, 1.3e6)}`, 3e6)

// Snippet.
const translate = (x, y) => `translate(${x}px, ${y}px)`

// Visualisation canvas.
const svg = d3.select('body').append('svg')
  .attr('width',  outerWidth)
  .attr('height', outerHeight)
const circlesGroup = svg.append('g')

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
// argument 1 (x): function that define the x position of each data.
// argument 2 (y): function that define the y position of each data.
// argument 3 (r): function that define the radius of each data.
// argument 4 (data): data to build the visualisation.
// return : circles d3 selection.
export function render(x, y, r, data) {
  const circles = circlesGroup.selectAll('circle').data(data, r)
  circles
    .exit()
    .transition()
    .duration(2000)
    .attr('r', 0)
    .remove()

  circles
    .enter()
    .append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 0)
    .on('mouseenter', function (d) {
      // Apply a notable interaction.
      d3.select(this)
        .transition()
        .duration(100)
        .attr('r', d => r(d) * 2)
      // Finding the node position on the page to locate the popup.
      const bbox = svg.node().getBoundingClientRect()
      console.log(bbox)
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
    .transition()
    .duration(2000)
    .attr('r', r)

  circles
    .transition()
    .duration(2000)
    .attr('r', r)

  return circles
}*/
