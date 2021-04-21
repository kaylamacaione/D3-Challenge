// define variables and margins
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//create SVG wrapper
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//import data
d3.csv("assets/js/data.csv").then(function(stateData) {
    console.log(stateData)

    //format data
    stateData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.abbr = +data.abbr;
      });

    //create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, data => data.obesity)])
        .range([0, width]);
        
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, data => data.income)])
        .range([height, 0]);

    //create axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append axes to chart group
    chartGroup
      .append('g')
      .classed('green', true)
      .attr("transform", `translate(${width}, 0)`)
      .call(bottomAxis);

    chartGroup
      .append('g')
      .attr("transform", `translate(0, ${height})`)
      .call(leftAxis);


    //append circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", data => xLinearScale(data.obesity))
    .attr("cy", data => yLinearScale(data.income))
    .attr("r", "12")
    .attr("fill", "green")
    .attr("opacity", .5);

    //add in state abbreviations
    chartGroup.selectAll("text")
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", data => xLinearScale(data.obesity))
    .attr("y", data => yLinearScale(data.income-0.28))
    .classed("stateText", true)
    .text(data => data.abbr)
    .on("mouseover", function(data) {
        toolTip.show(data);
    })
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

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

    //create axis labels
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("data-axis-name", "Obesity (%)")
        .text("Obesity (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("data-axis-name", "Average Income ($)")
        .text("Income");
});


