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

// create a list of the nodes in the subnet
var makeSubNodesArr = function(visited, propname, nodes){
  var result = [],
      searchPair = {},
      obj;
  for (var i = 0; i < visited.length; i++) {
    searchPair[propname] = visited[i];
    obj = _.findWhere(nodes, searchPair)
    // remove properties added by d3, preserve use defined properties
    obj = _.omit(obj, ['index', 'fixed', 'weight', 'px', 'py', 'x', 'y'])
    result.push(obj);
    console.log('### ', result);
  };
  return result;
};

// create the array of links between nodes in the subNodesArr
var makeSubLinksArr = function(subNodes, propname, subLinks){
  var result = [],
      nodeIndex = {},
      obj;

  // {'a': 0, 'b': 1, 'c': '2' etc}
  // the position of each propname in the arr
  for (var i = 0; i < subNodes.length; i++) {
    nodeIndex[subNodes[i][propname]] = i;
  };

  // create a new subLinksArr based on the subNodeArr
  for (var i = 0; i < subLinks.length; i++) {
    obj = subLinks[i];
    obj.source = nodeIndex[obj.source[propname]];
    obj.target = nodeIndex[obj.target[propname]];
    result.push(obj);
  };

  return result
};

// return a sub-network of n nodes around a source node
var graphSub = function(datum, propname, distanceToFetch, links, nodes){
  console.log(arguments);
  // this function looks at the distance from the source nodes
  // it expands outwards, distance times. this is equivelent
  // to 'distance' in graph theory.

  // the algorithim here is concerned with collecting the links making up paths
  // add the initial datum to toVisit
  // pop the tovisit array
  // find all the links involving popped item and store them in subLinks, store the other id into toVisit
  // repeat the above distanceToFetch times.
  var count = 0,
      toVisit = [],
      visited = [],
      subLinks = [],
      current,
      result = {};

  toVisit.push(datum[propname]); // initialize
  visited.push(datum[propname]); // initialize

  while((count < distanceToFetch) || (toVisit.length === 0)){
    current = toVisit.pop(toVisit);

    for (var i = 0; i < links.length; i++) {
      
      if(links[i].source[propname] === current){
        // dont store if present, uses underscore.js union
        subLinks = _.union([links[i]], subLinks); 
        toVisit = _.union([links[i].target[propname]], toVisit);
        visited = _.union([links[i].target[propname]], visited);
      };

      if(links[i].target[propname] === current){
        // dont store if present, uses underscore.js union
        subLinks = _.union([links[i]], subLinks); 
        toVisit = _.union([links[i].source[propname]], toVisit);
        visited = _.union([links[i].source[propname]], visited);
      };
    };

    count = count + 1;
  };

  console.log('i just vistited-> ', visited);
  result.nodes = makeSubNodesArr(visited, propname, nodes);
  result.links = makeSubLinksArr(result.nodes, propname, subLinks)
  console.log('final ', JSON.stringify(result));

  return result;
};