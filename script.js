function init(){
    createVis3(".vis3");
}


function createVis3(id){
    margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class","node")
        .attr("transform",`translate(${margin.left}, ${margin.top})`);
    d3.json("https://raw.githubusercontent.com/DiogoBarata/VI/main/network_all_data.json").then(function(data) {
        // Initialize the links
        var link = svg
            .selectAll("line")
            .data(data.Class_Align.Artificer.links)
            .join("line")
            .style("stroke", "#aaa");
        // Initialize the nodes
        var node = svg.selectAll(".node")
            .data(data.Class_Align.Artificer.nodes)
            .enter().append("g")
            .attr("class","node")
        node.append("circle")
            .attr("r",15)
            .attr("stroke", "green")
            .style("fill", "green")
        node.append("text")
            .text(function(d){ return d.name;})

        // Initialize the network
        const simulation = d3.forceSimulation(data.Class_Align.Artificer.nodes)         // Force algorithm is applied to nodes
            .force("link", d3.forceLink()                                               // This force provides links between nodes
            .distance(linkDistance)      
            .id(function(d) { return d.id; })                                           // This provide  the id of a node
            .links(data.Class_Align.Artificer.links)                                    // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-1000))     					// This adds repulsion between nodes
            .force("center", d3.forceCenter(width / 2, height / 2)) 					// This force attracts nodes to the center of the svg area
            .on("end", ticked);
        function linkDistance(d) {
            return d.distance;
        }
        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        }
    });    
}
