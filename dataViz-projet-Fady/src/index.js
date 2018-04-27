
import './styles.css'
import * as d3 from 'd3'
import * as topojson from "topojson-client"

let parcours_1 = "La Défense ↔ Château de Vincennes";
let parcours_2 = "Porte Dauphine ↔ Nation";
let parcours_3 = "Pont de Levallois ↔ Gallieni";
let parcours_3bis = "Gambetta ↔ Porte des Lilas";
let parcours_4 = "Porte de Clignancourt ↔ Mairie de Montrouge";
let parcours_5 = "Bobigny - Pablo Picasso ↔ Place d'Italie";
let parcours_6 = "Charles de Gaulle - Étoile ↔ Nation";
let parcours_7 = "La Courneuve - 8 Mai 1945 ↔ Villejuif - Louis Aragon / Mairie d'Ivry";
let parcours_7bis = "Louis Blanc ↔ Pré-Saint-Gervais";
let parcours_8 = "Balard ↔ (Créteil) Pointe du Lac";
let parcours_9 = "Pont de Sèvres ↔ Mairie de Montreuil";
let parcours_10 = "Boulogne - Pont de Saint-Cloud ↔ Gare d'Austerlitz";
let parcours_11 = "Châtelet ↔ Mairie des Lilas";
let parcours_12 = "Aubervilliers - Front Populaire ↔ Mairie d'Issy";
let parcours_13 = "Asnières-Gennevilliers - Les Courtilles / Saint-Denis - Université ↔ Châtillon - Montrouge";
let parcours_14 = "Saint-Lazare ↔ Olympiades";
let parcours_A = "Saint-Germain-en-Laye / Cergy / Poissy / Boissy-Saint-Léger / Marne-la-Vallée";
let parcours_B = "Aéroport Charles-de-Gaulle 2 TGV / Mitry - Claye / Robinson / Saint-Rémy-lès-Chevreuse" ;
let parcours_C = "Pontoise / Versailles-Château-Rive-Gauche / Saint-Quentin-en-Yvelines / Massy - Palaiseau / Dourdan / Saint-Martin-d'Étampes" ;
let parcours_D = "Creil / Melun / Malesherbes" ;
let parcours_E = "Haussmann - Saint-Lazare / Chelles - Gournay / Tournan" ;
let parcours_T1 = "Asnières-Gennevilliers ↔ Noisy-le-Sec";
let parcours_T2 = "Pont de Bezons ↔ Porte de Versailles";
let parcours_T3a = "Pont du Garigliano ↔ Porte de Vincennes";
let parcours_T3b = "Porte de Vincennes ↔ Porte de la Chapelle";
let parcours_T4 = "Aulnay-sous-Bois ↔ Bondy";
let parcours_T5 = "Saint-Denis ↔ Garges-Sarcelles";
let parcours_T6 = "Châtillon ↔ Viroflay";
let parcours_T7 = "Villejuif ↔ Athis-Mons";
let parcours_T8 = "Saint-Denis ↔ Épinay-sur-Seine / Villetaneuse";
let parcours_T11 = "Épinay-sur-Seine ↔ Le Bourget";

let parcours_H = "Paris-Nord / Luzarches / Pontoise / Creil";
let parcours_J = "Paris-Saint-Lazare / Ermont - Eaubonne / Gisors / Mantes-la-Jolie / Vernon - Giverny";
let parcours_K = "Paris-Nord / Crépy-en-Valois";
let parcours_L = "Paris-Saint-Lazare / Cergy-le-Haut / Versailles-Rive-Droite / Noisy-le-Roi / Saint-Germain-en-Laye-Grande-Ceinture";
let parcours_P = "Paris-Est / Château-Thierry / La Ferté-Milon / Provins / Coulommiers / Crécy-la-Chapelle";
let parcours_R = "Paris-Gare de Lyon / Montereau (Seine-et-Marne) / Montargis (Loiret)";
let parcours_N = "Paris-Montparnasse / Mantes-la-Jolie / Dreux / Rambouillet";
let parcours_U = "La Défense / La Verrière";


    var height = 400;
     var width  = 600;

    var border=1;
           var bordercolor='black';



     var vis = d3.select("body").append("svg")
         .attr("width", width).attr("height", height)
          .attr("border",border);

          var borderPath = vis.append("rect")
                 			.attr("x", 0)
                 			.attr("y", 0)
                 			.attr("height", height)
                 			.attr("width", width)
                 			.style("stroke", bordercolor)
                 			.style("fill", "none")
                 			.style("stroke-width", border);

/////
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
                       			var ligne = d.properties.ligne
                            if (ligne == "1")
                             return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_1+"<b>";
                            else if (ligne == "2")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_2+"<b>";
                            else if (ligne == "3")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_3+"<b>";
                            else if (ligne == "3bis")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_3bis+"<b>";
                            else if (ligne == "4")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_4+"<b>";
                            else if (ligne == "5")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_5+"<b>";
                            else if (ligne == "6")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_6+"<b>";
                            else if (ligne == "7")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_7+"<b>";
                            else if (ligne == "7bis")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_7bis+"<b>";
                            else if (ligne == "8")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_8+"<b>";
                            else if (ligne == "9")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_9+"<b>";
                            else if (ligne == "10")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_10+"<b>";
                            else if (ligne == "11")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_11+"<b>";
                            else if (ligne == "12")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_12+"<b>";
                            else if (ligne == "13")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_13+"<b>";
                            else if (ligne == "14")
                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+parcours_14+"<b>";

                            else if (ligne == "A")
                            return document.querySelector('#content').innerHTML="<b>RER "+ligne+" : "+parcours_A+"<b>";
                            else if (ligne == "B")
                            return document.querySelector('#content').innerHTML="<b>RER "+ligne+" : "+parcours_B+"<b>";
                            else if (ligne == "C")
                            return document.querySelector('#content').innerHTML="<b>RER "+ligne+" : "+parcours_C+"<b>";
                            else if (ligne == "D")
                            return document.querySelector('#content').innerHTML="<b>RER "+ligne+" : "+parcours_D+"<b>";
                            else if (ligne == "E")
                            return document.querySelector('#content').innerHTML="<b>RER "+ligne+" : "+parcours_E+"<b>";

                            else if (ligne == "T1")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T1+"<b>";
                            else if (ligne == "T2")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T2+"<b>";
                            else if (ligne == "T3A")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T3a+"<b>";
                            else if (ligne == "T3B")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T3b+"<b>";
                            else if (ligne == "T4")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T4+"<b>";
                            else if (ligne == "T5")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T5+"<b>";
                            else if (ligne == "T6")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T6+"<b>";
                            else if (ligne == "T7")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T7+"<b>";
                            else if (ligne == "T8")
                            return document.querySelector('#content').innerHTML="<b>Tramway "+ligne+" : "+parcours_T8+"<b>";

                            else if (ligne == "H")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_H+"<b>";
                            else if (ligne == "J")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_J+"<b>";
                            else if (ligne == "K")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_K+"<b>";
                            else if (ligne == "L")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_L+"<b>";
                            else if (ligne == "N")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_N+"<b>";
                            else if (ligne == "P")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_P+"<b>";
                            else if (ligne == "R")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_R+"<b>";
                            else if (ligne == "U")
                            return document.querySelector('#content').innerHTML="<b>Transilien "+ligne+" : "+parcours_U+"<b>";
                            else

                            return document.querySelector('#content').innerHTML="<b>Ligne "+ligne+" : "+"WoW";
                       		});
                });
