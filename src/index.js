import './styles.css'
import * as d3 from 'd3'
import * as R from 'ramda'

import { render } from './View'
// DEBUT CARTE FRANCE AVEC DEPARTEMENT

var width = 550, height = 550;
// Manipulationd des données d3
var path = d3.geoPath();

// center la map avec la taille
var projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2600)
    .translate([width / 2, height / 2]);

//Projection assigner au path
path.projection(projection);
// selection de l'html #map pour l'affichage
var svg = d3.select('#map').append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height);

var deps = svg.append("g");

// chargement du fichier JSON
d3.json('public/departments.json', function(req, geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path);
});
// Ajout des département

//selectiond de l'élement
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// ajout des département et link du fichier json
d3.json('public/departments.json', function(req, geojson) {
    deps.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr('class', 'department')
        .attr("d", path)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("Département : " + d.properties.NOM_DEPT + "<br>"
                  +  "Région : " + d.properties.NOM_REGION)
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            div.html("")
                .style("left", "0px")
                .style("top", "0px");
        });
});
// simple camenbert


  var data = [
    {"value": 100, "name": "pomme"},
    {"value": 70, "name": "kiwi"},
    {"value": 40, "name": "banane"},
    {"value": 15, "name": "grenade"},
    {"value": 5, "name": "orange"},
    {"value": 1, "name": "clementine"}
  ]
  d3plus.viz()
    .container("#viz")
    .data(data)
    .type("pie")
    .id("name")
    .size("value")
    .draw();

    var data3 = [
      {id: "pomme", x: 4, y:  7},
      {id: "akiwi", x: 5, y: 25},
      {id: "banane", x: 6, y: 13},
      {id: "beta",  x: 4, y: 17},
      {id: "orange",  x: 5, y:  8},
      {id: "clementine",  x: 6, y: 13}
    ];
    new d3plus.BarChart()
    .container("#chart")
    .data(data)
    .render();

/* DEBUT CARTE MONDE
const $pixelRatio = document.querySelector('#ppx')
const $levelFilter = document.querySelector('#filter')
const $townFilter = document.querySelector('#town')

const type = d => ({
  population: parseInt(d.population),
  latitude: parseFloat(d.latitude),
  longitude: +d.longitude,
  label: d.name
})

d3.json('https://unpkg.com/d3-format@1/locale/fr-FR.json', function(error, locale) {
  // Download french formats.
  // Here to show syntax example. Don't do it.
  if (error) throw error
    d3.formatDefaultLocale(locale)
})

// Return different version of the data
// depending on the state of the application.
const reducer = (data) => {
  let result = data
  if ($townFilter.value.length) {
    // DOM values can be slow to read,
    // stocking it in a constant will improve performances.
    const val = $townFilter.value
    result = result.filter(d => d.label.slice(0, val.length) === val)
  }
  if ($levelFilter.value) {
    const val = $levelFilter.value
    result = result.filter(d => d.population > val)
  }
  return result
}

// Download the needed data.
d3.csv('public/countries_population.csv', type, data => {
  // Set default values.
  $pixelRatio.value = 100000
  $levelFilter.value = 0
  $townFilter.value = ''

  const outerWidth = 800
  const outerHeight = 500
  const radius = 2
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }

  // Scales.
  const xScale = d3.scaleLinear()
    .range([margins.left, outerWidth - margins.right])
  const yScale = d3.scaleLinear()
    .range([outerHeight - margins.top, margins.bottom])
  const rScale = d3.scaleSqrt()

  // Create accessors.
  // http://ramdajs.com/docs/#prop
  // Equivalent : d => d['longitude']
  const xCol = R.prop('longitude')
  const yCol = R.prop('latitude')
  const rCol = R.prop('population')

  const radiusDataExtent = d3.extent(data, rCol)

  xScale.domain(d3.extent(data, xCol))
  yScale.domain(d3.extent(data, yCol))
  // Need to fix the rScale domain on a fix point.
  // We don't want the representation to change depending on data.
  rScale.domain(radiusDataExtent).range([
    0, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
  ])

  // Currying the render function to avoid repetition:
  // http://ramdajs.com/docs/#curry
  // Equivalent : (x, y, z) => (data) =>
  const toRender = R.curry(render)(
    // Composition is cool. Seel http://ramdajs.com/docs/#compose
    // Equivalent to : d => xScale(xCol(d))
    R.compose(xScale, xCol),
    R.compose(yScale, yCol),
    R.compose(rScale, rCol)
  )
  toRender(reducer(data))
  $pixelRatio.addEventListener('change', _ => {
    if ($pixelRatio.value.length === 0) {
      $pixelRatio.value = 100000
    }
    rScale.domain(radiusDataExtent).range([
      0, Math.sqrt(radiusDataExtent[1] / ($pixelRatio.value * Math.PI))
    ])
    toRender(reducer(data))
  })
  $levelFilter.addEventListener('change', _ => toRender(
    reducer(data)
  ))
  $townFilter.addEventListener('change', _ => toRender(
    reducer(data)
  ))
})
*/
