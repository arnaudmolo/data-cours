import './styles.css'
import * as d3 from 'd3'
import moment from 'moment'

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function (error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
  d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
// choisir l'echelle de temps, ex: 1998-2018
const reducer = (state, data) => {
  const [dateMin, dateMax] = state.selected
  return data.filter(d => {
    return d.properties.date >= dateMin && d.properties.date <= dateMax
  })
}


// créer l'espace svg dans lequel on dessine le graphe
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 50},
    margin2 = {top: 430, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom
    //g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")



var parseTime = d3.timeParse("%Y-%m-%d")


// dimensionner le scale pour les données, scale linear x = 1980, y = 58
var x = d3.scaleTime()
    .rangeRound([0, width]),
    x2 = d3.scaleTime()
    .rangeRound([0, width])

// dimensionner le scale pour les données, scale linear x = 1980, y = 58
// arrondi
var y = d3.scaleLinear()
    .rangeRound([height, 0]),
    y2 = d3.scaleLinear()
    .rangeRound([height2, 0])


var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);


// documentation line chart
var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); })


var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);


// zoom
var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);



var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.close); });


var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.close); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



// charger un csv
d3.csv("public/FEDFUNDS.csv", function(d) {
  d.date = parseTime(d.DATE);
  d.close = +d.FEDFUNDS;
  return d;
}, function(error, data) {
  if (error) throw error;

// defini la limite avec la date
  x.domain(d3.extent(data, function(d) { return d.date; }))
  y.domain(d3.extent(data, function(d) { return d.close; }))
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);
     
  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)

  // focus du linechart
  focus.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percent")

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2)

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2)

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range())

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom)
})


function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}



function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}