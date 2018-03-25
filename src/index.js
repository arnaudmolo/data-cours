import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'
import { transform as d3transform } from 'd3-transform'

const outerWidth = 800
const outerHeight = 500
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

const renderPopup = (x, y, container) => (data) => {
  const bar = container.selectAll('g')
    .data(data)

  bar
    .enter()
    .append('g')
    .attr('transform', d => translate(x(d), y(d)))
    .each(function (d) {
      const innerBar = d3.select(this)
      innerBar
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'red')
      innerBar
        .append('text')
        .attr('x', 10)
        .attr('y', 10)
        .attr('dy', '.35em')
        .text(d => d.label)
    })

    bar
      .exit()
      .remove()
}

const translate = (x, y) => `translate(${x}, ${y})`

function renderCreator(xCol, yCol, radiusCol, peoplePerPixel, data) {
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
  const markG = svg.append('g')

  const circlesGroup = svg.append('g')
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
      const el = svg.node()
      var x = d3.event.pageX - el.getBoundingClientRect().x
      var y = d3.event.pageY - el.getBoundingClientRect().y
      renderPopup(_ => x, _ => y, markG)([d])
    })
    .on('mouseleave', _ => renderPopup(x, y, markG)([]))

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
