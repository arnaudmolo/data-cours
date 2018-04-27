import * as d3 from 'd3'

const $chart = document.querySelector('.msg-by-conv')
const svg = d3.select('.msg-by-conv'),
  margin = { top: 30, right: 40, bottom: 30, left: 40 },
  width = +$chart.clientWidth - margin.left - margin.right,
  height = +$chart.clientHeight - margin.top - margin.bottom

let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleLinear().rangeRound([height, 0])

let g = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


const getMsgData = async () => {
  let messages = await (await window.fetch('public/messages.json')).json()
  messages.forEach(e => {
    e.nb_messages = e.messages.length
  })
  return messages
}

const getFirstConv = (messages, nb) => {
  messages.sort((a, b) => {
    if (a.nb_messages < b.nb_messages) return 1
    if (a.nb_messages > b.nb_messages) return -1
    return 0
  })
  return messages.slice(0, nb)
}

const msgByConv = data => {
  x.domain(data.map(d => d.title))
  y.domain([0, d3.max(data, d => d.nb_messages)])

  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))

  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)

  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.title))
    .attr('y', d => y(d.nb_messages))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.nb_messages))

  g.append('text')
    .attr('x', (width / 2))
    .attr('y', 0 - (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Top 3 messages by conversation')

}

export const startChart = () => {
  getMsgData().then((data) => {
    const d = getFirstConv(data, 3)
    msgByConv(d)
  })
}
