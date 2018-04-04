import * as d3 from 'd3'
import * as R from 'ramda'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkbW9sbyIsImEiOiJjaW5zbjgxYXQwMGowdzdrbGQ5a2NlaGpuIn0.JxCzxWoDULTqfKatKDFg9g'

const outerWidth = 800
const outerHeight = 500
// Popup container. Styled to follow the svg.

// Snippet.
const translate = (x, y) => `translate(${x}px, ${y}px)`

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
const createPopup = (x, y, container) => (data) => {
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
        .call(createText(d => d.properties.city))
        .call(createText(d => d.properties.date.format('dddd, MMMM Do YYYY, H:mm:ss')))
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
export function render () {
  const map = new mapboxgl.Map({
    container: 'content',
    style: 'mapbox://styles/arnaudmolo/cjfk1zs7bejmr2rnypmmdsy4s',
    center: [0.380435, 47.530053],
    zoom: 5.85,
    bearing: 0,
    pitch: 0
  })

  function mapboxProjection (lonlat) {
    const p = map.project(new mapboxgl.LngLat(lonlat[0], lonlat[1]))
    return [p.x, p.y]
  }

  const mapContainer = map.getCanvasContainer()

  const x = d => mapboxProjection(d.geometry.coordinates)[0]
  const y = d => mapboxProjection(d.geometry.coordinates)[1]

  // Visualisation canvas.
  const svg = d3.select(mapContainer).append('svg').attr('class', 'circles--container')

  const circlesGroup = svg.append('g')
  let _data = []
  map.on('zoom', () => {
    render(_data)
  })
  map.on('drag', () => {
    render(_data)
  })

  const render = (data) => {
    _data = data
    const circles = circlesGroup.selectAll('circle').data(data)

    circles
      .enter()
      .append('circle')
      .attr('fill', 'cyan')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 5)
      .on('mouseenter', function (d) {
        // Apply a notable interaction.
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 10)
        // Finding the node position on the page to locate the popup.
        const bbox = svg.node().getBoundingClientRect()
        const doc = document.documentElement
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        createPopup(
          _ => d3.event.pageX - bbox.x - left,
          _ => d3.event.pageY - bbox.y - top
        )([d])
      })
      .on('mouseleave', function (d) {
        // Set the normal size and remove the popup
        d3.select(this).transition().duration(100).attr('r', 5)
      })

    circles
      .exit()
      .transition()
      .duration(600)
      .attr('r', 0)
      .remove()

    circles
      .attr('cx', x)
      .attr('cy', y)

    return map
  }
  return render
}
