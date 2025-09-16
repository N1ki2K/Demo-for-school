/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function filesDropp(source,destination,orderingTop){
	
	if(_Browser.IE){
		setTimeout('rcMode("transfer")',50); 
	}else {
		rcMode("transfer");
	}
	
	return true;
}


function filesTask(task){
	
}



function filesDblc(node){
	transferState = "files";
	if(!_OS.Mac && !_Browser.Opera){
		rcOpen(node);		
	}else{
		setRightClick(1);
	}

}

function filesRefresh(){
	var node = currentFolderNode["folders"];
	
	var href = mainRootUri + "view=xhrfiles&dir="+ escape(node.getAttribute("url"));
	_LoadTo(href, 'splitInnerRight', function() {
		parseAll(_("splitInnerRight")); evalButtons();
	});	
}