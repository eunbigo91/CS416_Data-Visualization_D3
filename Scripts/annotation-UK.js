const annotations = [
    {
        // Highest rate in history
        note: {
            label: "68,192 new cases a day. This is the highest number recorded in the UK",
            title: "Highest daily new cases",
            wrap: 190,
            align: "left"
        },
        x: 167,
        y: 50,
        dy: 30,
        dx: 60
    },
    {
        // New cases decreased
        type: d3.annotationCalloutCircle,
        note: {
            label: "Daily new cases decreased along with vaccinated rate growth ",
            title: "New cases decreased",
            wrap: 190
        },
        subject: {
            radius: 50
        },
        x: 280,
        y: 580,
        dy: 1,
        dx: 130
    },
    {
        // New cases increases
        type: d3.annotationCalloutCircle,
        note: {
            label: "The Delta variant became the dominant strain in the UK and drove a third wave of infections[2]",
            title: "New cases increased again",
            wrap: 200
        },
        subject: {
            radius: 40
        },
        x: 825,
        y: 350,
        dy: 30,
        dx: -50
    }].map(function(d){ d.color = "#990000"; return d})

const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations)

d3.select("#graph")
    .append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations)
