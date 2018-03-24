import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

const outerWidth = 400
const outerHeight = 250
const radius = 2
const margins = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
}
const $pixelRatio = document.querySelector('#ppx')
const $popupContainer = document.querySelector('#content')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

const svg = d3.select('body').append('svg')
  .attr('width',  outerWidth)
  .attr('height', outerHeight)

const xScale = d3.scaleLinear()
  .range([margins.left, outerWidth - margins.right])
const yScale = d3.scaleLinear()
  .range([outerHeight - margins.top, margins.bottom])
const rScale = d3.scaleSqrt()
const colorScale = d3.scaleLinear().range(['red', 'blue'])

const popupCreator = d =>
`Town: ${d.label},
Population: ${d.population},
lat: ${d.latitude},
long: ${d.longitude}`

const renderPopup = (x, y) => d => {
  $popupContainer.innerText = popupCreator(d)
  $popupContainer.style.transform = `translate(${x(d)}px, ${y(d)}px)`
}

function renderCreator(xCol, yCol, radiusCol, peoplePerPixel, data) {
  const x = R.compose(xScale, xCol)
  const y = R.compose(yScale, yCol)
  const r = R.compose(rScale, radiusCol)
  const fill = R.compose(colorScale, radiusCol)
  const radiusDataExtent = d3.extent(data, radiusCol)

  xScale.domain(d3.extent(data, xCol))
  yScale.domain(d3.extent(data, yCol))
  rScale.domain(radiusDataExtent)
  colorScale.domain(radiusDataExtent)
  const peopleMax = rScale.domain()[1]
  const rMin = 0
  const rMax = Math.sqrt(
    peopleMax / (peoplePerPixel * Math.PI)
  )
  rScale.range([rMin, rMax])

  const circles = svg.selectAll('circle').data(data)

  circles
    .enter()
    .append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', r)
    .attr('fill', fill)
    .on('mouseover', renderPopup(x, y))

  circles
    .exit()
    .transition()
    .duration(2000)
    .attr('r', 0)
    .remove()
}

const type = d => ({
  population: parseInt(d.population),
  latitude: parseFloat(d.latitude),
  longitude: +d.longitude,
  label: d.name
})

d3.csv('public/countries_population.csv', type, data => {
  $pixelRatio.value = 100000
  const render = R.curry(renderCreator)(
    R.prop('longitude'),
    R.prop('latitude'),
    R.prop('population')
  )
  render(
    $pixelRatio.value,
    data
  )
  $pixelRatio.addEventListener('change', (event) => {
    peoplePerPixel = event.target.value
    render(
      $pixelRatio.value,
      data
    )
  })
  $levelFilter.addEventListener('change', event => render(
    $pixelRatio.value,
    data.filter(d => d.population > event.target.value)
  ))
  $townFilter.addEventListener('change', event => render(
    $pixelRatio.value,
    data.filter(d =>
      d.label.slice(0, event.target.value.length) === event.target.value
    )
  ))
})
