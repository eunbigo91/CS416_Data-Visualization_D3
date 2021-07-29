async function init() {
    var csv = await d3.csv("./Data/owid-covid-data.csv");

    const data = csv.filter(function (d) {
        var selected = d3.select("#filter-3").property("value");
        return d.date > "2020-12-00" && d.location === selected;
    });

    var barcount = Object.keys(data).length;

    var svg_1 = d3.select("#graph"),
        margin = {top: 20, right: 35, bottom: 70, left: 30},
        width_1 = svg_1.attr("width") - margin.left - margin.right,
        height_1 = svg_1.attr("height") - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleBand()
            .range([0, width_1])
            .padding(0.2)
            .domain(data.map(function (d) { return parseTime(d.date); })),
        x1 = d3.scaleTime()
            .range([0,width_1])
            .nice()
            .domain(d3.extent(data, d => parseTime(d.date))),
        y = d3.scaleLinear()
            .rangeRound([height_1, 0]),
        y1 = d3.scaleLinear()
            .rangeRound([height_1, 0]);

    var g = svg_1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domains of the axes
//     x.domain(data.map(function (d) {
//         return parseTime(d.date);
//     }));
    y.domain([0, d3.max(data, function (d) {
        return +d.new_cases;
    })]);
    y1.domain([0, 100]);

// X axis
//     g.append("g")
//         .attr("id", "x-axis")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + height_1 + ")")
//         .call(d3.axisBottom(x).ticks(d3.timeDay.every(5)).tickFormat(d3.timeFormat("%b-%d %y")))
//         //.call(d3.axisBottom(x).ticks(d3.timeDay.every(5)).tickFormat(d3.timeFormat("%b-%d %Y")))
//         .selectAll("text")
//         //.style("visibility","hidden")
//         .style("text-anchor", "end")
//         .attr("dx", "-.8em")
//         .attr("dy", ".15em")
//         .style("font-size", "6px")
//         .attr("transform", "rotate(-80)");

    //X1
    g.append("g")
        .attr("transform", "translate(0," + height_1 + ")")
        .call(d3.axisBottom(x1));
    //.call(d3.axisBottom(x).ticks(d3.timeDay.every(5)).tickFormat(d3.timeFormat("%b-%d %Y")))

    g.append("text")
        .attr("transform", "translate(" + (width_1 / 2) + " ," + (height_1 + margin.top + 35) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Date");

// Y-Left axis
    g.append("g")
        .attr("class", "axis")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))

    g.append("text")
        .style("font-size", "13px")
        .attr("y", 0 - margin.top)
        .attr("x", 10)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("New cases");

// Y-Right axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + width_1 + ",0)")
        .attr("id", "y1-axis")
        .call(d3.axisRight(y1));

    g.append("text")
        .style("font-size", "13px")
        .attr("y", 0 - margin.top)
        .attr("x", width_1-20)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Vaccination Rate");

// Create the bars
    g.append("g")
        .attr("class", "bar-group")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .style("position", "absolute")
        .style("z-index", "-1")
        .attr("x", d => x(parseTime(d.date)))
        .attr("y", d => y(d.new_cases))
        .attr("width", x.bandwidth())
        //.attr("width", width_1/data.length)
        .attr("height", d => height_1 - y(d.new_cases))
        .on("mouseover", function(d) {
            tooltip2.style("visibility", "visible")
                .html("<strong>" + d.date + "</strong><br>" + "New cases: " + d.new_cases + "<br>Vaccinated Rate: " + d.people_vaccinated_per_hundred)
        })
        .on("mousemove", function(){ tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){ tooltip2.style("visibility", "hidden");});

// Create the lines
    var line = d3.line()
        .defined(function (d) { return d.people_vaccinated_per_hundred != 0; })
        .x(d => x(parseTime(d.date)))
        .y(d => y1(d.people_vaccinated_per_hundred))
        .curve(d3.curveBasis);

    g.append("g")
        .attr("class", "line-group")
        .style("position", "absolute")
        .style("z-index", "2")
        .append("path")
        .datum(data)
        .datum(data.filter(line.defined()))
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    g.append("g")
        .attr("class", "circle-group")
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", d => x(parseTime(d.date)))
        .attr("cy", d => y1(d.people_vaccinated_per_hundred))
        .attr("r", 3)
        .style("opacity", 0)
        .on("mouseover", function(d) {
            tooltip2.style("visibility", "visible")
                .html("<strong>" + d.date + "</strong><br>" + "New cases: " + d.new_cases + "<br>Vaccinated Rate: " + d.people_vaccinated_per_hundred)
        })
        .on("mousemove", function(){ tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){ tooltip2.style("visibility", "hidden");});

    // Tooltip
    var tooltip2 = d3.select("body")
        .append("div")
        // .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("font-size", "13px")
        .style("background", "rgba(255, 255, 255, .7)");

    //legends
    g.append("rect").attr("class","legend").attr("x", 670).attr("y",50).attr("width",10).attr("height",2).style("fill","darkgreen");
    g.append("rect").attr("class","legend").attr("x", 670).attr("y",65).attr("width",10).attr("height",10).style("fill","steelblue");
    g.append("text").attr("class","legend").attr("x", 685).attr("y",50).text("People Vaccinated Per Hundred").style("font-size", "12px").attr("alignment-baseline","middle");
    g.append("text").attr("class","legend").attr("x", 685).attr("y",70).text("New Covid-19 Cases").style("font-size", "12px").attr("alignment-baseline","middle");
//g.append("rect").attr("class","legend").attr("x", 90).attr("y",40).attr("width",150).attr("height",50).style("background-color","transparent").style("border","1px solid black");
    g.selectAll(".legend").attr("transform", "translate(-50,0)")



    // If filter changed //
    d3.select("#filter-3").on("change", function() {
        applyFilter(this.value);
    });

    function applyFilter(value) {
        const data = csv.filter(function (d) {
            var selected = d3.select("#filter-3").property("value");
            return d.date > "2020-12-00" && d.location === selected;
        });

        // remove line
        d3.select(".line").remove();
        //remove bars
        if (Object.keys(data).length < barcount) {
            d3.selectAll(".bar").exit().remove();
        }

        // adjust Y-left axis to the new data
        y.domain([0, d3.max(data, function (d) { return +d.new_cases; })]);

        g.select("#y-axis")
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

        // re-draw the bars
        g.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(parseTime(d.date)))
            .attr("y", d => y(d.new_cases))
            .attr("width", x.bandwidth())
            //.attr("width", width_1/data.length)
            .attr("height", d => height_1 - y(d.new_cases))
            .on("mouseover", function(d) {
                tooltip2.style("visibility", "visible")
                    .html("<strong>" + d.date + "</strong><br>" + "New cases: " + d.new_cases + "<br>Vaccinated Rate: " + d.people_vaccinated_per_hundred)
            })
            .on("mousemove", function(){ tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){ tooltip2.style("visibility", "hidden");});

        // Re-draw line chart
        line = d3.line()
            .defined(function (d) { return d.people_vaccinated_per_hundred != 0; })
            .x(d => x(parseTime(d.date)))
            .y(d => y1(d.people_vaccinated_per_hundred))
            .curve(d3.curveBasis);

        g.append("path")
            .datum(data)
            .datum(data.filter(line.defined()))
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        g.selectAll(".line")
            .data(data)
            .on("mouseover", function(d) {
                tooltip2.style("visibility", "visible")
                    .html("<strong>" + d.date + "</strong><br>" + "New cases: " + d.new_cases + "<br>Vaccinated Rate: " + d.people_vaccinated_per_hundred)
            })
            .on("mousemove", function(){ tooltip2.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){ tooltip2.style("visibility", "hidden");});
    }
}