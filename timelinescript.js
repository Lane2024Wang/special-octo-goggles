// var jsonData = d3.json("202202.json")
// Data points
var data = [
    {x: 1, y: 7963}, {x: 2, y: 11166}, {x: 3, y: 16852},
    {x: 4, y: 9459}, {x: 5, y: 16959}, {x: 6, y: 21832},
    {x: 7, y: 22374}, {x: 8, y: 17095}, {x: 9, y: 16331},
    {x: 10, y: 14945}
];

var data1 = [
    {x:165,y:7798}, {x:179,y:10987}, {x:159,y:16693},
    {x:389,y:9070}, {x:556,y:16403}, {x:337,y:21495},
    {x:379,y:21995}, {x:421,y:16674}, {x:364,y:15967},
    {x:743,y:14202}
];

// Create SVG canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 600);

// Margins for padding
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Scales
var xScale = d3.scaleLinear()
    .domain([0, 11])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, 25000])
    .range([height, 0]);

// Add group for proper positioning
var g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add tooltip
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

// Function to adjust xScale with expanded spacing
function adjustScale(selectedIndex) {
    const newDomain = data.map((d, i) => {
        if (i === selectedIndex - 1 || i === selectedIndex + 1) return d.x - 0.5; // Add buffer
        if (i === selectedIndex) return d.x; // Keep selected point central
        return d.x;
    });
    return d3.scaleLinear()
        .domain(newDomain)
        .range([100, 400]);
}

// Add vertical gridlines for each month
var gridlines = g.selectAll(".gridline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", d => xScale(d.x))
    .attr("x2", d => xScale(d.x))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "grey")
    .attr("stroke-dasharray", "4");

// Plot data points with red color
var circles = g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5)
    .attr("fill", "#C1272D")
    .on("mouseover", function(event, d) {
        const [mouseX, mouseY] = d3.pointer(event);
        const dx = Math.abs(xScale(d.x) - mouseX);
        const dy = Math.abs(yScale(d.y) - mouseY);
        if (dx <= 50 && dy <= 50) {
            tooltip.style("display", "block")
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`)
                .text("Click me");
        }
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
    })
    .on("click", function(event, d, i) {
        // Re-adjust xScale for expanded spacing
        const newXScale = adjustScale(d.x);

        // Animate gridlines and data points
        gridlines.transition()
            .duration(1000)
            .attr("x1", d => newXScale(d.x))
            .attr("x2", d => newXScale(d.x));

        circles.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d.x));
    });

// Add x-axis
var xAxis = d3.axisBottom(xScale)
    .tickFormat(d => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"][d - 1]);

g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

// Add y-axis
var yAxis = d3.axisLeft(yScale)
    .ticks(5);

g.append("g").call(yAxis);

// Add x-axis label
g.append("text")
    .attr("x", width - 5)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("2022");

// Add y-axis label
g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Population");


// plot piechart for lmt.migration
var colors = ["#53e2e8","#dce539","#4cecbb","#f1be47","#79e950","#f6ac8d","#7be98e","#e5d17c","#8ce1af","#d6db66","#c2e596","#b4e462"]
  function pieChart(data1){
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width",200)
                  .attr("height",200)
                  .append("g")
                  .attr("transform", "translate(100,100)") 
      var pie = d3.pie()
                  .value(function(d){
                      return d.x
                  })
      var pieData = pie(data1)
      svg.selectAll("path")
          .data(pieData)
          .enter()
          .append("path")
          .attr("d", d3.arc().innerRadius(0).outerRadius(100))
          .attr("stroke","white")
          .style("stroke-width", "2px")
          .attr('fill', function(d){
              console.log(d)
              var sliceIndex = d.index
             return colors[sliceIndex]
            })}
            