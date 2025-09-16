/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function mFormSubmit(node){
	hideInfoTip();
	var focus = formFocus(node);
	if (!focus) return true;
	
	var href = node.action;
	var use = focus.getAttribute("use");
	if(use){
		formUse(use,href,node);
		return false;
	}
	
	var loadCallback = dojo.hitch(this,
			function(response,ioArgs){
				focus.innerHTML = response;
				setTimeout(dojo.hitch(this,function(){parseAll(focus)}),200);
				mWait.stop();
				hideInfoTip();
				return true;
	});
	mWait.play();
	dojo.xhrPost({
	    url: href,
	    load: loadCallback,
	    form: node,
	    error: function(response, ioArgs){
			mWait.stop();
	        console.log("Failed XHR: ", response, ioArgs);
	        
	    }
	});
	return false;
}

function formFocus(node){
	var rel = node.getAttribute("rel");
	if(node == document.body) return null;
	if(rel == "wrapper") return node;
	else return formFocus(node.parentNode);
}

function formUse(use,url,form){
	switch (use) {
	case "flyout":
		loadPrompt(url,form);
		break;

	default:
		break;
	}
}

function mFormOnSubmit(){
	var exec = mFormSubmit(this); return exec;
}

function mCodeMirrorSubmit(name){
	var obj = window["mCodeMirror"+name];	
	obj.toTextArea();
}



function parseForm(startNode){
	startNode = startNode?startNode:document.body;
	formNodes = startNode.getElementsByTagName("form");
	for(t=0; t<formNodes.length; t++){
		node = formNodes[t];
		if(node.getAttribute("target")!= "window"){
			node.onsubmit = mFormOnSubmit;
		}
	}	
}