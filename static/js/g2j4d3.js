// g2j4d3 - Gephi to JSON for D3
// Translates a GEPHI JSON export to
// D3 JSON format

var g2j4d3 = function g2j4d3 (data) {
      
      var _oldNodes = data.nodes;
      var _newNodes = []
      var _nodes = []
      var _links = [];

      // build nodes with miserables.json naming conventions
      var buildnewNodes = function buildnewNodes (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                  var node = nodes[i]
                  _newNodes.push({
                        id: node.id,
                        name: node.label,
                        attributes: node.attributes
                  });
            };
            console.log('Finished building new nodes');
      }

      // build index lookup based on the node id
      var buildIndex = function buildIndex(nodes){
            //console.log(nodes, nodeArray)
            var index = {};
            for (var i = 0; i< nodes.length; i++){
                  // store as {id, index}
                  index[nodes[i].id] = i;                   
            };
            console.log('Finished building index');
            return index;
      };

      function buildLinks(nodes, links){
      // mapping node id to index in the node array
      // source and target label used to get pos in node array
            
            var index = buildIndex(nodes);

            for (var i = 0; i< links.length; i++) {
                  var   sourceId = links[i].source,
                        targetId = links[i].target;
                  
                  _links.push({
                        source : index[sourceId],
                        target : index[targetId],
                        type : "label" in links[i] ? links[i].label : "null"
                  });
            };
            console.log('All Done');
      };

      buildnewNodes(_oldNodes);
      buildLinks(_newNodes, data.edges);
      //console.log(_links);

      return {
            nodes: _newNodes,
            links: _links
      };
}




