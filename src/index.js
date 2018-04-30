import './styles.css';
import * as d3 from 'd3';
import {schemeBuPu} from 'd3-scale-chromatic';
import {legendColor} from 'd3-svg-legend';

//console.log('test')
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var path = d3.geoPath();
var projection = d3.geoNaturalEarth1()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

var data = d3.map();
//var year = "1990" 
//(récupérer la valeur de l'année définie dans le html)
var colorScheme = schemeBuPu[8];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([1, 30, 40, 50, 60, 70, 76, 81])
    .range(colorScheme);

var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Légende")


var labels = ['No data', '1-29', '30-39', '40-49', '50-59', '60-69', '70-75', '76-80', '> 80'];
var legend = legendColor()
    .labels(function (d) {
        return labels[d.i];
    })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

d3.queue()
    .defer(d3.json, "public/world-110m.geojson")
    .defer(d3.csv, "public/data-life.csv", function (d) {
        data.set(d.country, d.life);
    })
    .await(ready);

function getData(d) {
    var life = data.get(d.properties.name);
    life = parseInt(life * 100) / 100;
    return { country: d.properties.name, life };
}

function showInfo(d) {
    var Val = getData(d);
    if (Val && Val.life) {
        d3.select("#info p.country").html(Val.country);
        d3.select("#info p.life").html(Val.life);
    } else {
        d3.select("#info p.country").html(d.properties.name);
        d3.select("#info p.life").html("déso, pas de data :D");
    }
}

function ready(error, topo) {
    if (error) throw error;

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
        .attr("fill", function (d) {
            d.life = data.get(d.properties.name) || 0;
            return colorScale(d.life);
        })
        .attr("d", path)
        .on("click", showInfo)
        .on("mouseenter", function (d) {
            d3.select(this).style("stroke", "black");
        })
        .on("mouseleave", function (d) {
            console.log('mouseleave', d)
            d3.select(this).style("stroke", "white");

        })
        .append("title")
        .text("Clique ici")
}

//d3.selection.prototype.moveToFront = function () {
    //return this.each(function () {
        //this.parentNode.appendChild(this);
    //});
    //d3.selection.prototype.moveToBack = function () {
        //return this.each(function () {
            //var firstChild = this.parentNode.firstChild;
            //if (firstChild) {
                //this.parentNode.insertBefore(this, firstChild);
            //}
        //});
    //};
