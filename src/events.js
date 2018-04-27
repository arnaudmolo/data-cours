import * as d3 from 'd3'
import moment from 'moment'

const getData = async () => await (await window.fetch('public/facebook/events/event_responses.json')).json()

export const startEventsChart = () => {
  getData().then((_data) => {
    let data = [
      { group: 'Declined', value: _data.event_responses.events_declined.length },
      { group: 'Interested', value: _data.event_responses.events_interested.length },
      { group: 'Joined', value: _data.event_responses.events_joined.length }
    ]

    const $chart = document.querySelector('.events-responses')
    let svg = d3.select('.events-responses'),
      width = +$chart.clientWidth,
      height = +$chart.clientHeight - 20,
      radius = Math.min(width, height) / 2,
      g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + (height + 40) / 2 + ')')

    let color = d3.scaleOrdinal(['#98abc5', '#8a89a6', '#7b6888'])

    let pie = d3.pie()
      .sort(null)
      .value(function (d) { return d.value })

    let path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0)

    let label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40)

    let arc = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc')
  
    arc.append('path')
      .attr('d', path)
      .attr('fill', function (d) { return color(d.data.group) })
  
    arc.append('text')
      .attr('transform', function (d) { return 'translate(' + label.centroid(d) + ')' })
      .text(function (d) { return d.data.group })

    g.append('text')
      .attr('x', 0)
      .attr('y', -(height/2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Status of events invitation')
  })
}