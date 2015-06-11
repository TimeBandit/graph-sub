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

// TODO write test
// return the immediate family of the given node
var getFamily = function (nodeIndex, links, nodes){
    var n = [];
    var l = [];
    
    //console.log(links);

    // get the targets of node
    // find the nodes index
    // look for that source index in the links table
    for (var i = 0; i < links.length; i++) {
      if (links[i].source.index === nodeIndex){
        // fetch all the target object
        n.push(links[i].target);
        l.push(links[i]);
        //console.log('LINK->', links[i]);
        //console.log('target->', links[i].target);
      };
      // get the nodes where this node is their target
      // look for that source index in the target property of the links
      if(links[i].target.index === nodeIndex){
        // fetch all the source objects
        n.push(links[i].source);
        l.push(links[i]);
        //console.log('LINK->', links[i]);
        //console.log('source-> ', links[i].source);
      };
    };   
    console.log(l);
    return {
      nodes: n,
      links: l
    };
  };

// return a sub-network of n nodes around a source node
var buildNSubNetOnId = function(nodeIndex, numLinksToFetch, links, nodes){
  var resultNodes = [];
  var resultLinks = [];

  var family = getFamily(nodeIndex, links, nodes);
  console.log('family-> ', family);
  console.log('links-> ', family.links);
  console.log('**************************************');
  // initialize the work queue
  var queue = family.links;
  
  var temp;
  var nodesIndices = [];

  // keep adding links to resultLinks until you reach the limit
  // check you actually have some links to start with
  if (queue.length) {
    // take a link off the que add it to result and add its family to the queue
    // if you have enough stop here and add all nodes in links to resultNodes
    // else repeat
    do {
      console.log('queue start', queue);
      temp = queue.pop();
      //console.log(temp.source.name, ' to ', temp.target.name, ' was popped');
      resultLinks.push(temp);

      // add family of source and target in link
      queue = queue.concat(getFamily(temp.source.index, links, nodes).links);
      queue = queue.concat(getFamily(temp.target.index, links, nodes).links);

      // remove all repeated elements
      queue = _.uniq(queue);
      console.log('queue end', queue);
      
      
    } while((resultLinks.length <= numLinksToFetch) && queue.length != 0);

  // remove all repeated elements
  // resultLinks = _.uniq(resultLinks);
  

  // for each links in resultLinks, get all the source/target indexes
  // for each link, get the source index, if its not already in the indice
  // array then added it, skip whats repeated
  for (var i = 0; i < resultLinks.length; i++) {
    nodesIndices.push(resultLinks[i].source.index);
    nodesIndices.push(resultLinks[i].target.index);
    
  };
  nodesIndices = _.uniq(nodesIndices);

  // for each item in the indice table, get that node add add it to resultNodes.
  for (var i = 0; i < nodesIndices.length; i++) {
    resultNodes.push(nodes[nodesIndices[i]]); 
  };

  return {
    nodes: resultNodes,
    links: resultLinks
  }; 
};
};