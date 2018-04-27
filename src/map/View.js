import * as d3 from 'd3'
import * as R from 'ramda'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaG9rIiwiYSI6ImNpcTE5djVkMDAwMnBoc20yYTNuaTdoOHUifQ.ihGqP7NO2XJv97AhsBONZg'

// Popup container. Styled to follow the svg.
const $popupContainer = document.querySelector('#content')

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
export function render(r) {
  const map = new mapboxgl.Map({
    container: 'content',
    style: 'mapbox://styles/mapbox/light-v9'
  })
  // Visualisation canvas.
  const svg = d3.select(map.getCanvasContainer())
    .append('svg')
    .attr('class', 'circles--container')

  function mapBoxProjection(lonlat) {
    const p = map.project(new mapboxgl.LngLat(lonlat[0], lonlat[1]))
    return [p.x, p.y]
  }

  const x = d => mapBoxProjection(d.geometry.coordinates)[0]
  const y = d => mapBoxProjection(d.geometry.coordinates)[1]

  const circlesGroup = svg.append('g')

  let _data = []
  map.on('zoom', () => render(_data))
  map.on('drag', () => render(_data))

  const render = (data) => {
    _data = data

    const circles = circlesGroup.selectAll('circle').data(data)

    circles
      .enter()
      .append('circle')
      .attr('fill', '#7b6888')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r)
      .on('mouseenter', function (d) {
        // Apply a notable interaction.
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', d => r(d) * 2)
      })
      .on('mouseleave', function (d) {
        // Set the normal size
        d3.select(this).transition().duration(100).attr('r', r)
      })

    circles
      .exit()
      .transition()
      .duration(2000)
      .attr('r', 0)
      .remove()

    circles
      .attr('cx', x)
      .attr('cy', y)
  }

  return render
}