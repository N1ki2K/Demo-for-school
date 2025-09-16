/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function parseAll(parseNode, noScripToHead){
	noScripToHead = noScripToHead?true:false;
	
	// append all scripts to head
	if(! noScripToHead){
		script2head(parseNode);	
	}
	
	// Tree parser
	if(funcExists("parseTree")){
		parseTree(parseNode);
	}
	
	// Link parser
	if(funcExists("parseLinks")){
		parseLinks(parseNode);
	}
	
	// Forms parser
	if(funcExists("parseForm")){
		parseForm(parseNode);
	}
	
	
	// InfoTip parser
	if(funcExists("parseInfoTips")){
		parseInfoTips(parseNode);
	}
	
	// Select parser
	if(funcExists("parseSelect")){
		parseSelect(parseNode);
	}
	
	// Check for order advice cleaning
	if(typeof mTableHeader != "undefined"){
		mTableHeader.cleanOrder(0);
	}
	
	// Check for search cleaning
	if(typeof mSearch != "undefined"){
		mSearch.checkFresh();
	}
	
	// Check for go up buttons
	if(typeof mGoUpButton != "undefined" && mGoUpButton){
		var dirNode = dojo.byId("mGoUpUrl");
		var urlValue = dirNode ? dojo.trim(dirNode.innerHTML) : "";
		mGoUpButton.id = urlValue ? "" : "disabled";
		mGoUpButton.setAttribute("url",urlValue);
	}
	
	
	// Parse CodeMirror Edit Area
	if(parseNode && typeof CodeMirror != "undefined"){
		
		dojo.query("span.mCodeMirrorData", parseNode).forEach(function(node){
			
			var sid = node.getAttribute("sid") || null;
			var syntax = node.getAttribute("syntax") || "";
			syntax = dojo.trim(syntax);
			var height = node.getAttribute("height") || 550;
			
			
			window[ "mCodeMirror" + sid]  = CodeMirror.fromTextArea(
					_("mEditArea-" + sid), 
					{  lineNumbers: true,
					   theme: "eclipse",
					   matchBrackets: true,
					   mode: syntax,
					   indentUnit: 4,
					   indentWithTabs: true,
					   enterMode: "keep",
					   tabMode: "shift"
	  				});
			window[ "mCodeMirror" + sid].setSize("100%", height + "px");
			window[ "mCodeMirror" + sid].on("focus",function(){editingFocus = true; });
			window[ "mCodeMirror" + sid].on("blur",function(){editingFocus = false;});
			
		});		
	}

	
	// Check Copy Action
//	var checkCopyAction = dojo.byId("mCopyAction");
//	if(checkCopyAction && dojo.hasAttr(checkCopyAction,"url")){
//		treeCheckCopyAction( checkCopyAction.getAttribute("url") );		
//	}
	
	
}//EOF parseAll