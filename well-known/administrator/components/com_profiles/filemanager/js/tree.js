/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var showTreeInfo = true;

var mFolderLookUp = [];

function treePlusMinus(e){
	var cn = this.className;
	
	this.className = (cn=="plus")?"minus":"plus";
	var ul = getKidsByTagName(this.parentNode,"UL");
	if(ul){
		var a = this.nextSibling;
		ul[0].id = (cn=="plus")?"on":"off";
		loadTreeUL(ul[0]);
	}
	if(cn=="minus"){
		this.nextSibling.onclick(this.nextSibling);
		this.className="plus";
		this.nextSibling.className ="opened";
		ul[0].id = "off";
	}
}
var rememberUL = undefined;
function loadTreeUL(ul){
	if(ul.getAttribute('dummy')=="1"){
		ul.setAttribute("dummy","0");
		var foldersURL = mainRootUri+"view=xhrfolders&dir="+escape(ul.previousSibling.getAttribute("url"));
		rememberUL = ul;
		_LoadTo(foldersURL,ul,afterLoadTree);		
	}
}

function reloadTreeUL(node){
	if(node==_("rootFolderLink")){
		refreshRoot();
		return false;
	}
	var foldersURL = mainRootUri+"view=xhrfolders&dir="+node.getAttribute("url");
	var destNode = nextTag(node,"UL");
	destNode.innerHTML ="";
	destNode.id="on";
	destNode.setAttribute("dummy","1");
	loadTreeUL(destNode);
}

var isRootTreeRefresh = 0;
function refreshRoot(){
	isRootTreeRefresh = 1;
	var root = _("rootFolderLink");
	var ul = nextTag(root,"UL");
	var url = mainRootUri+"view=xhrfolders";
	ul.innerHTML ="";
	ul.id="on";
	ul.setAttribute("dummy","0");
	_LoadTo(url,ul,afterLoadTree);	
}


function afterLoadTree(){
	if(rememberUL){
		var plusMinus = previousTag(rememberUL,"DIV");
		if(rememberUL.innerHTML != ""){
			plusMinus.className="minus";
		}
		rememberUL = undefined;
	}
	
	
	if(isRootTreeRefresh){
		isRootTreeRefresh = 0;
		//Start finding the right path for current listing
		var currentDir = dojo.byId("currentDir");
		
		if(currentDir){
			var path = currentDir.value.split('%2F');
			if(path.length){
				path.reverse();
				path.pop();
				path.reverse();
			}			
			var highLightLink = dojo.byId("rootFolderLink");
			var _path = "";
			if(! path.length){
				highLightLink.className = "opened";
				parseTree();
				return;
			}
			treeRecursivePath(highLightLink, path, _path);			
		}
	}else{
		parseTree();
	}
}

function treeRecursivePath(highLightLink, path, _path){
		_path += "%2F" + path[0];
		path.reverse();
		path.pop();
		path.reverse();
		
		dojo.query("a[url="+_path+"]", dojo.byId("rootWrap")).forEach(dojo.hitch(this,function(a){
			highLightLink = a;
			var ul = a.nextSibling;
			if(ul.getAttribute('dummy')=="1"){
				ul.setAttribute("dummy","0");
				ul.setAttribute("id","on");
				var foldersURL = mainRootUri+"view=xhrfolders&dir="+escape(a.getAttribute("url"));
				_LoadTo(foldersURL,ul,dojo.hitch(this,function(){
					var plusMinus = previousTag(ul,"DIV");
					if(ul.innerHTML != ""){
						plusMinus.className="minus";
					}
					if(path.length){
						treeRecursivePath(highLightLink, path, _path);
					}else{
						highLightLink.className = "opened";
						parseTree();				
						console.log("after parseTree");
						currentFolderNode[a.namespace] = a;
					}
				}));		
			}else{
				parseTree();
			}
		}));
		
	
}



var currentFolderNode = new Array();
var renameHeap = new Array();
var keyPressed = new Array();

function folderOnClick(e){
	infoTipReset();
	var cn = this.className;
	this.className = "opened";
	if(currentFolderNode[this.namespace] && currentFolderNode[this.namespace]!= this){
		currentFolderNode[this.namespace].className = "closed";
	}
	
	currentFolderNode[this.namespace] = this;
	var prev = this.previousSibling;
	if(prev.className=="plus"){
		prev.className= "minus";
		var ul = getKidsByTagName(this.parentNode,"UL");
		if(ul){
			ul[0].id = "on";
			loadTreeUL(ul[0]);
		}
	}
	if(this.params.click ){
		if(funcExists(this.params.click)){
			var exec = this.params.click+'("'+this.href+'");';
			eval(exec);
		}
	}
	return false;
}

function folderDragStart(item){
	dojo._setOpacity(item,0.5);
	item.infoOnMouseOut(item);
	return true;
}
function folderDragStop(item){
	mDrag.infoTo();
	dojo._setOpacity(item,1);
	if(item.parameters.dropfunc){
		if(funcExists(item.parameters.dropfunc)){
			
				mDrag.hoverItem.style.border = "1px solid #e5eefb";
				mDrag.hoverItem.style.cursor = "pointer";
				if( typeof mDrag.hoverItem.firstChild.style != "undefined" ) mDrag.hoverItem.firstChild.style.cursor = "pointer";
				eval(item.parameters.dropfunc+"(item,mDrag.hoverItem,mDrag.orderingTop);");

		}
	}
	return true;
}
function folderDropNoMatch(item){
	mDrag.infoTo();
	dojo._setOpacity(item,1);
	return true;
}


function refreshFolder(dir){
	var foldersURL = mainRootUri+"view=xhrfolders&dir="+dir;
	var destNode = nextTag(currentFolderNode["folders"],"UL");
	_LoadTo(foldersURL,destNode,afterLoadTree);		
}

function folderOnDoubleClick(e){
	if( ! this.params.rename) return false;
	return rcRename();
}

var testCounter = 0;
function renameFolder(e){
	if(!renameHeap[this.namespace]) return false;
	if (!e) var e = window.event;

	if(e.type!="blur" && e.keyCode != 13){
		return true;
	}

	var value = this.value;
	if(value == renameHeap[this.namespace].stripTags()){
		// Still the same name
		renameHeap[this.namespace] == undefined;
		this.father.innerHTML = '<span>'+value+'</span>';
	}else {
		// Different Name
		renameHeap[this.namespace] == undefined;
		if(funcExists(this.father.params.rename)){
		var exec = this.father.params.rename+'("'+this.father.getAttribute('href')+'");'
		eval (exec);
		}
		this.father.innerHTML = '<span>'+value+'</span>';
	}
	
	return false;
}

function folderMouseOver(e){
//	this.style.cursor = 'pointer';
	if(mDrag.dragging){
		this.style.border =  "1px solid #7da2ce";
		this.style.cursor = 'copy';
		this.firstChild.style.cursor = 'copy';
	}else{
		this.style.textDecoration ="underline";
	}
	if(this.parameters.droppable && mDrag.dragging){
//		mMouse = detectMousePosition(e);
			mDrag.setHoverItem(this);			
		
	}
	if(showTreeInfo && !mDrag.dragging){
		this.infoOnMouseOver(e);
	}
	
}

function folderMouseOut(e){
//	this.style.cursor = 'auto';
	if(mDrag.dragging){
		this.style.border =  "1px solid #e5eefb";
		this.style.cursor = 'pointer';
		this.firstChild.style.cursor = 'pointer';
	}else{
		this.style.textDecoration = "none";
	}
	if(this.parameters.droppable && mDrag.dragging){
		mDrag.setHoverItem();
	}
	if(showTreeInfo && !mDrag.dragging){
		this.infoOnMouseOut(e);
	}
}

function treeSortMovedFolders(data){
	console.log(data);
	var destination = data.destination;
	var folders = data.folders;
	var urls = data.urls;
	var hrefs = data.hrefs;
	var splitLeft = _("mSplitLeft");
	

	var destA = dojo.query('a[url='+destination+']', splitLeft );
	var destUL = null;
	if(	destA.length && 
		typeof destA[0].nextSibling !== "undefined" &&  
		destA[0].nextSibling.tagName == "UL" && 
		dojo.hasAttr(destA[0].nextSibling,"dummy") && 
		destA[0].nextSibling.getAttribute("dummy") != "1"  
		){
			//destUL is next sibling
			destUL = destA[0].nextSibling;
	}
	
	if(	destA.length && 
			typeof destA[0].nextSibling !== "undefined" &&  
			destA[0].nextSibling.tagName == "UL" &&
			typeof destA[0].previousSibling	!== "undefined" &&
			dojo.hasClass(destA[0].previousSibling, "spacer")
		){
			destA[0].previousSibling.className = "plus";
			destA[0].previousSibling.style.cursor = "pointer";
			destA[0].previousSibling.onclick = treePlusMinus;
			destA[0].previousSibling.namespace = destA[0].namespace;
			if(_Browser.IEVersion() == 6){
				destA[0].previousSibling.innerHTML = "&nbsp; &nbsp;";
			}
	}
	
	
	
	var count = 0;
	dojo.forEach(folders, dojo.hitch(this,function(folder){
		var query = 'a[url='+folder+']';
		dojo.query(query, splitLeft ).forEach( dojo.hitch(this, function(found){

			var foundLI = found.parentNode;
			if(! destUL){
				_removeNode(foundLI);				
			}else{
				found.setAttribute("url", urls[count] );
				found.setAttribute("href", hrefs[count] );
				destUL.appendChild(foundLI);
			}
			count++;
		}));		
	}));
}


function treeCheckCopyAction(destination){
	var splitLeft = _("mSplitLeft");
	var destA = dojo.query('a[url='+destination+']', splitLeft );
	if(	destA.length && 
			typeof destA[0].nextSibling !== "undefined" &&  
			destA[0].nextSibling.tagName == "UL" &&
			typeof destA[0].previousSibling	!== "undefined" &&
			dojo.hasClass(destA[0].previousSibling, "spacer")
		){
			destA[0].previousSibling.className = "plus";
			destA[0].previousSibling.style.cursor = "pointer";
			destA[0].previousSibling.onclick = treePlusMinus;
			destA[0].previousSibling.namespace = destA[0].namespace;
			if(_Browser.IEVersion() == 6){
				destA[0].previousSibling.innerHTML = "&nbsp; &nbsp;";
			}
	}
}



function parseTree(startNode){
	startNode = startNode?startNode:document.body;
	var mFolders = dojo.query(".mFolder");
	for(var t=0, l= mFolders.length; t<l; t++){
		var parameters = generalParameters(mFolders[t]);
		var namespace = extractNamespace(parameters);
		parameters.dragstart="folderDragStart";
		parameters.dragstop ="folderDragStop";
		parameters.dropnomatch ="folderDropNoMatch";
		
		
		
		var	plusMinus = dojo.query(".plus,.minus",mFolders[t]);
			for(var i=0, ll = plusMinus.length; i<ll; i++){	
			plusMinus[i].onclick = treePlusMinus;
			plusMinus[i].namespace = namespace;
			plusMinus[i].style.cursor = "pointer";
			if(_Browser.IEVersion() == 6){
				plusMinus[i].innerHTML = "&nbsp; &nbsp;";
			}
			
		}
		
		var folder = dojo.query(".opened,.closed",mFolders[t]);
		for(var i=0, lll= folder.length; i<lll; i++){

			mFolderLookUp[folder[i].getAttribute("url")] = folder[i];
			
			folder[i].onclick = folderOnClick;
			folder[i].ondblclick = folderOnDoubleClick;
			folder[i].onmouseover = folderMouseOver;
			folder[i].onmouseout = folderMouseOut;
			folder[i].namespace = namespace;
			folder[i].params = parameters;
			folder[i].parameters = parameters;
			folder[i].moojType = "treeItem";
			folder[i].infoTip = folder[i].getAttribute("finfo");
			folder[i].infoOnMouseOver = infoOnMouseOver;
			folder[i].infoOnMouseOut = infoOnMouseOut;
			folder[i].onmousedown = mDrag.mouseDown;
		}
	}
	
	
	
	
}



