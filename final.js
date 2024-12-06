//test
// var data = [
//     {x: 1, y: 7963}, {x: 2, y: 11166}, {x: 3, y: 16852},
//     {x: 4, y: 9459}, {x: 5, y: 16959}, {x: 6, y: 21832},
//     {x: 7, y: 22374}, {x: 8, y: 17095}, {x: 9, y: 16331},
//     {x: 10, y: 14945},{x: '2022',y:99999}
// ];

// var data1 = [
//     {x:165,y:7798}, {x:179,y:10987}, {x:159,y:16693},
//     {x:389,y:9070}, {x:556,y:16403}, {x:337,y:21495},
//     {x:379,y:21995}, {x:421,y:16674}, {x:364,y:15967},
//     {x:743,y:14202}
// ];
//
// var svg = d3.select('svg');
// var width = svg.attr('width');
// var height = svg.attr('height');
// var margin = { top: 60, right: 100, bottom: 60, left: 100 };
// var innerWidth = width - margin.left - margin.right;
// var innerHeight = height - margin.top - margin.bottom;
// // var mainGroup = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)
// var xScale = d3.scaleLinear();
// var yScale = d3.scaleBand();


//timeline

d3.csv('dataFlow.csv').then(data => {
    //console.log(data)
    var dataFlow=[];
for(i=0;i<10;i++){dataFlow.push({'x':data[i]['Month'],'y':data[i]['Total_Flow_Population']})}    //data conversion: x-month, y-flow
    //console.log(dataFlow);
var width = 800,
    height = 800,
    margin = 20;
var svg = d3.select('body')
            .append('svg')
            .attr("width", width)
            .attr("height", height)
    var xScale = d3.scaleLinear().domain([0, 11]).range([margin, width-2*margin]);
    var yScale = d3.scaleLinear().domain([0, 25000]).range([height - 2*margin, 100]); 
    var xAxis = d3.axisBottom(xScale).tickSizeOuter(0)// end length for ticks
    var yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
    xAxis.ticks(11);
    // yAxis.ticks(5);
    // xAxis.tickFormat(function(d) {
	// 	    return d + "month";
	// 	  });  //x axis text notation of month(need more work)

    yAxis.ticks(5);
    svg.append("g").call(xAxis).attr('transform', `translate(${margin},${height - margin})`)
    svg.append("g").call(yAxis).attr('transform', `translate(${2*margin},${margin})`)
    svg.append('line').attr('x1',100).attr('x2',200).attr('y1',40).attr('y2',80)
var g = svg.append("g")
    .attr("transform", `translate(${margin},${margin})`);
var gridlines = g.selectAll(".gridline")                                                //Monthly gridline
    .data(dataFlow)
    .enter()
    .append("line")
    .attr("x1", d => xScale(d.x))
    .attr("x2", d => xScale(d.x))
    .attr("y1", 100)
    .attr("y2", height-40)
    .attr("stroke", "grey")
    .attr("stroke-dasharray", "4");                                                    //gridline dash


//Circles

var circles = g.selectAll("circle")
    .data(dataFlow)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5)
    .attr("fill", "#C1272D")
    .on("mouseover", function(event, d) {                                            //interactivity - trouble shoot needed
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
    })
})




//Piechart for Longterm Migration (LmtMigration)
//var dataLmt = [{per:2.1},{per:97.9}]
var colors = ['black','grey']//color for piechart

function pieChartLmt(color){
    d3.csv('dataLmt.csv').then(data => {
        //console.log(data);
    for(i=0;i<10;i++){
        var dataLmt = [{'percent':data[i]['ly_percent']},{'percent':data[i]['ln_percent']}];   //dataconversion，lmt yes & lmt no into percentage
        //console.log(dataLmt);
    var svg = d3.select("body")
                .append("svg")
                .attr('name','pieyes')
                .attr("width",200)
                .attr("height",200)
                .append("g")
                .attr("transform", "translate(100,100)") 
    var pie = d3.pie()                                                //Plotting Piechart
                .value(function(d){
                    return d.percent
                })
    var pieData = pie(dataLmt)
    //console.log(pieData);
    svg.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(100))
        .attr("stroke","white")
        .style("stroke-width", "2px")
        .attr('fill', function(d){
            //console.log(d)
            var sliceIndex = d.index
           return colors[sliceIndex]
          })  
        }    
 }
)}
 pieChartLmt(colors)

//Piechart for Registered Refugee
var colors2 = ['pink','red']//color test

function pieChartReg(colors2){
    d3.csv('dataLmt.csv').then(data => {                               //data import
        //console.log(data);
    for(i=0;i<10;i++){
        var dataLmt = [{'percent':data[i]['ry_percent']},{'percent':data[i]['rn_percent']}]; //data conversion,registeredyes&registeredno into percentage
        //console.log(dataLmt);
    var svg = d3.select("body")
                .append("svg")
                .attr('name','pieyes')
                .attr("width",200)
                .attr("height",200)
                .append("g")
                .attr("transform", "translate(100,100)") 
    var pie = d3.pie()
                .value(function(d){
                    return d.percent
                })
    var pieData = pie(dataLmt)                          //Plotting Piechart
    //console.log(pieData);
    svg.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(100))
        .attr("stroke","white")
        .style("stroke-width", "2px")
        .attr('fill', function(d){
            //console.log(d)
            var sliceIndex = d.index
           return colors2[sliceIndex]
          })  
        }    
 }
)}
 pieChartReg(colors2)

//Vertical Bar for Gender ratio
// var dataG = [{per:56.6},{per:43.4}]
var colorsGender = ['red','black']                                     //color test
function barGenderChart(columnInUse,fillColor){                        //function for bar& import data
    d3.csv('dataFlow.csv').then(data => {
        //console.log(data);
    for(i=0;i<10;i++){var dataGender = [{'percent':data[i]['M_per']},{'percent':data[i]['F_per']}];    //data conversion,M_per for male & F_per for female
    var yScale = d3.scaleLinear().domain([0,100]).range([0,400])  //setting yscale 
    var svg = d3.select("body")
            .append("svg")
            .attr("width",200)
            .attr("height",200) //svg
    svg.selectAll("rect") //plotting rectangle
        .data(dataGender)
        .enter()
        .append("rect")
        .attr("fill",function(d,i){return colorsGender[i]})
        .attr("width",100)
        .attr("height",function(d){
            return yScale(d[columnInUse])
        })
        .attr("x",100)
        .attr("y",function(d,i){
            if (i==0){return 300-yScale(d[columnInUse])}                                  //need more work:yscale adjust to reflect monthly flow
            else{return 300-yScale(d[columnInUse])-yScale(dataGender[i-1][columnInUse])} //setting up the stack of the two rectangles of percentage
        })
    svg.append("text").text('female').attr("x",40).attr("y",50)            //plotting text(male,female)
    svg.append("text").text('male').attr("x",50).attr("y",150)
    }   
    })
}
barGenderChart('percent',colorsGender);

 //横向条形图
//var dataReason = [{reason:'Economic',num:1,per:0.61},{reason:'Education',num:106,per:64.24},{reason:'Family Realted Travel',num:40,per:24.24},{reason:'Health Care',num:2,per:1.21},{reason:'Return From Voluntary Travel',num:16,per:9.7}]
// var barcolors =  ['red','pink','yellow','blue','black','green','white','purple','orange','grey','olive','light grey']        // fill color(need more work)
function barChart(type,columnInUse){
    d3.csv('dataReason.csv').then(data => {           //import data csv
        //console.log(data);
    var xScale = d3.scaleLinear().domain([0,100]).range([0,800])   //setting xscale
    var sumbar = 0                                                 //setting x starter point for the sum add-up
    var dataReason = [];                                           //a new dataset to store converted data from csv
    var svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",200)                                    //svg
    for(i=0; i<data.length; i++){
        if(data[i]['Reason_type']==type){
        dataReason.push({'Reason':data[i]['Reason'],'percent':data[i]['percent']})}};                //data conversion from csv, reason = type
    //console.log(dataReason);
    for(i=0;i<dataReason.length;i++){
        svg.append("text").text(dataReason[i]['Reason']).attr("x",xScale(i*8)).attr("y",80+(i%4)*20) //plotting text for reason
        svg.selectAll("rect")                                       //plotting rectangle
            .data(dataReason)
            .enter()
            .append("rect")
            .attr('fill', () => d3.interpolateRainbow(Math.random()))   // fill random
            // .attr("fill",function(d,i){return barcolors[i]})               // fill color(need more work)
            .attr("height",80)
            .attr("width",function(d){
                return xScale(Number(d[columnInUse]))                 //setting width&height
            })
            .attr("y",50)
            .attr("x",function(d,i){
                if(i==0){return 0}
                else{
                sumbar = sumbar + Number(dataReason[i-1][columnInUse]);
                //console.log(sumbar);
                return  xScale(sumbar)  
                }                                                      //x starter point of bar with sum addup
            
            }) 
}})
}         

for(i=0;i<10;i++){barChart(String(i+1)+'_lmt_yes','percent')};
for(i=0;i<10;i++){barChart(String(i+1)+'_lmt_no','percent')};
for(i=0;i<10;i++){barChart(String(i+1)+'_reg_yes','percent')};
for(i=0;i<10;i++){barChart(String(i+1)+'_reg_no','percent')};   //plotting horizontal bars