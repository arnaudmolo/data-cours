import * as d3 from 'd3'

function createBrush (selection) {
  selection
    .call(d3.brushX().on('brush', () => {
      console.log('brush')
    }))
}

export default function renderBrush () {
  const outerWidth = 800
  const outerHeight = 30
  const svg = d3.select('body').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  return function render (data) {
    const context = svg.append('g')
    context.call(createBrush)
  }
}
