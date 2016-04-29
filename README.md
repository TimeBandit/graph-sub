<pre>
                       _     ____        _     
  __ _ _ __ __ _ _ __ | |__ / ___| _   _| |__  
 / _` | '__/ _` | '_ \| '_ \\___ \| | | | '_ \ 
| (_| | | | (_| | |_) | | | |___) | |_| | |_) |
 \__, |_|  \__,_| .__/|_| |_|____/ \__,_|_.__/ 
 |___/          |_|                            

</pre>

graphSub is a re-usable force directed chart for displaying connected data. Written in Javascript with the [d3js](http://d3js.org) library. It has some cool features rolled in.

### Featues include:
* Display graph subsets. Given a data-set with 1000+ nodes, displaying all nodes at once can clutter your  screen. With graphSub you can display only a subset of your data-set whilst being able to navigate through the entire data-set with mouse clicks.
* The search box feature allows you to quickly locate the node that you are interested in.
* None over-lapping labels means that node labels do not obscure each other.
* Works on touch screens.
* The responsive chart resizes upon a browser resize.
* The code uses an MVC architecture, making future development easier to manage.
* More features to be added....

### Instructions:

The following code can be found at the end of static/js/graphsub.js please modify it to suit your needs.
Your data must follow the format given in the example data-set. This can be found in /data/miserables.json
More information on d3s' force layouts can be found [here](https://github.com/mbostock/d3/wiki/Force-Layout#force).


    /*----------------------------------------------------------------------------`
    The code example below:
    1. Loads the JSON data.
    2. Sets the width to 760px.
    3. Set the height to 500px.
    4. Displays all nodes within 2 hops of the selected node.
    5. Attaches the chart to the DOM element with id #chart
    */

    d3.json("data/miserables.json", function(error, graph) {
        if (error) throw error;

        // Parse JSON into the correct format if needed

        var chart = d3.graphSub()
                      .width(760)
                      .height(500)
                      .hops(2);
  
        d3.select("#chart")
          .datum(graph)
          .call(chart);
    });

Want to contribute a bug fix or enhancement; then feel free to clone the repository and make a pull request.

****A working example can be seen by downloading the repo and opening index.html****

Example bl.ock.s used in the development of this graph:

[Simple example of reusable d3 plugin](http://bl.ocks.org/cpbotha/5073718)

[Force-based label placement](http://bl.ocks.org/MoritzStefaner/1377729)

[Force-Directed Graph](http://bl.ocks.org/mbostock/4062045)

[General Update Pattern, I](http://bl.ocks.org/mbostock/3808218)

[General Update Pattern, II](http://bl.ocks.org/mbostock/3808221)

[General Update Pattern, III](http://bl.ocks.org/mbostock/3808234)

[Animating Changes in Force Diagram](http://bl.ocks.org/ericcoopey/6c602d7cb14b25c179a4)
