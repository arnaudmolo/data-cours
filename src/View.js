import * as d3 from 'd3'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkbW9sbyIsImEiOiJjaW5zbjgxYXQwMGowdzdrbGQ5a2NlaGpuIn0.JxCzxWoDULTqfKatKDFg9g'

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

const createPopup = properties => {
  let town = ``
  let app = ``
  let date = ``
  if (properties.city) {
    town = `<p>Ville: ${properties.city}</p>`
  }
  if (properties.app) {
    app = `<p>Captured by ${properties.app}</p>`
  }
  if (properties.date) {
    date = `<p>${properties.date.format('dddd, MMMM Do YYYY, H:mm:ss')}</p>`
  }
  return `<div>
  ${town} ${app} ${date}
</div>`
}

// function that render the visualisation.
// argument 1 (x): function that define the x position of each data.
// argument 2 (y): function that define the y position of each data.
// argument 3 (r): function that define the radius of each data.
// argument 4 (data): data to build the visualisation.
// return : circles d3 selection.
export function render (map) {

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

  const render = (data) => {
    const circles = circlesGroup.selectAll('circle').data(data)
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    })

    circles
      .enter()
      .append('circle')
      .attr('fill', 'cyan')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 3)
      .on('mouseenter', function (e) {
        // Apply a notable interaction.
        d3.select(this)
          .transition()
          .duration(100)
          .attr('r', 10)
        const coordinates = e.geometry.coordinates.slice()

        popup
          .setLngLat(coordinates)
          .setHTML(createPopup(e.properties))
          .addTo(map)
      })
      .on('mouseleave', function (d) {
        // Set the normal size and remove the popup
        popup.remove()
        d3.select(this).transition().duration(100).attr('r', 3)
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
