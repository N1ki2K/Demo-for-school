/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function renameFolder(href) {
	console.log("RenameTest Function executed");

}

function folderSelect(href) {
	if (!href)
		return false;
	_LoadTo(href, 'splitInnerRight', function() {
		_("mHeaderPath").innerHTML = _("mFetchTitle").innerHTML;
		parseAll(_("splitInnerRight")); evalButtons();
	});
}
var folderAction = new Object();


function folderDrop(source,destination,orderingTop){
	console.log("Fodler Drop Function executed");
	
	folderAction.source = source;
	folderAction.destination = destination;

	var sourcePath =  dojo.hasAttr(folderAction.source,"url") ? folderAction.source.getAttribute("url") : folderAction.source.getAttribute("href");
	var destinationPath = dojo.hasAttr(folderAction.destination,"url") ? folderAction.destination.getAttribute("url") : folderAction.destination.getAttribute("href");

	if(sourcePath == destinationPath || destinationPath.indexOf(sourcePath) === 0) {
		var content = '<div style="padding:10px; color:red; font-weight: bold;">' + mText.folderdroperror+'</div>';
		newDarkenPopup("dropError",mText.error,content,300,100);
		return false;
	}
	if(_Browser.IE){
		setTimeout('rcMode("singlefoldertransfer")',50); 
	}else {
		rcMode("singlefoldertransfer");
	}
	
	return true;
	
	
	
}