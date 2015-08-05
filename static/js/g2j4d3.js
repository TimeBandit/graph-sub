// g2j4d3 - Gephi to JSON for D3
// Translates a GEPHI JSON export to
// D3 JSON format

var g2j4d3 = function g2j4d3 (data) {
      // initialize nodes and edges
      var nodes = [];
      var links = [];

      // build index lookup based on the node id
      var buildIndex = function buildIndex(nodeArray){
            var temp = {};
            for (var i = 0; i< nodeArray.length; i++){
                  // store as {id, index}
                  temp[nodeArray[i].id] = i;                   
            };
            console.log('Finished building index');
            return temp;
      };

      // helper function to build the link table
      // for each edge source and target id
      // find the nodes position in the node array
      function buildLinks(nodesArray, edgesArray){
      // object mapping node id to its index in the node array
      // use the source and target label to get pos in node array
            var index = buildIndex(nodesArray);
            for (var i = 0; i< edgesArray.length; i++) {
                  links.push({
                        source : index[edgesArray[i].source],
                        target : index[edgesArray[i].target],
                        type : "label" in edgesArray[i] ? edgesArray[i].label : "null"
                  });
            };
      };

      nodes = data.nodes;
      console.log(data);
      buildLinks(nodes, data.edges);

      return {
            nodes: nodes,
            links: links
      };
}




