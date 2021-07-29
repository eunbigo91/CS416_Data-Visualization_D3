const annotations = [
    {
        // Vaccinated rate 50% reached
        note: {
            label: "Israel became the first country to reach a vaccination rate of 50%",
            title: "Vaccinated rate 50%",
            wrap: 190,
            align: "left"
        },
        connector: {
            end: "dot"
        },
        x: 318,
        y: 369,
        dy: 30,
        dx: 60
    },
    {
        // New cases decreased
        type: d3.annotationCalloutCircle,
        note: {
            label: "Around a month after vaccination rate reached 50%, new cases decreased significantly",
            title: "New cases decreased",
            wrap: 190
        },
        subject: {
            radius: 50
        },
        x: 415,
        y: 680,
        dy: -10,
        dx: 60
    },
    {
        // New cases increases
        type: d3.annotationCalloutCircle,
        note: {
            label: "However, since mid July, new cases are rising again",
            title: "New cases start to increase",
            wrap: 200
        },
        subject: {
            radius: 50
        },
        x: 815,
        y: 680,
        dy: -180,
        dx: -1
    }].map(function(d){ d.color = "#990000"; return d})

const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

d3.select("#graph")
    .append("g")
    .attr("class", "annotation-group")
    .style("position", "absolute")
    .style("z-index", "12")
    .call(makeAnnotations)
