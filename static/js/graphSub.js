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


// return a sub-network of n nodes around a source node
var graphSub = function(datum, index, propname, distanceToFetch, links, nodes){
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
      subNodes = [],
      current;

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

  console.log(visited);

  //return {
  //  nodes: resultNodes,
  //  links: resultLinks
  //}; 
};