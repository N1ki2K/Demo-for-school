/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mSelectPicked = new Array();
var mSelectBorder = "1px solid #cdcdcd"


function mSelectMouseOver(e){
//	this.style.cursor = 'pointer';
	
	if(this.infoTip){
		this.showInfo();
	}
	
	this.style.border =  "1px solid #7da2ce";
	if(this.parameters.droppable && mDrag.dragging){
		mDrag.setHoverItem(this);
	}
}

function mSelectMouseOut(){
//	this.style.cursor = 'auto';
	
	if(this.infoTip){
		this.hideInfo();
	}
	
	if(!mIsSelected(this)){
			if(this.className.indexOf("mSelectXXL")!=-1){
				
				this.style.border =  mSelectBorder;
			}else{
				this.style.border =  "1px solid white";
			}
	}
	
	
	if(this.parameters.droppable && mDrag.dragging){
		mDrag.setHoverItem();
	}
}

function mSelectAreaOver(e){
	if(!mDrag.dragging) return false;
	if(this.parameters.droppable){
		mDrag.areaOver(this);
	}
	return false;
}
function mSelectAreaOut(e){
	if(!mDrag.dragging) return false;
	if(this.parameters.droppable){
		mDrag.areaOut(this);
	}
	return false;
}

function mSelectOnClick(e){
	 // document.body.focus(); 
	 if(typeof mSearch != "undefined"){
		 mSearch.checkFocus();
	 }
	if(this.stopClick){
		this.stopClick = false;
		return false;
	}	
	mSelectPick(this);
	return false;
}

function mSelectPick(node,forceOn,addOnly){
	// document.body.focus(); 
	forceOn = forceOn || false;
	addOnly = addOnly || false;
	if(node.parameters.selecttype=="radio"){
		mSelectToDefault(node.selectableNode);
	}
	
	var multiOSCTRLKey =  (navigator.appVersion.indexOf("Mac")!=-1) ? 91 : dojo.keys.CTRL;
	
	if(node.parameters.selecttype=="winlike"){
		if(pressedKey != multiOSCTRLKey && pressedKey != dojo.keys.SHIFT && !addOnly) {
			mSelectPicked[node.namespace].reset();
			mSelectToDefault(node.selectableNode);
		}else {
			if(pressedKey == dojo.keys.SHIFT){
				pressedKey= undefined;
				mSelectRange(node);
				return false;
			}
			pressedKey= undefined;
		}
			
	}	
	var input = _("input-"+node.sid);
	var cn = node.className;
	var selectOn = undefined;
	var isSelected = undefined;
	
	if(cn.indexOf("mSelectXXL")!=-1){
		selectOn = "selectedXXL";
	}else if(cn.indexOf("mSelect")!=-1){
		selectOn = "selected";
	}
	
	isSelected = (node.id == selectOn);
	
	if(forceOn && isSelected) return false;
	
	input.value = (isSelected)? "": node.getAttribute("href");
	node.id = (isSelected)?"":selectOn;

	var key = "s"+node.sid;
	if(node.parameters.selecttype=="radio"){
		mSelectPicked[node.namespace].set(key,node);
	}else{
		if(isSelected){
			mSelectPicked[node.namespace].remove(key);
		}else{
			mSelectPicked[node.namespace].add(key,node);

		}
	}
	var defaultBorder = (node.className.indexOf("mSelectXXL")!=-1)? mSelectBorder:"1px solid white";
	
	node.style.border= isSelected? defaultBorder:"1px solid #7da2ce";
	
	
	evalButtons();
	
	return false;
}



function mSelectRange(node){
	var selected = mSelectPicked[node.namespace];
	var lowestSid = parseInt(selected.getLowestSid());
	var highestSid = parseInt(selected.getHighestSid());
	var nodeSid = parseInt(node.sid);
	var start, stop = undefined;
	if(nodeSid<= lowestSid){
		start = node;
	}else{
		eval ('start = selected.s'+lowestSid);	
	}
	if(nodeSid<= lowestSid){
		eval ('stop = selected.s'+highestSid);
	}else{
		stop = node;
	}	
	mSelectPicked[node.namespace].reset();
	mSelectToDefault(node.selectableNode);
	
	var parseNode = start;
	while(parseNode){
		// Selecting starts here 
		var inputName = "input-"+parseNode.getAttribute("sid");
		var input = _(inputName);
		var cn = parseNode.className;
		var selectOn = undefined;	
		
		if(cn.indexOf("mSelectXXL")!=-1){
			selectOn = "selectedXXL";
		}else if(cn.indexOf("mSelect")!=-1){
			selectOn = "selected";
		}
						
		input.value = parseNode.getAttribute("href");
		parseNode.id = selectOn;

		var key = "s"+parseNode.sid;
		mSelectPicked[parseNode.namespace].add(key,parseNode);
		parseNode.style.border= "1px solid #7da2ce";
		// Selecting end here
		if(parseNode == stop){
			parseNode = undefined;
		}else{
			parseNode = nextTag(parseNode,"DIV");;
		}		
	}//EOF while
	evalButtons();
}//EOF select range


function mSelectToDefault(selectable){
	var options = mSelectableOptions(selectable);
	for(t=0;t<options.length;t++){
		var input= _("input-"+options[t].sid);
		input.value ="";
		options[t].id ="";
		var defaultBorder = (options[t].className.indexOf("mSelectXXL")!=-1)? mSelectBorder:"1px solid white";
		options[t].style.border= defaultBorder;
	}
}

function mSelectOnDoubleClick(e){
	if(!this.parameters.dblc || this.parameters.dblc == "") return false;
	mSelectPick(this, true);
	execFunc(this.parameters.dblc,this);
	return false;
}



function mSelectInsideAction(node){
	var p = node;
	var proceed = true;
	while(proceed){
		p = p.parentNode;
		if(p.className== "mSelect" || p.className== "mSelectXL" || p.className== "mSelectXXL" || p.className== "mSelectXXXL"){
			proceed = false;
		}
		if (p==document.body){
			proceed = false;
			p = null;
		}
	}
	if(p) p.stopClick = true;
	
	var action = node.getAttribute("action");
	if(action){
		var actionQuery = action+"(node);";
		if(funcExists(action)){
			eval(actionQuery);
		}
	}
	
	return false;
}


function mSelectOpacity(item,opacity){
	if(!item) return false;
	opacity = opacity || 1 ;
	var type = item.parameters.selecttype || 'multiple';
	switch (type) {
	default:
	case "multiple":
		var nodes = mSelectableOptions(item.selectableNode);
		for(t=0;t<nodes.length;t++){
			if(nodes[t].id !=""){
				dojo._setOpacity(nodes[t],opacity);
			}
		}
		break;

	case "radio":
		dojo._setOpacity(item,opacity);
		break;
	}
	return true;
}

function mSelectCountItems(node){
	var count = 0;
	var type = node.parameters.selecttype || 'multiple';
	switch (type) {
	default:
	case "multiple":
		var nodes = mSelectableOptions(node.selectableNode);
		for(t=0;t<nodes.length;t++){
			if(nodes[t].id !=""){
				count++;
			}
		}
		break;
		
	case "winlike":
		var nodes = mSelectableOptions(node.selectableNode);
		for(t=0;t<nodes.length;t++){
			if(nodes[t].id !=""){
				count++;
			}
		}
		break;
		
	case "radio":
		count++;
		break;
	}
	return count;
}

function mSelectIsArea(){
	return (mDrag.areaItem && !mDrag.hoverItem);
}

function mSelectIsOrdering(){
	if(mDrag.orderingTop == undefined) return false;
	else return (!mSelectIsArea());
}

function mSelectMoveSelected(source,destination,ordering){
	var mother,newParameters,newNamespace;
	var allNodes = source.getAll();
	
	if(mSelectIsArea()){
		mother = mDrag.areaItem;
		var parameters = generalParameters(mother);
		var namespace = extractNamespace(parameters);
		parameters.dragstart="mSelectDragStart";
		parameters.dragstop ="mSelectDragStop";
		parameters.dropnomatch ="mSelectDropNoMatch";
		for(t=0;t<allNodes.length;t++){
			allNodes[t].parameters = parameters;
			allNodes[t].id ="";
			allNodes[t].namespace = namespace;
			allNodes[t].selectableNode = mother;
			allNodes[t].style.border = (allNodes[t].className.indexOf("mSelectXXL")!=-1)? mSelectBorder:"1px solid white";
			mother.appendChild(allNodes[t]);
		}		
	}else{
		mother = destination.selectableNode;
		newParameters = destination.parameters;
		newNamespace = destination.namespace;
		if(ordering==undefined ){
			for(t=0;t<allNodes.length;t++){
				allNodes[t].parameters = newParameters;
				allNodes[t].id ="";
				allNodes[t].namespace = newNamespace;
				allNodes[t].selectableNode = mother;
				allNodes[t].style.border = (allNodes[t].className.indexOf("mSelectXXL")!=-1)? mSelectBorder:"1px solid white";
				destination.appendChild(allNodes[t]);
			}		
		}else{
			var before=true;
			var currentDestination;
			if(!ordering){
				var next = mSelectNextDiv(destination);
				if(!next) before=false;
				else currentDestination = next;
			}else{
				currentDestination = destination;
			}
			
			
			for(t=0;t<allNodes.length;t++){
				allNodes[t].parameters = newParameters;
				allNodes[t].id ="";
				allNodes[t].namespace = newNamespace;
				allNodes[t].selectableNode = mother;
				allNodes[t].style.border = (allNodes[t].className.indexOf("mSelectXXL")!=-1)? mSelectBorder:"1px solid white";
				
				if(ordering){
					mother.insertBefore(allNodes[t],currentDestination);
				}else {
					if(before){
						mother.insertBefore(allNodes[t],currentDestination);
					}else{
						mother.appendChild(allNodes[t]);
					}
				}
				
				
			}
			
		}
	}
	source.reset();
	return true;
}

function mSelectRemoveSelected(source){
	var allNodes = source.getAll();
	for(t=0; t<allNodes.length;t++){
		_removeNode(allNodes[t]);
	}
	source.reset();
}


function mSelectNextDiv(node){
	if(!node) return null;
	var next = node;
	var proceed = true;
	while(proceed){
		next = next.nextSibling;
		if(next== undefined){ 
			proceed = null;
		}else if(next.tagName == "DIV") proceed = null;
	}
	return next;
}


function mSelectDragStart(item){	
	mSelectOpacity(item,0.5);
}
function mSelectDragStop(item){
	mDrag.infoTo();
	mSelectOpacity(item,1);
	var source = mSelectPicked[item.namespace];
	if(item.parameters.dropfunc){
		
		if(funcExists(item.parameters.dropfunc)){
			if(mDrag.areaItem && !mDrag.hoverItem){
				eval(item.parameters.dropfunc+"(source,mDrag.areaItem,mDrag.orderingTop);");
			}else{
				mDrag.hoverItem.style.border = "1px solid #e5eefb";
				mDrag.hoverItem.style.cursor = "pointer";
				if(typeof mDrag.hoverItem.firstChild.style != "undefined"){
					mDrag.hoverItem.firstChild.style.cursor = "pointer";					
				}
				eval(item.parameters.dropfunc+"(source,mDrag.hoverItem,mDrag.orderingTop);");
			}
		}
	}
	
	
}
function mSelectDropNoMatch(item){
	mDrag.infoTo();
	mSelectOpacity(item,1);
}

function mSelectObject(){}

mSelectObject.prototype = {
	count: 0,
	lowest:0,
	highest:0,
	add : function(key,value){
		eval("this."+key+"= value;");
		this.count++;
		this.calcRange();
	},
	remove: function(key){
		eval("delete this."+key+";");
		this.count--;
		this.calcRange();
	},
	getAll: function(){
		var returnArray = new Array();
		for(var t in this){
			if(typeof this[t] == "object"){
				returnArray.push(this[t]);
			}
		}
		return returnArray;
	},
	hasFolder: function(){
		var has = false;
		dojo.forEach(this.getAll(), dojo.hitch(this,function(node){
			if(dojo.hasClass(node,"mSelectFolder")) has = true;
		}));
		return has;
	},
	calcRange: function(){
		var all = this.getAll();
		this.lowest = undefined;
		this.highest = undefined;
		if(all.length>0){
			for(t=0;t<all.length;t++){
				var sid = parseInt(all[t].getAttribute("sid"));
				if(this.lowest === undefined){
					this.lowest = sid;
					this.highest = sid;
					continue;
				}
				this.lowest = (sid<=this.lowest)? sid : this.lowest;
				this.highest = (sid>=this.highest)? sid : this.highest;
			}	
		}
		
	},
	getLowestSid: function(){
		return this.lowest;
	},
	getHighestSid: function(){
		return this.highest;
	},
	set: function(key,value){
		this.reset();
		this.add(key,value);
	},
	reset: function(){
		for(t in this){
			if(typeof this[t] == "object"){
				delete this[t];
			}
		}
		this.count=0;
	}
}

function parseSelect(startNode){
	startNode = startNode?startNode:document.body;
	
	var selectable = dojo.query(".mSelectable",startNode);
	
	
	for(var s=0, l= selectable.length; s<l; s++){
		
		var atts = selectable[s].attributes;
		var parameters = generalParameters(selectable[s]);
		selectable[s].moojType="selectable";				
		var namespace = extractNamespace(parameters);
		selectable[s].namespace = namespace;
		parameters.dragstart="mSelectDragStart";
		parameters.dragstop ="mSelectDragStop";
		parameters.dropnomatch ="mSelectDropNoMatch";
		
		if(parameters.areadrop){
			selectable[s].parameters = new Object();
			selectable[s].parameters.droppable = parameters.areadrop;
			selectable[s].onmouseover = mSelectAreaOver;
			selectable[s].onmouseout = mSelectAreaOut;
		}
		selectable[s].onmousedown = function(){return false;};
		
		mSelectPicked[namespace] = new mSelectObject();
		
		var children = mSelectableOptions(selectable[s]);	
		for(var t=0, ll=children.length; t<ll; t++){
				children[t].onmousedown = mDrag.mouseDown;
				children[t].onmouseover = mSelectMouseOver;
				children[t].onmouseout = mSelectMouseOut;
				children[t].onclick = mSelectOnClick;
				children[t].ondblclick = mSelectOnDoubleClick;
				children[t].parameters = parameters;
				if(dojo.hasAttr(children[t],"droppable")){
					children[t].parameters = dojo.clone(parameters);
					children[t].parameters.droppable = children[t].getAttribute("droppable");
				}else{
					children[t].parameters = parameters;					
				}
				children[t].selectableNode = selectable[s];
				children[t].moojType = "selectableOption";
				children[t].namespace = namespace;
				
				var type = children[t].getAttribute("type");
				if(type != undefined) children[t].type = type;
				
				var kbd = children[t].getElementsByTagName("kbd");
				for(i=0;i<kbd.length;i++){
					
					kbd[i].style.cursor = "pointer";
					kbd[i].setAttribute("onclick",'javascript: mSelectInsideAction(this);');
					
				}
				
				
				
				var useArray = children[t].getAttribute("array");
				var sid = parseInt(children[t].getAttribute("sid"));
				var id ="";
				
				if(mIsSelected(children[t])){
					id = sid;
					var key = "s"+id;
					mSelectPicked[namespace].add(key,children[t]);
				}
				if(useArray){
//					useArray = useArray+"["+sid+"]";
					useArray = useArray+"[]";
				}
				if(sid != undefined){
					children[t].innerHTML += '<input id="input-'+sid+'" type="hidden" value="'+children[t].getAttribute("href")+'" name="'+useArray+'"></input>';
					children[t].sid = sid;
				}		
		}
		
		
	}		
}

function mSelectableOptions(node){
	return dojo.query('.mSelect, .mSelectXL, .mSelectXXL, .mSelectXXXL',node);
}

function mIsSelected(item){
	var i = item.id;
	return (i=="selected" || i=="selectedXL" || i=="selectedXXL" || i=="selectedXXXL" );
}
