/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function linkCheck(node){
	var rel = node.getAttribute("rel");
	if(rel=="window") return true;
	var focus = linkFocus(node);
	if(!focus) return true;
	var href = node.getAttribute("href");
	var use = focus.getAttribute("use");
	if(use){
		linkUse(use,href);
		return false;
	}
	var loadCallback = dojo.hitch(this,
			function(response,ioArgs){
				focus.innerHTML = response;
				setTimeout(dojo.hitch(this,function(){parseAll(focus)}),200);
				mWait.stop();
				return true;
	});
	mWait.play();
	dojo.xhrGet({
	    url: href,
	    load: loadCallback,
	    error: function(response, ioArgs){
			mWait.stop();
	        console.log("Failed XHR: ", response, ioArgs);
	        
	    }
	});
	return false;
}

function linkFocus(node){
	var rel = node.getAttribute("rel");
	if(node == document.body) return null;
	if(rel == "wrapper") return node;
	else return linkFocus(node.parentNode);
}

function linkOnClick(){
	var exec = linkCheck(this); return exec;
}

function linkUse(use,url){
	switch (use) {
	case "flyout":
		loadPrompt(url);
		break;

	default:
		break;
	}
}



function parseLinks(startNode){
	
	startNode = startNode?startNode:document.body;
	aNodes = startNode.getElementsByTagName("a");
	for(t=0; t<aNodes.length; t++){
		node = aNodes[t];
		if(node.onclick == undefined || node.onclick == null){
			node.onclick = linkOnClick;
		}
	}	
}
dojo.addOnLoad(function(){parseLinks(); mLoader.add("Parse Links");});