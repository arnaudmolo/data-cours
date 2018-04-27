
import './styles.css'
import * as d3 from 'd3'
import * as topojson from "topojson-client"


    //
    // d3.json("public/emplacement_des_gares_idf_data_generalisee.json", function(data) {
    // //  console.log(data.objects.emplacement_des_gares_idf_data_generalisee);
    //
    //   console.log(data.objects.emplacement_des_gares_idf_data_generalisee.geometries[0].properties.geo_point_2d[0]);
    // });

//
//     var width = 400;
//     var height = 500;
//
//     var svg = d3.select("body").append("svg")
//
//     var projection = d3.geoMercator();
//
//     projection .scale(width/3.5)
//              //.center([-98.5, 39.5])
//               .translate([width / 2, height / 2])
//
//     var path = d3.geoPath().projection(projection);
//
//     var url = "public/emplacement_des_gares_idf_data_generalisee.json";
//
// d3.json(url, function(error, world) {
//   if (error) throw error;
//
//     svg.selectAll("path")
//        .data(topojson.feature(world, world.objects.emplacement_des_gares_idf_data_generalisee).features)
//        .enter().append("path")
//       .attr("d", path)
//     //  .attr("d", function (d) { console.log("Nom : "+d.properties.nom_long); return path; })
//        .on('mouseover', function(d){
//    			var name = d.properties.nom_long;
//
//    			return document.querySelector('#content').innerHTML=name;
//    		});
//
// });


var height = 400;
     var width  = 800;
              var map = new google.maps.Map(d3.select("#map").node(), {
       zoom: 11,
       center: new google.maps.LatLng(48.864716, 2.349014),
       mapTypeId: google.maps.MapTypeId.ROADMAP
     });

     var dataLayer = new google.maps.Data();
    //   dataLayer.loadGeoJson('public/emplacement_des_gares_idf_data_generalisee.geojson');
       dataLayer.setMap(map);

     // var vis = d3.select("body").append("svg")
     //     .attr("width", width).attr("height", height)

              d3.json("public/schema_trace_fermetrotram-gf.geojson", function(json) {

         console.log(json);

                  var projection = d3.geoProjection(function(x, y) { return [x, y];})
                    .precision(0).scale(1).translate([0, 0]);

                  var path = d3.geoPath().projection(projection);

                  var bounds = path.bounds(json),
                      scale  = 1.05 / Math.max((bounds[1][0] - bounds[0][0]) / width,
                              (bounds[1][1] - bounds[0][1]) / height),
                      transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2,
                              (height - scale * (bounds[1][1] + bounds[0][1])) / 2];

                  projection.scale(scale).translate(transl);

                  vis.selectAll("path")
                    .data(json.features).enter().append("path")
                    .attr("d", path)
                    .style("fill", "none")
               //     .style("stroke-width", "1.5px")
                    .style("stroke-width", function(d){
                      var mode = d.properties.mode ;
         //console.log(mode);
                      if (mode == "METRO")
                       return "1.5px";
                      else if (mode == "RER")
                      return "2.5px";
                      else if (mode == "TRAMWAY")
                      return "1px";
                      else if (mode == "TRAIN")
                      return "3.5px";
                      else
                        return "none";
                    })
                    .style("stroke", function(d){
                      var ligne = d.properties.ligne ;
                 //    console.log(ligne);
                     if (ligne == "1")
                      return "#fece00";
                     else if (ligne == "2")
                     return "#0065ae" ;
                     else if (ligne == "3")
                     return "#a19818" ;
                     else if (ligne == "3bis")
                     return "#99d4de" ;
                     else if (ligne == "4")
                     return "#be418d" ;
                     else if (ligne == "5")
                     return "#f19043" ;
                     else if (ligne == "6")
                     return "#84c28e" ;
                     else if (ligne == "7")
                     return "#f2a4b6" ;
                     else if (ligne == "7bis")
                     return "#84c28e" ;
                     else if (ligne == "8")
                     return "#cdaccf" ;
                     else if (ligne == "9")
                     return "#d5c900" ;
                     else if (ligne == "10")
                     return "#e4b427" ;
                     else if (ligne == "11")
                     return "#8c5e24" ;
                     else if (ligne == "12")
                     return "#007e49" ;
                     else if (ligne == "13")
                     return "#99d4de" ;
                     else if (ligne == "14")
                     return "#622181" ;

                     else if (ligne == "A")
                     return "#d1302f" ;
                     else if (ligne == "B")
                     return "#427dbd" ;
                     else if (ligne == "C")
                     return "#fcd946" ;
                     else if (ligne == "D")
                     return "#5e9620" ;
                     else if (ligne == "E")
                     return "#bd76a1" ;

                     else if (ligne == "T1")
                     return "#0055c8" ;
                     else if (ligne == "T2")
                     return "#a0006e" ;
                     else if (ligne == "T3A")
                     return "#ff5a00" ;
                     else if (ligne == "T3B")
                     return "#009641" ;
                     else if (ligne == "T4")
                     return "#f2af00" ;
                     else if (ligne == "T5")
                     return "#640082" ;
                     else if (ligne == "T6")
                     return "#ff1400" ;
                     else if (ligne == "T7")
                     return "#6e491e" ;
                     else if (ligne == "T8")
                     return "#6e6e00" ;

                     else if (ligne == "H")
                     return "#7B4339" ;
                     else if (ligne == "J")
                     return "#CDCD00" ;
                     else if (ligne == "K")
                     return "#C7B300" ;
                     else if (ligne == "L")
                     return "#7584BC" ;
                     else if (ligne == "N")
                     return "#00A092" ;
                     else if (ligne == "P")
                     return "#F0B600" ;
                     else if (ligne == "R")
                     return "#E4B4D1" ;
                     else if (ligne == "U")
                     return "#D60058" ;



                      else return "none";
                    }
                  )

                           .on('mouseover', function(d){
                       			var name = d.properties.ligne

                       			return document.querySelector('#content').innerHTML=name;
                       		});
                });





//          var map = new google.maps.Map(d3.select("#map").node(), {
//   zoom: 11,
//   center: new google.maps.LatLng(48.864716, 2.349014),
//   mapTypeId: google.maps.MapTypeId.ROADMAP
// });
//
// var dataLayer = new google.maps.Data();
//   dataLayer.loadGeoJson('public/emplacement_des_gares_idf_data_generalisee.geojson');
//   dataLayer.setMap(map);
// Load the station data. When the data comes back, create an overlay.
// d3.json("public/emplacement_des_gares_idf_data_generalisee.geojson", function(data) {
//   //if (error) throw error;
//
//   var overlay = new google.maps.OverlayView();
//
//   // Add the container when the overlay is added to the map.
//   overlay.onAdd = function() {
//     var layer = d3.select(this.getPanes().overlayLayer).append("div")
//         .attr("class", "stations");
//
//     // Draw each marker as a separate SVG element.
//     // We could use a single SVG, but what size would it have?
//     overlay.draw = function() {
//       var projection = this.getProjection(),
//           padding = 10;
//
//       var marker = layer.selectAll("svg")
//           .data(data.properties)
//         //  .each(transform) // update existing markers
//         .enter().append("svg")
//           .each(transform)
//           .attr("class", "marker");
//
//       // Add a circle.
//       marker.append("circle")
//           .attr("r", 4.5)
//           .attr("cx", padding)
//           .attr("cy", padding);
//
//       // Add a label.
//       marker.append("text")
//           .attr("x", padding + 7)
//           .attr("y", padding)
//           .attr("dy", ".31em")
//           .text(function(d) { return d.properties.label; });
//
//       function transform(d) {
//         d = new google.maps.LatLng(d.properties.geo_point_2d[0], d.properties.geo_point_2d[1]);
//         d = projection.fromLatLngToDivPixel(d);
//         return d3.select(this)
//             .style("left", (d.x - padding) + "px")
//             .style("top", (d.y - padding) + "px");
//       }
//     };
//   };
//
//   // Bind our overlay to the map…
//   overlay.setMap(map);
// });

        //
        //  d3.json("public/emplacement_des_gares_idf_data_generalisee.geojson", function(json) {
        //
        // console.log(json);
        //
        //      var projection = d3.geoProjection(function(x, y) { return [x, y];})
        //        .precision(0).scale(1).translate([0, 0]);
        //
        //      var path = d3.geoPath().projection(projection);
        //
        //      var bounds = path.bounds(json),
        //          scale  = 1.05 / Math.max((bounds[1][0] - bounds[0][0]) / width,
        //                  (bounds[1][1] - bounds[0][1]) / height),
        //          transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2,
        //                  (height - scale * (bounds[1][1] + bounds[0][1])) / 2];
        //
        //      projection.scale(scale).translate(transl);
        //
        //      vis.selectAll("path")
        //        .data(json.features).enter().append("path")
        //        .attr("d", path)
        //        .style("fill", "none")
        //       .style("stroke-width", "1px")
        // //        .style("stroke-width", function(d){
        // //          var mode = d.properties.mode ;
        // // //console.log(mode);
        // //          if (mode == "METRO")
        // //           return "1.5px";
        // //          else if (mode == "RER")
        // //          return "2.5px";
        // //          else if (mode == "TRAMWAY")
        // //          return "1px";
        // //          else if (mode == "TRAIN")
        // //          return "3.5px";
        // //          else
        // //            return "none";
        // //        })
        //        .style("stroke", function(d){
        //          var gare = d.properties.label ;
        //     //  console.log(gare);
        //         // if (ligne == "1")
        //         //  return "#fece00";
        //         //
        //         //
        //         //
        //         //
        //         //  else
        //         return "black";
        //        }
        //      )
        //
        //               .on('mouseover', function(d){
        //                 var gare = d.properties.nom_long ;
        //                 console.log(gare);
        //
        //                 return document.querySelector('#content').innerHTML=gare;
        //               });
        //    });
        //
        //






//
// const $popupContainer = document.querySelector('#content')
//
//
// const popupCreator = d =>
// `Gare: ${d.label},
// Ligne: ${d.res_com},
// Pos: ${d.geo_point_2d}`
//
// const renderPopup = d => {
//   $popupContainer.innerText = popupCreator(d)
// //  $popupContainer.style.transform = `translate(${x(d)}px, ${y(d)}px)`
// }
//
//
//     var width = 960,
//         height = 500;
//
//     // set projection
//     var projection = d3.geoMercator();
//
//     //  	set projection parameters
//         projection
//           .scale(1)
//       //    .center([-98.5, 39.5])
//           .translate([width / 2, height / 2])
//
//
//     // create path variable
//     var path = d3.geoPath()
//         .projection(projection);
//
//
//
//
//
//
//     d3.json("public/emplacement_des_gares_idf_data_generalisee.json", function(error, topo) { console.log(topo);
//
//
// // console.log(topo.objects.emplacement_des_gares_idf_data_generalisee.geometries[0].properties.geo_point_2d);
//
//  var positions = topo.objects.emplacement_des_gares_idf_data_generalisee.geometries
//
//    var  	gares = topojson.feature(topo, topo.objects.emplacement_des_gares_idf_data_generalisee).features
// console.log("Positions : "+positions);
// //console.log("Gares : "+gares);
//
//
//
//
//         // create svg variable
//         var svg = d3.select("body").append("svg")
//         				.attr("width", width)
//         				.attr("height", height);
//
//
//         svg.selectAll("circle")
//     		// .data(positions)
//         // .enter()
//     		// .append("circle")
//     		// .attr("cx", function (d) { console.log(projection(d.properties.geo_point_2d)[0]); return projection(d.properties.geo_point_2d)[0]; })
//     		// .attr("cy", function (d) {console.log(projection(d.properties.geo_point_2d)[1]); return projection(d.properties.geo_point_2d)[1]; })
//     		// .attr("r", "8px")
//     		// .attr("fill", "red")
//   //      .on('mouseover', renderPopup)
//   .data(topojson.feature(topo, topo.objects.emplacement_des_gares_idf_data_generalisee).features)
// 		.enter()
// 		.append('path')
// 		//.attr('class', 'states')
// 		.attr('d', path)
//         .on('mouseover', function(d){
// 			var name = d.properties.STATE_ABBR;
// 			return document.querySelector('#content').innerHTML=name;
// 		});
//
//     });
//
//
//





// import './styles.css'
// import * as d3 from 'd3'
// import * as R from 'ramda'
//
// import * as topojson from "topojson-client"
//
//
//
//
//
// var width  = 600;
//   var height = 800;
//
//   var vis = d3.select("#content").append("svg")
//       .attr("width", width).attr("height", height)
//
//   d3.json("public/emplacement_des_gares_idf_data_generalisee.json", function(json) {
//       // create a first guess for the projection
//
//
// var gares = topojson.feature(json, json.objects.emplacement_des_gares_idf_data_generalisee);
//
// console.log(gares);
//
//       var center = d3.geoCentroid(json)
//       var scale  = 150;
//       var offset = [width/2, height/2];
//       var projection = d3.geoMercator().scale(scale).center(center)
//           .translate(offset);
//
//       // create the path
//       var path = d3.geoPath().projection(projection);
//
//       // using the path determine the bounds of the current map and use
//       // these to determine better values for the scale and translation
//       var bounds  = path.bounds(json);
//       var hscale  = scale*width  / (bounds[1][0] - bounds[0][0]);
//       var vscale  = scale*height / (bounds[1][1] - bounds[0][1]);
//       var scale   = (hscale < vscale) ? hscale : vscale;
//       var offset  = [width - (bounds[0][0] + bounds[1][0])/2,
//                         height - (bounds[0][1] + bounds[1][1])/2];
//
//       // new projection
//       projection = d3.geoMercator().center(center)
//         .scale(scale).translate(offset);
//       path = path.projection(projection);
//
//       // add a rectangle to see the bound of the svg
//       vis.append("rect").attr('width', width).attr('height', height)
//         .style('stroke', 'black').style('fill', 'none');
//
//       vis.selectAll("path")
//
//         .data(json)
//         .enter()
//         .append("path")
//         .attr("d", path)
//         .style("fill", "red")
//         .style("stroke-width", "1")
//         .style("stroke", "black")
//     }
//
//
//   );

////////
     d3.json("public/schema_trace_fermetrotram-gf.geojson", function(json) {

console.log(json);

         var projection = d3.geoProjection(function(x, y) { return [x, y];})
           .precision(0).scale(1).translate([0, 0]);

         var path = d3.geoPath().projection(projection);

         var bounds = path.bounds(json),
             scale  = 1.05 / Math.max((bounds[1][0] - bounds[0][0]) / width,
                     (bounds[1][1] - bounds[0][1]) / height),
             transl = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2,
                     (height - scale * (bounds[1][1] + bounds[0][1])) / 2];

         projection.scale(scale).translate(transl);

         vis.selectAll("path")
           .data(json.features).enter().append("path")
           .attr("d", path)
           .style("fill", "none")
      //     .style("stroke-width", "1.5px")
           .style("stroke-width", function(d){
             var mode = d.properties.mode ;
//console.log(mode);
             if (mode == "METRO")
              return "1.5px";
             else if (mode == "RER")
             return "2.5px";
             else if (mode == "TRAMWAY")
             return "1px";
             else if (mode == "TRAIN")
             return "3.5px";
             else
               return "none";
           })
           .style("stroke", function(d){
             var ligne = d.properties.ligne ;
        //    console.log(ligne);
            if (ligne == "1")
             return "#fece00";
            else if (ligne == "2")
            return "#0065ae" ;
            else if (ligne == "3")
            return "#a19818" ;
            else if (ligne == "3bis")
            return "#99d4de" ;
            else if (ligne == "4")
            return "#be418d" ;
            else if (ligne == "5")
            return "#f19043" ;
            else if (ligne == "6")
            return "#84c28e" ;
            else if (ligne == "7")
            return "#f2a4b6" ;
            else if (ligne == "7bis")
            return "#84c28e" ;
            else if (ligne == "8")
            return "#cdaccf" ;
            else if (ligne == "9")
            return "#d5c900" ;
            else if (ligne == "10")
            return "#e4b427" ;
            else if (ligne == "11")
            return "#8c5e24" ;
            else if (ligne == "12")
            return "#007e49" ;
            else if (ligne == "13")
            return "#99d4de" ;
            else if (ligne == "14")
            return "#622181" ;

            else if (ligne == "A")
            return "#d1302f" ;
            else if (ligne == "B")
            return "#427dbd" ;
            else if (ligne == "C")
            return "#fcd946" ;
            else if (ligne == "D")
            return "#5e9620" ;
            else if (ligne == "E")
            return "#bd76a1" ;

            else if (ligne == "T1")
            return "#0055c8" ;
            else if (ligne == "T2")
            return "#a0006e" ;
            else if (ligne == "T3A")
            return "#ff5a00" ;
            else if (ligne == "T3B")
            return "#009641" ;
            else if (ligne == "T4")
            return "#f2af00" ;
            else if (ligne == "T5")
            return "#640082" ;
            else if (ligne == "T6")
            return "#ff1400" ;
            else if (ligne == "T7")
            return "#6e491e" ;
            else if (ligne == "T8")
            return "#6e6e00" ;

            else if (ligne == "H")
            return "#7B4339" ;
            else if (ligne == "J")
            return "#CDCD00" ;
            else if (ligne == "K")
            return "#C7B300" ;
            else if (ligne == "L")
            return "#7584BC" ;
            else if (ligne == "N")
            return "#00A092" ;
            else if (ligne == "P")
            return "#F0B600" ;
            else if (ligne == "R")
            return "#E4B4D1" ;
            else if (ligne == "U")
            return "#D60058" ;



             else return "none";
           }
         )

                  .on('mouseover', function(d){
              			var name = d.properties.ligne

              			return document.querySelector('#content').innerHTML=name;
              		});
       });
