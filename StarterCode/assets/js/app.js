// define variables and margins
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
    top: 100,
    bottom: 100,
    right: 50,
    left: 200
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//create SVG wrapper and append
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial params
var chosenXaxis = "obesity";


//create X scale function
function xScale(stateData, chosenXaxis) {
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, data => data[chosenXaxis]),
        d3.max(stateData, data => data[chosenXaxis])
      ])
      .range([0, width]);
      
      return xLinearScale;
  }

//import data
d3.csv("assets/js/data.csv").then(function(stateData) {
    console.log(stateData)

    //format data
    stateData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.abbr = data.abbr;
      });

    //create scale functions
    var xLinearScale = xScale(stateData, chosenXaxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, data => data.income)])
        .range([height, 0]);

    //create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart group
    chartGroup
      .append('g')
      .classed('x-axis', true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup
      .append('g')
      .call(leftAxis);


    //append circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data[chosenXaxis]))
    .attr("cy", data => yLinearScale(data.income))
    .attr("r", "15")
    .attr("fill", "green")
    .attr("opacity", .5);

    //add in state abbreviations
    chartGroup.selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", data => xLinearScale(data[chosenXaxis]))
    .attr("y", data => yLinearScale(data.income))
    .classed("stateText", true)
    .text(data => data.abbr)
    .on("mouseover", function(data) {
        toolTip.show(data);
    })
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    //create axis labels
    chartGroup.append("text")
    .attr("x",(width/3))
    .attr("y", height + 40)
    .attr("dy", "1em")
    .attr("font-weight", 700)
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("Obesity (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-weight", 700)
    .style("text-anchor", "middle")
    .classed("axis-text", true)
    .text("Average Income ($)");

    //initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${d.abbr}</strong><hr>Obesity:${d.obesity}%<strong><hr>Average Income: $${d.income}`);
        });

    //create tool tip in chartgroup
      chartGroup.call(toolTip);

    //create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
    //create "mouseout" event listener to hide tooltip
        .on("mouseout", function(data) {
          toolTip.hide(data);
        });
    }).catch(function(error) {
      console.log(error);

});
