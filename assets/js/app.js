var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./assets/data/data.csv").then(function(data){
    console.log(data);

    data.forEach(d => {
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
    });

    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.poverty))
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    //Create circles for scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "8")
        .attr("fill", "lightblue")
        .attr("opacity", "0.75")
        .text(d => d.abbr)
    
    //Label circles on scatter plot
    var circlesText = chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => d.healthcare)
        .attr("y", d => d.poverty)
        

    //Initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}`);
        });

    //Create tooltip in chart
    chartGroup.call(toolTip);

    //Create event listeners to display and hide tooltip
    circlesGroup
        .on("mouseover", function(d) {toolTip.show(d, this);
        })
        .on("mouseout", d => {toolTip.hide(d, this);
        });
    
    //Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Lack Healthcare (%)");

}).catch(function(error){
    console.log(error);
});