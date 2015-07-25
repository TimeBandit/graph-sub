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

d3.grapSub = function () {
  
  var config = {
    width: 1000,
    height: 500
  };

  function chart(selection) {

    var data = {
    };

    var controller = {
      
      init: function (argument) {
        data.color = d3.scale.category10();
        data.force = d3.layout.force();
        data.force2 = d3.layout.force();
        data.subNetNodes = force.nodes();
        data.subNetLinks = force.links();      
        data.linkStrings = [];
        data.labelAnchors = force2.nodes();
        data.labelAnchorLinks =force2.links();

        view.init();
      };

      // add link to the layout
      addLink: function(source, target, value){
          var link = {"source": findNode(source), "target": findNode(target), "value": value};
          data.subNetLinks.push(link);
      };

      // look for the node in the d3 layout
      findNode: function(name) {
        for (var i in data.graph.nodes) {
          if (data.graph.nodes[i]["name"] === name) return data.graph.nodes[i];
        };
      };

      // remove all links from the layout
      removeAllLinks: function(linkArray) {
        linkArray.splice(0, linkArray.length);
      };

      // remove all node from the layout
      removeAllNodes: function(nodeArray) {
        nodeArray.splice(0, nodeArray.length);
      };

      findNodeIndex: function(name, nodes) {
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].name == name) {
            return i;
          }
        };
      };
      
    };

    var view = {
      
      init: function () {
        d3.select(window).on("resize", this.resize)
        
        data.vis = d3.select(config.element)
                    .append("svg:svg")
                    .attr("width", config.width)
                    .attr("height", config.height)
                    .attr("id", "svg")
                    .attr("pointer-events", "all")
                    .attr("viewBox", "0 0 " + 1000 + " " + 500)
                    .attr("perserveAspectRatio", "xMinYMid")
                    .append('svg:g');

        // Per-type markers, as they don't inherit styles.
        data.vis.insert("defs")
            .selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter()
                .append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 15)
                    .attr("refY", -0.5)
                    .attr("markerWidth", 6)
                    .attr("markerHeight", 6)
                    .attr("orient", "auto")
                    .append("path")
                        .attr("d", "M0,-5L10,0L0,5");
      }

      resize: function() {
        config.width = window.innerWidth; 
        config.height = window.innerHeight;
        
        vis.attr("width", config.width)
            .attr("height", config.height);

        force.size([config.width, config.height]).resume();
      };

    };

  // make it all go
  controller.init();

  };

  var width = function(value) {
    if (!arguments.length) return config.width;
    config.width = value;
    return chart; // enable chaining
  };

  var height = function(value) {
      if (!arguments.length) return config.height;
      config.height = value;
      return chart; // enable chaining
  };

  var element = function(value) {
      if (!arguments.length) return config.element;
      config.element = value;
      return chart; // enable chaining
  };

  var graph = function(value) {
      if (!arguments.length) return data.graph;
      data.graph = value;
      return chart; // enable chaining
  };

  return chart;

}()
/*----------------------------------------------------------------------------*/
d3.json("data/miserables.json", function(error, graph) {
  if (error) throw error;

  // Parse JSON into the correct format if needed

  var chart = d3.grapSub()
                .width()
                .height()
                .element()
                .graph(graph);

  d3.call(chart)
};

