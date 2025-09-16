/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function execButton(button,task){
	if(button.id=="disabled" || button.id=="active") return false;
	
	switch (task) {
	
	case "new":
		rcNew();
		break;
		
	case "rename":
		rcRename();
		break;
		
	case "unpack":
		rcUnpack();
		break;	
		
	case "pack":
		rcPack();
		break;
	
	case "upload":
		rcUpload();
		break;
		
	case "download":
		rcDownload();
		break;
		
	case "chmod":
		rcChangeMode();
		break;

	case "remove":
		askRemove();
		break;
			
	case "search":
		rcSearch();
		break;
		
	case "up":
		var splitLeft = _("splitInnerLeft");
		var url = button.getAttribute("url");
		dojo.query("a[url="+url+"]",splitLeft).forEach(function(node){
		previousTag(node.parentNode.parentNode,"A").onclick();
		});
		break;
			
		
	default:
		break;
	}
}

function evalButtons(){
	var count = ( typeof(mSelectPicked["files"]) != 'undefined'  ) ?  mSelectPicked["files"].count : 0 ;
	if( count === 0){
		mainButtons["download"].id="disabled";
		mainButtons["unpack"].id="disabled";
		mainButtons["rename"].id="";
		mainButtons["remove"].id="";
		mainButtons["chmod"].id="";
		rcLock("rcOpenFile");
		rcLock("rcDownload");
		rcLock("rcRename",1);
		rcLock("rcUnPack");
		if(typeof(currentFolderNode["folders"]) == "undefined"  ||  (typeof(currentFolderNode["folders"].id) != "undefined" && currentFolderNode["folders"].id == "rootFolderLink")   ){
			mainButtons["rename"].id="disabled";
			mainButtons["remove"].id="disabled";
			mainButtons["chmod"].id="disabled";
		}
		
		
		
	}else if(count > 1){
		mainButtons["download"].id="disabled";
		mainButtons["rename"].id="disabled";
		mainButtons["unpack"].id="disabled";
		mainButtons["chmod"].id="";
		rcLock("rcOpenFile");
		rcLock("rcDownload");
		rcLock("rcRename");
		rcLock("rcUnPack");
		
	}else{
		var downloadState = mSelectPicked["files"].hasFolder() ? "disabled" : "";
		mainButtons["download"].id= downloadState;
		mainButtons["rename"].id="";
		mainButtons["remove"].id="";
		mainButtons["chmod"].id="";
		rcLock("rcOpenFile",1);
		rcLock("rcDownload",1);
		rcLock("rcRename",1);
		var currNode = rcGetSingleFile();
		var ext = currNode.getAttribute("type");
		if(ext=="zip"){
			mainButtons["unpack"].id="";
			rcLock("rcUnPack",1);
		}else{
			mainButtons["unpack"].id="disabled";
			rcLock("rcUnPack");
		}
	}
	parseButtons();
}
