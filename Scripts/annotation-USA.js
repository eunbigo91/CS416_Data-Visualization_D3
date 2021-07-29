const annotations = [
    {
        // 25 million positive cases
        note: {
            label: "Passed 25 million cases, with one of every 13 Americans testing positive for COVID-19",
            title: "Cumulated 25 million cases",
            wrap: 210,
            align: "left"
        },
        x: 215,
        y: 300,
        dy: -10,
        dx: 40
    },
    {
        // 50% vaccinated rate
        note: {
            label: "Reached 50% for vaccination rates",
            title: "Vaccinated rate 50%",
            wrap: 180,
            align: "left"
        },
        connector: {
            end: "dot"
        },
        x: 664,
        y: 373,
        dy: -80,
        dx: -30
    },
    {
        // New cases increases
        type: d3.annotationCalloutCircle,
        note: {
            label: "According to the CDC, the Delta variant accounted for 83% of all sequenced case [1]",
            title: "New case increases again",
            wrap: 210
        },
        subject: {
            radius: 50
        },
        x: 815,
        y: 650,
        dy: -120,
        dx: -1
    }].map(function(d){ d.color = "#990000"; return d})

const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

d3.select("#graph")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
