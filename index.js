import * as d3 from 'd3';

var x = "esperance-de-vie";
var y = "revenu";

d3.json("public/indicator-world.json", function (error, json) {
            if (error) throw error;

            var data = "indicator-world.json"
            var svg = d3.select("body").append("svg")
                .attr("w")
                .attr("h")

            var width = +svg.attr("width")
            var height = +svg.attr("height")
            var margin = {
                top: 75,
                bottom: 55,
                left: 75,
                right: 55
            };

    var yExtent = d3.extent(data, function (d) { return d[y] });

    // returns [xmin,xmax]
    var xEx = d3.extent(data, function (d) { return d[x] })

    // adding buffer
    var xScale = d3.scaleLinear()
        .domain([xEx[0] - 1, xEx[1] + 2])
        .range([margin.left, width - margin.right])

    // adding buffer
    var yScale = d3.scaleLinear()
        .domain([yExtent[0] - 2523, yExtent[1] + 2523])
        .range([height - margin.bottom, margin.top])

    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var dot = svg.selectAll('.dots')
        .data(data)
        .enter().append("circle")
        .attr("class", "dots")
        .attr("r", 4.68)
        .attr("cx", function (d) { return xScale(d[x]) })
        .attr("cy", function (d) { return yScale(d[y]) })
        .on("mouseover", function (d) {
            div.transition()
                .duration(100)
                .style("opacity", ".7");
            div.html(
                "Country: " + d.pays
                + "<br/>" + "esperance de vie: "
                + d.esperance-de-vie
                + "</br>" + "Annual revenu: "
                + d.revenu)
                .style("left",
                    (d3.event.pageX - 50) + "px")
                .style("top",
                    (d3.event.pageY - 60) + "px");
        })
        .on("mouseout", function () {
            div.transition()
                .duration(1500)
                .style("opacity", "0")

        });

    //   svg.append("text")
    //   	.text("D3 works")
    //   	.style("fill","black")
    //   	.attr("x",width/2)
    // 		.attr("y",50);

    // creat x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("fill", "black")
        .attr("transform", "translate(" + [0, height - margin.bottom] + ")")
        .call(xAxis)
        .append('text')
        .attr("y", -3)
        .attr("x", width - margin.left)
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Esperance de vie")

    // create y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "black")
        .attr("transform", "translate(" + [margin.left, 0] + ")")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 7)
        .attr("x", -53)
        .attr("dy", "0.8236em")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("Revenu annuel par habitant");
});


