/* test graph - mothers are on the left hand side */
/*
   (a)---------(b)	(c)---------(d)
	   |  |  |			 |  |
(e)---(f)(g)(h)---------(i)(j)---(k)
    |						   |
   (l)------------------------(m)
   				       |
			          (n)
*/

var message = function(s){
	console.log(s);
};

// return node index with a given id
var findNodeIndexById = function(id, nodes){
	var length = nodes.length || 0;
	for (var index=0; index < length; index++){
		if (nodes[index].id === id){
			return index;
		};		
	};
};

// return node with a given id
var findNodeById = function(id, nodes){
	var length = nodes.length || 0;
	for (var index=0; index < length; index++){
		if (nodes[index].id === id){
			return nodes[index];
		};		
	};
};

// return the node id given the nodes index in the node array
var findNodeByIndex = function(index, nodes){
	var length = nodes.length || 0;
	return nodes[index];
};

// helper function used by updateLinks
var makeLinkFromNodeIds = function(sourceId, targetId, nodes){
	var sourceIndex = findNodeIndexById(sourceId, nodes),
		targetIndex = findNodeIndexById(targetId, nodes);
	
	return {
		source: sourceIndex,
		target: targetIndex
	};
};

// helper function for buildLinks
var addLinkFromIds = function(sourceId, targetId, nodes, links){
	var newLink =  makeLinkFromNodeIds(sourceId, targetId, nodes);
	
	if (!linkExists(newLink, links)){
		links.push(newLink);
		return true;
	} else {
		return false;
	};
};


// build the links table for d3
var buildLinks = function (nodes){

	var links = [],
		length = nodes.length, // # of nodes
		newLink= [];

	for (var i=0; i < length; i++){
		//console.log('########## node=', i, ' ##########');
		var	mother = nodes[i].mother, // current bio mom
			father = nodes[i].father,  // current bio dad
			spouses = nodes[i].spouse; // array of spouses for current node
				
		// build link objects for parent-child		
		if (mother){
			addLinkFromIds(nodes[i].id, nodes[i].mother, nodes, links);
		};
		
		if (father){
			addLinkFromIds(nodes[i].id, nodes[i].father, nodes, links);
		};
		
		if (spouses){ // build link object for each spouse
			for (var j = 0; j < spouses.length; j++){				
				addLinkFromIds(nodes[i].id, spouses[j], nodes, links);		
			};						
		};
	};
	return links;
};

// check link already exists in the links array
var linkExists = function (link, links){
	var length = links.length,
		reverseLink = JSON.stringify({source: link.target, target: link.source}),
		link = JSON.stringify(link);

	//console.log('***** checking for existing links *****');
	for (var k=0; k < length; k++){
		var linkInLinks = JSON.stringify(links[k]);
		if ( (link === linkInLinks) || (reverseLink === linkInLinks ) ){
			return true;
		};
	};
	return false; // links is empty
};

// are two nodes biological siblings
var areSiblings = function (node1, node2){
	var mother1 = node1.mother,
		father1 = node1.father;

	var mother2 = node2.mother,
		father2 = node2.father;

	var sibling = {};

	if ( (!mother1) && (!mother2) && (!father1) && (!father2) ){
		return -1 // not related
	};
			
	if ((mother1 === mother2) && (father1 === father2)){
		return 1; // full siblings
	} else if ((mother1 === mother2) || (father1 === father2)){
		return 0; // half siblings
	} else {
		return -1; // not related
	};	
};

// TODO write test
var getparents = function(node, nodes){
	// return the parents
	var result = [];
	var mother = findNodeById(node.mother, nodes);
	var father = findNodeById(node.farther, nodes);
	
	if (mother) result.push(mother);
	if (father) result.push(father);
	
	return result;
};

// TODO write test
var getSpouses = function(node, nodes){
	// return all spouses
	var result = [];
	var spouseList = node.spouse;
	var length = spouseList.length;

	function gs(i){
		var sp = findNodeById(spouseList[i], nodes);
		if (sp) result.push(sp);
	};

	for (var i = 0; i < length; i++){
		gs(i);
	};
	
	return result;
};

// TODO write test
var getSiblings = function(node, nodes){
	// return the siblings
	var result = [];
	var length = nodes.length;

	function gs(i){
		var sibling = findNodeByIndex(i, nodes);
		if (areSiblings(node, sibling) > -1 ){
			result.push(sibling);
		};
	};

	for(var i = 0; i < nodes.length; i++){
		gs(i);
	};

	return result
};

// TODO write test
var getFamily = function (node, nodes){
		var parents = getparents(node, nodes);
		var spouses = getSpouses(node, nodes);
		var siblings = getSiblings(node, nodes);

		result = parents.concat(spouses, siblings);
		return result;
	};

// return a sub-network of n nodes around a source node
var buildNSubNetOnId = function(id, numNodesToFetch, nodes){
	var result = []; // array of nodes ids
	var queue = []; // node ids to be parsed
	var seed = findNodeIndexById(id, nodes)
	
	result.push(seed);
	queue.push(seed);

	function isPresent(element, index, array){
		// checks for the element in the result
		var present = element;

		for (var i = 0; i < result.length; i++){
			if (element.id === result[i].id){
				present = true;
			};
		};
		return present;
	};

	var storeFamily = function (family){
		// store only family members not already in result to 
		// result and queue
		var present = family.some(isPresent);

		if (present != true){
			result.push(present);
			queue.push(present);
		};
	};

	var parseQueue = function (queue){
		// retrieve famlies and add 
		while ( (queue.length != 0) && (result.length < numNodesToFetch) ){
			var node = queue.pop();
			family = getFamily(node);
			storeFamily(family);
		};		

	};

	parseQueue(queue); // let get going
	return Result;
	
};