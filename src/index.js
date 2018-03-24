import './styles.css'
import * as d3 from 'd3'
const outerWidth = 400
const outerHeight = 250
const radius = 2
const margins = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
}
const peoplePerPixel = 100000
const input = document.querySelector('#ppx')
input.value = peoplePerPixel
const content = document.querySelector('#content')

const svg = d3.select('body').append('svg')
        .attr('width',  outerWidth)
        .attr('height', outerHeight)

const xScale = d3.scaleLinear()
  .range([margins.left, outerWidth - margins.right])
const yScale = d3.scaleLinear()
  .range([outerHeight - margins.top, margins.bottom])
const rScale = d3.scaleSqrt()

function render(xCol, yCol, radiusCol, peoplePerPixel){
  return function (data)  {
    xScale.domain(d3.extent(data, d => d[xCol]))
    yScale.domain(d3.extent(data, d => d[yCol]))
    rScale.domain(d3.extent(data, d => d[radiusCol]))
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
      .attr('cx', d => xScale(d[xCol]))
      .attr('cy', d => yScale(d[yCol]))
      .attr('r', d => rScale(d[radiusCol]))
      .on('mouseover', d => {
        content.innerText = `Town: ${d.label},
        Population: ${d.population},
        lat: ${d.latitude},
        long: ${d.longitude}`
        content.style.transform = `translate(${xScale(d[xCol])}px, ${yScale(d[yCol])}px)`
      })

    circles
      .exit()
      .transition()
      .duration(2000)
      .attr('r', 0)
      .remove()
  }
}

function type(d){
  return {
    population: parseInt(d.population),
    latitude: parseFloat(d.latitude),
    longitude: +d.longitude,
    label: d.name
  }
}

d3.csv('public/countries_population.csv', type, data => {
  render('longitude', 'latitude', 'population', peoplePerPixel)(data)
  input.addEventListener('change', () => {
    const renderVraiment = render(
      'longitude',
      'latitude',
      'population',
      +input.value
    )
    renderVraiment(data)
  })

  document
    .querySelector('#filter')
    .addEventListener('change', function (event) {
      render(
        'longitude',
        'latitude',
        'population',
        peoplePerPixel
      )(data.filter(d => d.population > event.target.value))
    })
    document.querySelector('#town').addEventListener('change', e => {
      const newData = data.filter(d => {
        return d.label.slice(0, e.target.value.length) === e.target.value
      })
      render(
        'longitude',
        'latitude',
        'population',
        peoplePerPixel
      )(newData)
    })
})
