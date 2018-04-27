import * as d3 from 'd3'
import moment from 'moment'

const getData = async () => await (await window.fetch('public/facebook/security_and_login_information/account_activity.json')).json()

const transformData = d => {
  return {
    ...d,
    date: moment(d.timestamp * 1000).format('DD/MM/YYYY')
  }
}

const convertDate = date => {
  const parts = date.split('/')
  return new Date(parts[2], parts[1] - 1, parts[0])
}

const countSessions = arr => {
  let _g = {}
  for (let e of arr) {
    if (_g[e.date]) _g[e.date]++
    else _g[e.date] = 1
  }
  const _d = Object.keys(_g)
  const _s = Object.values(_g)
  let res = []
  for (let i in _d) {
    res.push({ date: convertDate(_d[i]), sessions: _s[i]})
  }
  return res
}

const activityEvolution = data => {
  const $chart = document.querySelector('.msg-by-conv')
  
  let svg = d3.select('.activity-evolution'),
    margin = { top: 30, right: 40, bottom: 30, left: 40 },
    width = +$chart.clientWidth - margin.left - margin.right,
    height = +$chart.clientHeight - margin.top - margin.bottom,
    g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let x = d3.scaleTime()
    .rangeRound([0, width])
  
  let y = d3.scaleLinear()
    .rangeRound([height, 0])
  
  let line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.sessions))
  x.domain(d3.extent(data, d => d.date))
  y.domain(d3.extent(data, d => d.sessions))
    
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .select('.domain')
    .remove()

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Nb sessions')

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#98abc5')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', line)

  g.append('text')
    .attr('x', (width / 2))
    .attr('y', 0 - (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Evolution of activity')
}

export const startActivityChart = () => {
  getData().then((data) => {
    data = data.account_activity.map((d) => transformData(d))
    const sessions = countSessions(data)
    activityEvolution(sessions)
  })
}