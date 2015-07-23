/* test graph - mothers are on the left hand side */
/*
   (a)---------(b)  (c)---------(d)
       |  |  |           |  |
(e)---(f)(g)(h)---------(i)(j)---(k)
    |                          |
   (l)------------------------(m)
                 |
                (n)
*/

(d3.grapSub = function () {
  
  // add a method conditionaly
    if (!('xpush' in Array.prototype)) {
        // push value to array only if not already present
        Array.prototype.xpush = function(value){
            if(this.indexOf(value) === -1){
                this.push(value);
            };
            return this
        };
    };
  
  // private methods and variables

  // add nodes to the layout
  var addNode = function(node){
      nodes.push(node);                
  };

  // add link to the layout
  var addLink = function(source, target, value){
      var link = {"source": findNode(source), "target": findNode(target), "value": value};
      subNetLinks.push(link);
  };

  // look for the node in the d3 layout
  var findNode = function(name) {
      for (var i in graph.nodes) {
          if (graph.nodes[i]["name"] === name) return graph.nodes[i];
      };
  };

  // remove all links form the layout
  var removeAllLinks = function(linkArray) {
      linkArray.splice(0, linkArray.length);
      //update();
  };

  // remove all node from the layout
  var removeAllNodes = function(nodeArray) {
      nodeArray.splice(0, nodeArray.length);
      //update();
  };

  var findNodeIndex = function(name, nodes) {
      for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].name == name) {
              return i;
          };
      };
  };

  var subNet = function(currentIndex, hops){
      // links stored as JSON objects, easy to compare
      // operates on the data loaded from the JSON
      // extract subnet around 'currentIndex' with all nodes up to 2 'hops' steps away.

      var n = graph.nodes[currentIndex];
      subNetNodes.xpush(n);

      if (hops === 0) {
          return;
      };

      for (var i = 0; i < graph.links.length; i++) {

          if (currentIndex === graph.links[i].source) {
              linkStrings.xpush(JSON.stringify(graph.links[i]));
              subNet(graph.links[i].target, hops - 1)
          };
          if (currentIndex === graph.links[i].target) {
              linkStrings.xpush(JSON.stringify(graph.links[i]));
              subNet(graph.links[i].source, hops - 1)
          };
      };                
  };

  var createAnchors = function(){
      // create nodes and links for the labels
      for (var i = 0; i < subNetNodes.length; i++) {
          // one node fixed, the other floating freely
          var n = {
              label : subNetNodes[i]
          };

          labelAnchors.push({
              node : n
          });
          
          labelAnchors.push({
              node : n
          });
      };
  };

  var createAnchorLinks = function(){
      for (var i = 0; i < subNetNodes.length; i++) {
          // join nodes in pairs

          labelAnchorLinks.push({
              source : i * 2,
              target : i * 2 + 1,
              weight : 1
          });
      };
  };

  // TODO needs a cleanup, rename to controller
  var clickHandler = function(d, i){
      var nodeName;

      if (d.hasOwnProperty('node')) {
          nodeName = d.node.label.name;
      } else {
          nodeName = d.name;
      };

      $("#search").val(nodeName);

      // graph refreshed onces after nodes is added then after links
      // prevents wild variations in graph render.
      
      linkStrings = []; // var to ensure links no repeated
      
      removeAllNodes(subNetNodes); // clear force.nodes()
      removeAllLinks(subNetLinks); // clear force.links()
      
      removeAllNodes(labelAnchors);
      removeAllLinks(labelAnchorLinks);
      
      var link,
          source,
          target;

      // first the nodes and anchors
      // extract subnet around 'd' with all nodes up to 2 hops away
      subNet(findNodeIndex(nodeName, graph.nodes), 2);
      createAnchors();
      
      update();      

      // now the links and anchor links
      // add links incrementaly
      for (var i = 0; i < linkStrings.length; i++) {
          link = JSON.parse(linkStrings[i]);

          source = graph.nodes[link.source];
          target = graph.nodes[link.target];
          addLink(source.name, target.name, 2);
            
      };

      createAnchorLinks();
      
      update();
  };

  // where the action happens
  function my(selection) {

  }

  // getters and setters
  my.width = function(value) {
      if (!arguments.length) return width;
      width = value;
      return my; // enable chaining
  };

  my.height = function(value) {
      if (!arguments.length) return height;
      height = value;
      return my; // enable chaining
  };

  my.resize = function() {
      width = window.innerWidth, height = window.innerHeight;
      vis.attr("width", width).attr("height", height);
      force.size([width, height]).resume();
      return my;
  };

  my.hops = function(value) {
      if (!arguments.length) return hops;
      hops = value;
      return my; // enable chaining
  };  

  return my;

})()