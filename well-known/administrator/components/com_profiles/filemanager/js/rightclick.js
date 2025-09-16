/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mRightClick = _('rightClick');
var transferState = "files";
var noDocumentRC = false;
var rctStyle = _S("rcTransfer");
var isLock = new Array();
var forceInputFocus = undefined;
var mGoUpButton  = null;


var mrcStyle = mRightClick.style;
dojo.addOnLoad( function() {
	dojo._setOpacity(_("rcShadow"), 0.5);
	dojo._setOpacity(_("rcBottom"), 0.5);
	dojo._setOpacity(_("rcCorner"), 0.5);
	rctStyle.display = "none";
	_S("rcShadowImg").height = _Dimensions(_("rcContent")).height + "px";
	dojo.query("a[name=goup]").forEach(function(node){mGoUpButton = node;});
	mLoader.add("Rightclick opacity settings");
});

function setRightClick(state) {
	if (state) {
		noDocumentRC = true;
		var dim = _Dimensions('rightClick');
		var winDim = _WindowSize();

		var top = globalMouse.y;
		if ((top + dim.height) > winDim.height) {
			top -= dim.height - 5;
		}

		var add = 0;
		mrcStyle.left = (globalMouse.x + add) + "px";
		mrcStyle.top = (top + add) + "px";

	} else {
		mrcStyle.left = "-9999em";
		// Hack for popupRightClick
		var rcPopup = dojo.byId("rightClickPopup");
		if(rcPopup){
			rcPopup.style.left = "-9999em";
		}
			
	}
	// document.body.focus();
}

function rcMode(name) {
	_S("rcShadowImg").height = "0px";
	switch (name) {
	case "transfer":
		rctStyle.display = "block";
		_S("noRcTransfer").display = "none";
		_S("rcCopy").display = "block";
		break;

	case "singlefoldertransfer":
		rctStyle.display = "block";
		_S("noRcTransfer").display = "none";
		_S("rcCopy").display = "none";
		break;	
		
		
	case "folder":
		
		if(typeof(currentFolderNode["folders"].id) != "undefined" && currentFolderNode["folders"].id == "rootFolderLink"){
			rctStyle.display = "none";
			_D("rcNew", 1);
			_D("rcDelete");
			_D("rcOpenFile");
			_D("rcUnPack");
			_D("rcDownload");
			_D("rcChmod");
			_D("rcRename");
			
		}else{
			rctStyle.display = "none";
			_D("noRcTransfer", 1);
			_D("rcNew", 1);
			_D("rcOpenFile");
			_D("rcDownload");
			_D("rcUnPack");
			_D("rcChmod", 1);
			_D("rcRename",1);
			_D("rcDelete",1);
			rcLock("rcRename", 1);
		}
		
		
		break;

	case "file":
	default:
		rctStyle.display = "none";
		_D("noRcTransfer", 1);
		_D("rcNew");
		_D("rcOpenFile", 1);
		_D("rcDownload", 1);
		_D("rcUnPack", 1);
		_D("rcChmod", 1);
		_D("rcRename",1);
		_D("rcDelete",1);

		if (mSelectPicked["files"].count > 1) {
			rcLock("rcOpenFile");
			rcLock("rcDownload");
			rcLock("rcRename");
			rcLock("rcUnPack");
		} else {
			var rcdValue = mSelectPicked["files"].hasFolder() ? 0 : 1;
			rcLock("rcDownload", rcdValue);
			rcLock("rcRename", 1);
			var currNode = rcGetSingleFile();
			var ext = currNode.getAttribute("type");
			if (ext == "zip") {
				rcLock("rcUnPack", 1);
			} else {
				rcLock("rcUnPack");
			}

			if (ext != null
					&& (mSuffix.textEdit[ext] != undefined || mSuffix.players[ext] != undefined)) {
				rcLock("rcOpenFile", 1);
			} else {
				rcLock("rcOpenFile");
			}

		}

		break;
	}
	_S("rcShadowImg").height = _Dimensions(_("rcContent")).height + "px";

	setRightClick(1);
}



function rcTransferTask(task) {
	switch (transferState) {
	case "files":
		if (task == "copy") {
			_("selectFilesTask").value = "copy";
		} else if (task == "move") {
			_("selectFilesTask").value = "move";
		} else if (task == "remove") {
			_("selectFilesTask").value = "remove";
		}

		var selectStopNo = parseInt(_("selectStopNo").getAttribute("value"));
		for (t = 0; t < selectStopNo + 1; t++) {
			var node = _("input-" + t);
			if (node && node.value == "") {
				_removeNode(node);
			}
		}
		
		var destPath = dojo.hasAttr(mDrag.hoverItem,"url") ? mDrag.hoverItem.getAttribute("url") : mDrag.hoverItem.getAttribute("href");
		_("destinationFolder").value = destPath;
		mFormSubmit(_('filesFormNode'));
		mDrag.setHoverItem();
		break;

	case "folder":
		mrcStyle.left = "-9999em";
		var sourcePath =  dojo.hasAttr(folderAction.source,"url") ? folderAction.source.getAttribute("url") : folderAction.source.getAttribute("href");
		var destinationPath = dojo.hasAttr(folderAction.destination,"url") ? folderAction.destination.getAttribute("url") : folderAction.destination.getAttribute("href");
		if(sourcePath == destinationPath) return;
		var uri = _("filesFormNode").getAttribute("action") +
					"&task="+task + 
					"&destination="+encodeURIComponent(destinationPath)+
					"&singlefolder="+encodeURIComponent(sourcePath)+
					"&dir=" + encodeURIComponent(_("currentDir").value) ;
		console.log(uri);
		
		var errBack = dojo.hitch(this, function(response, ioArgs) {
			console.log("Failed XHR: ", response, ioArgs);
			mWait.stop();
			return false;
		});
		
		var lcb = function(response, ioArgs) {
			var trimed = dojo.trim(response);
			if (trimed.indexOf("_fmError") == -1) {
				// After folder action move or copy
				_("splitInnerRight").innerHTML = response;
				parseAll(_("splitInnerRight"));
				evalButtons();
				
			} else {
				var letsdarken = dojo.hitch(this,function(){newDarkenPopup("error",mText.error,response,500,250); });
				setTimeout(	letsdarken,	600);
			}
			mWait.stop();
			return true;
		};
		
		dojo.xhrGet( {
			url :uri,
			load :lcb,
			error :errBack
		});
		
		break;

	default:
		break;
	}

}

function rcPack() {
	var text = '<br><span style="margin-left:11px;" >'
			+ mText.archive_name
			+ "</span><br>"
			+ '<div class="askWrapper" ><input class="renameInput" type="text" value="" id="nameZip" />';

	switch (transferState) {
	case "files":
		text += '<a class="askButton" style="width:60px;" href="" onclick="javascript: rcFilesPack(); return false;">'
				+ mText.pack + "</a> </div>";
		break;

	case "folder":
		text += '<a class="askButton" style="width:60px;" href=""  onclick="javascript: rcFoldersPack(); return false;">'
				+ mText.pack + "</a> </div>";
		break;
	}
	allowKeyRemove = false;
	newDarkenPopup("Pack", mText.pack, text, 400, 100).closeCallback = function(){allowKeyRemove = true;};
}

function rcFilesPack() {

	if (mSelectPicked["files"].count === 0) {
		rcFoldersPack();
		return false;
	}

	var zipName = _("nameZip").value;
	closePopup('Pack');
	if (!zipName) {
		// return false;
	} else {
		_("zipName").value = zipName;
	}
	_("selectFilesTask").value = "zip";
	var selectStopNo = parseInt(_("selectStopNo").getAttribute("value"));
	for (t = 0; t < selectStopNo + 1; t++) {
		var node = _("input-" + t);
		if (node.value == "") {
			_removeNode(node);
		}
	}
	_("destinationFolder").value = "";
	mFormSubmit(_('filesFormNode'));
	mDrag.setHoverItem();
}

function rcFoldersPack() {
	var zipName = _("nameZip").value;
	closePopup('Pack');
	if (!zipName) {
		// return false;
	} else {
		_("zipName").value = zipName;
	}
	var node = currentFolderNode["folders"];
	var href = node.getAttribute("url");
	var url = mainRootUri + "view=xhrfolders&task=zip&dir=" + escape(href)
			+ "&zipname=" + escape(zipName);
	mWait.play();
	var lcb = dojo
			.hitch(
					this,
					function(response, ioArgs) {
						console.log(response);
						var trimed = dojo.trim(response);
						if (trimed.indexOf("_fmError") == -1) {

							var refreshUrl = mainRootUri + "view=xhrfiles&dir="
									+ escape(href);
							_LoadTo(refreshUrl, 'splitInnerRight', function() {
								parseAll(_("splitInnerRight"));
							});
						} else {
							setTimeout(
									'newDarkenPopup("error",mText.error,"Can not pack folder",500,250)',
									600);
						}
						mWait.stop();
						return true;
					});
	rcXHR(url, lcb);

}

function rcUnpack() {
	if (isLock["rcUnPack"])
		return false;
	var picked = rcGetSingleFile();
	if (!picked)
		return false;
	var href = null;
	try {
		href = picked.getAttribute("href");
	} catch (e) {
		console.log("Select Item has no href!")
	}
	if (href) {
		_("selectFilesTask").value = "unzip";
		_("selectedFile").value = escape(href);
		mFormSubmit(_('filesFormNode'));
		mDrag.setHoverItem();
	} else
		return false;
}

function rcRemove() {
	if (mSelectPicked["files"].count === 0) {
		transferState = "folder";
	}

	closePopup('askremove');
	switch (transferState) {
	case "files":
		_("selectFilesTask").value = "remove";
		var selectStopNo = parseInt(_("selectStopNo").getAttribute("value"));
		for (t = 0; t < selectStopNo + 1; t++) {
			var node = _("input-" + t);
			if (node.value == "") {
				_removeNode(node);
			}
		}
		_("destinationFolder").value = "";
		mFormSubmit(_('filesFormNode'));
		mDrag.setHoverItem();
		break;

	case "folder":
		var node = currentFolderNode["folders"];
		var url = mainRootUri + "view=xhrfolders&task=remove&dir="
				+ escape(node.getAttribute("url"));
		mWait.play();
		var lcb = dojo
				.hitch(
						this,
						function(response, ioArgs) {
							console.log(response);
							var trimed = dojo.trim(response);
							if (trimed.indexOf("_fmError") == -1) {
								var parentA = node.parentNode.parentNode.previousSibling;
								parentA.onclick();
								_removeNode(node.parentNode);
								if(parentA==_('rootFolderLink')){
									var ul = nextTag(parentA,"UL");
									if(dojo.trim(ul.innerHTML) == ""){
										previousTag(parentA,"DIV").className="spacer";									 
									}
								}
							} else {
								var responseError = dojo.trim(response.replace("_fmError",""));
								responseError = responseError ? responseError : mText.nofolderremove;
								setTimeout(
										'newDarkenPopup("error",mText.error,"<div class=\'mPopupAuthError\'>'+responseError+'</div>",500,150)',
										600);
							}
							mWait.stop();
							return true;
						});
		rcXHR(url, lcb);

	}
}

function askRemove() {
	var text = '<center><br>'
			+ mText.reallyremove
			+ "<br>"
			+ '<div class="askWrapper" ><a class="askButton" href="" onclick="javascript: rcRemove(); return false;">'
			+ mText.remove
			+ "</a> "
			+ '<a class="askButton" href="" onclick="javascript: closePopup(\'askremove\'); return false;">'
			+ mText.cancel + "</a> </div>" + "</center>";
	newDarkenPopup("askremove", mText.reallyremove, text, 300, 100);
}

function rcDownload() {
	if (isLock["rcDownload"])
		return false;
	var picked = mSelectPicked['files'].getAll();
	if (picked.length != 0) {
		var href = null;
		try {
			href = picked[0].getAttribute("href");
		} catch (e) {
			console.log("Select Item has no href!")
		}
		if (href) {
			window.location = mainRootUri + "view=xhranyfile&dir="
					+ escape(href);
			mDrag.setHoverItem();
		}
	}
}

function rcFilesRename() {
	if (_Browser.IE)
		clearInputFocus();
	if (mSelectPicked["files"].count === 0) {
		rcFoldersRename();
		return false;
	}

	var renameNewName = _("newNameInput").value;
	closePopup('rename');
	if (!renameNewName) {
		return false;
	}

	var picked = rcGetSingleFile();
	if (!picked)
		return false;
	var href = null;
	try {
		href = picked.getAttribute("href");
	} catch (e) {
		console.log("Select Item has no href!")
	}
	if (href && renameNewName) {
		_("selectFilesTask").value = "rename";
		_("selectedFile").value = escape(href);
		_("newFileName").value = renameNewName;
		mFormSubmit(_('filesFormNode'));
		mDrag.setHoverItem();
	} else
		return false;
}

function rcFoldersRename() {
	if (_Browser.IE)
		clearInputFocus();
	var renameNewName = dojo.trim(_("newNameInput").value.replace(/^.*(\\|\/|\:)/, '') );

	
	closePopup('rename');
	if(!renameNewName) return;
	
	var node = currentFolderNode["folders"];
	var oldPath =  unescape(node.getAttribute("url"));
	var dirName =  oldPath.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
	
	var url = mainRootUri + "view=xhrfolders&task=rename&file="
			+ escape(node.getAttribute("url")) + "&newname=" + renameNewName;
	mWait.play();
	var lcb = dojo.hitch(
					this,
					function(response, ioArgs) {
						if (dojo.trim(response) == "ok") {
							node.firstChild.innerHTML = renameNewName;
							var newPath = encodeURIComponent( dirName + "/" + renameNewName );
							node.setAttribute("url",newPath);
							var newURL = mainRootUri + "view=xhrfiles&dir="	+ newPath ;
							node.setAttribute("href",newURL);
							
							_LoadTo(newURL, 'splitInnerRight', function() {
								_("mHeaderPath").innerHTML = _("mFetchTitle").innerHTML;
								parseAll(_("splitInnerRight")); evalButtons();
							});
							
							
						} else {
							setTimeout(
									'newDarkenPopup("error",mText.error,"Folder exists or is write protected ",500,250)',
									600);
						}
						mWait.stop();
						return true;
					});

	rcXHR(url, lcb);
}

function rcGetSingleFile() {
	var picked = mSelectPicked['files'].getAll();
	if (picked.length == 1) {
		return picked[0];
	} else
		return null;

}

function rcRename() {
	if (isLock["rcRename"])
		return false;
	var text = "";
	switch (transferState) {
	case "files":
		var picked = rcGetSingleFile();
		if (!picked)
			return false;
		var baseName = picked.getAttribute("baseName");
		text = '<br><span style="margin-left:11px;" >'
				+ mText.newname
				+ "</span><br>"
				+ '<div class="askWrapper" ><input class="renameInput" type="text" value="'
				+ baseName + '" id="newNameInput" />';
		text += '<a class="askButton" style="width:60px;" href="" onclick="javascript: rcFilesRename(); return false;">'
				+ mText.change + "</a> </div>";
		break;

	case "folder":
		var baseName = currentFolderNode["folders"].firstChild.innerHTML;
		text = '<br><span style="margin-left:11px;" >'
				+ mText.newname
				+ "</span><br>"
				+ '<div class="askWrapper" ><input class="renameInput" type="text" value="'
				+ baseName + '" id="newNameInput" />';
		text += '<a class="askButton" style="width:60px;" href=""  onclick="javascript: rcFoldersRename(); return false;">'
				+ mText.change + "</a> </div>";
		break;
	}
	
	allowKeyRemove = false; 
	newDarkenPopup("rename", mText.rename, text, 400, 100).closeCallback = function(){allowKeyRemove = true;};

	dojo.connect(_("newNameInput"), "onkeydown", rcRenameKeyDown);
	if (_Browser.IE)
		forceInputFocus = setTimeout(permanentInputRenameFocus);
	else
		_("newNameInput").focus();
}

function permanentInputRenameFocus() {
	_("newNameInput").focus();
	forceInputFocus = setTimeout(permanentInputRenameFocus);
}

function rcRenameKeyDown(evt) {

	evt = (evt) ? evt : (window.event) ? event : null;
	if (evt) {
		var charCode = (evt.charCode) ? evt.charCode
				: ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
	}

	if (dojo.keys.ENTER != charCode)
		return true;
	else if (transferState == "files")
		rcFilesRename();
	else
		rcFoldersRename();
	return false;
}

function rcOpen(item) {
	if (isLock["rcOpenFile"])
		return false;

	var node = item;
	if (!item) {
		var picked = rcGetSingleFile();
		if (!picked)
			return false;
		else
			node = picked;
	}

	var ext = node.type;
	if(!ext){
		// extension is a folder
		var href = node.getAttribute("href") || -1;
		var lpu = mFolderLookUp[href] || null;
		if(lpu) lpu.onclick();
	}
	else{
	// Extension is defined and a file	
		var basename = ": " + node.getAttribute("basename");
		if (mSuffix.textEdit[ext] != undefined && ext != null) {
			// var url =
			// mainRootUri+"view=xhredit&syntax="+mSuffix.textEdit[ext]+"&dir="+escape(node.getAttribute("href"))+"&height="+_ViewportOffset(mWindowContent).h;
			var window = _ViewportOffset(mWindowContent);
			var popupWidth = Math.floor(window.w * 90 / 100);
			var popupHeight = Math.floor(window.h * 90 / 100);
			var pInnerHeight = popupHeight - editAreaMarginBottom;
			var url = mainRootUri + "view=xhredit&syntax=" + mSuffix.textEdit[ext]
					+ "&dir=" + escape(node.getAttribute("href")) + "&height="
					+ pInnerHeight + "&sid=" + node.sid;
	
			loadPopup("Edit" + node.sid, mText.edit + basename, url, popupWidth, popupHeight,
					undefined, undefined, true);
			// loadPrompt(url);
		} else if (mSuffix.players[ext] != undefined) {
			var unique =  Date.now();
			var url = mainRootUri + "view=xhrplayer&task=" + mSuffix.players[ext]
					+ "&dir=" + escape(node.getAttribute("href")) + "&unique=" + unique;
	
			switch(ext){
				case "mp3":
					loadPopup("Player" + node.sid, mText.mp3_player + basename, url, 532, 70,
							undefined, undefined, false);
					break;
				
				case "ogv":
				case "webm":
				case "flv":
				case "mp4":
					loadPopup("Player" + node.sid, mText.player + basename, url, 653, 265,
							undefined, undefined, true ,function(){
																	try{videojs("profiles_video_" + unique).dispose()}catch(ex){console.log(ex)};
																  }, true);
					break;
				default:
					loadPopup("Preview" + node.sid, mText.preview + basename, url, 800, 600,
							undefined, undefined, true);
					break;
			}//EOF switch case
	
		} else {
			rcDownload();
		}
	}//EOF extension is defined and file
}

function rcChangeMode() {
	var defaultMode = 0;
	if(transferState == "files"){
		var selectedFiles = mSelectPicked["files"].getAll();
		if(!selectedFiles) return;
		dojo.forEach(selectedFiles, dojo.hitch(this,function(selected){
			var chmod = selected.getAttribute("chmod") || 0;
			chmod = parseInt(chmod);
			if(chmod > defaultMode) defaultMode = chmod;			
		}));
		defaultMode = defaultMode || 644;
	}else{
		var currFolder = currentFolderNode["folders"]
		defaultMode = currFolder.getAttribute("chmod") || 777;
	}
	MCHMOD.popup(transferState,defaultMode);
}



function clearInputFocus() {
	if (forceInputFocus != undefined)
		clearTimeout(forceInputFocus);
	forceInputFocus = undefined;
}



function rcFilesMode() {
	if (_Browser.IE)
		clearInputFocus();
	var modeValue = _("modeValue").value;
	closePopup('Chmod');
	if (!modeValue) {
		return false;
	} else {
		_("changeMode").value = modeValue;
	}
	_("selectFilesTask").value = "chmod";
	var selectStopNo = parseInt(_("selectStopNo").getAttribute("value"));
	for (t = 0; t < selectStopNo + 1; t++) {
		var node = _("input-" + t);
		if (node.value == "") {
			_removeNode(node);
		}
	}
	mFormSubmit(_('filesFormNode'));
	mDrag.setHoverItem();
}

function rcFoldersMode() {
	if (_Browser.IE)
		clearInputFocus();
	closePopup('Chmod');
	var modeValue = _("modeValue").value;
	if (!modeValue) {
		return false;
	}
	var node = currentFolderNode["folders"];
	var url = mainRootUri + "view=xhrfolders&task=chmod&dir="
			+ escape(node.getAttribute("url")) + "&chmod=" + modeValue;
	mWait.play();
	var lcb = dojo
			.hitch(
					this,
					function(response, ioArgs) {
						console.log(response);
						var trimed = dojo.trim(response);
						if (trimed.indexOf("_fmError") == -1) {
							node.infoTip = response;
						} else {
							setTimeout(
									'newDarkenPopup("error",mText.error,"Can not change mode ",500,250)',
									600);
						}
						mWait.stop();
						return true;
					});
	rcXHR(url, lcb);

}

function rcNew() {
	var text =  '<center><div class="askWrapper" style="margin-left:10px;" id="newRadioWrap">'+
				'<a class="askButton" id="checked" href="" onclick="javascript: rcRadioClick(this); return false;">'+mText.folder+'</a>'+
				'<a class="askButton" id="" href="" onclick="javascript: rcRadioClick(this); return false;">'+mText.file+'</a>'+
				'</div></center><br>'
				+'<br><span style="margin-left:20px;" >'
				+ mText.please_enter_name
				+ "</span>"
				+ '<div class="askWrapper" style="clear:both;" ><input class="renameInput" type="text" value="" id="newItemInput" />';
	text += '<a class="askButton" style="width:60px;" href="" onclick="javascript: rcNewItem(); return false;">'
			+ mText.apply + "</a> </div>";

	allowKeyRemove = false;
	newDarkenPopup("New", mText.new_folder_file, text, 400, 150).closeCallback = function(){allowKeyRemove = true;};

	dojo.connect(_("newItemInput"), "onkeydown", rcNewKeyDown);
	if (_Browser.IE)
		forceInputFocus = setTimeout(permanentInputNewFocus);
	else
		_("newItemInput").focus();
}


function rcRadioClick(node){
	if(node.nextSibling){
		node.nextSibling.id ="";
	}else{
		node.previousSibling.id="";
	}
	node.id="checked";
	return false;
}

function permanentInputNewFocus() {
	_("newItemInput").focus();
	forceInputFocus = setTimeout(permanentInputNewFocus);
}

function rcNewKeyDown(evt) {

	evt = (evt) ? evt : (window.event) ? event : null;
	if (evt) {
		var charCode = (evt.charCode) ? evt.charCode
				: ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
	}

	if (dojo.keys.ENTER != charCode)
		return true;
	else {
		rcNewItem();
		return false;
	}
}

function rcNewItem(){
	if (_Browser.IE)
		clearInputFocus();
	var newItemInput = _("newItemInput").value;
	var isFolder = (_("newRadioWrap").firstChild.id == "checked");
	var node = currentFolderNode["folders"];
	closePopup('New');	
	var url = "";
	if(isFolder){
		url = mainRootUri + "view=xhrfolders&task=newitem&dir="
		+ escape(node.getAttribute("url")) + "&newname=" + newItemInput;
	}else{
		url = mainRootUri + "view=xhrfiles&task=newitem&dir="
		+ escape(node.getAttribute("url")) + "&newname=" + newItemInput;
	}
	mWait.play();
	var lcb = dojo
			.hitch(
					this,
					function(response, ioArgs) {
						var trimed = dojo.trim(response);
						if (trimed.indexOf("_fmError") == -1) {							
							if(isFolder){
								if(node == _('rootFolderLink')){
									_("rootWrap").firstChild.className="minus";
									refreshRoot();
								}else{
									reloadTreeUL(node);
								}
							}
						var href = mainRootUri + "view=xhrfiles&dir="+ escape(node.getAttribute("url"));
						_LoadTo(href, 'splitInnerRight', function() {
							parseAll(_("splitInnerRight")); evalButtons();
						});	
							
							
							
						} else {
							response = removeError(response);
							setTimeout(
									dojo.hitch(this,function(){
										newDarkenPopup("error",mText.error,response,500,250);
									}),
									300);
						}
						mWait.stop();
						return true;
					});
	rcXHR(url, lcb);
	
}

function rcUpload(){
	var node = currentFolderNode["folders"];
	var url = mainRootUri + "view=xhrupload&dir=" + escape(node.getAttribute("url"));
	loadPrompt(url);
}


function rcXHR(url, lcb) {
	var errBack = dojo.hitch(this, function(response, ioArgs) {
		console.log("Failed XHR: ", response, ioArgs);
		mWait.stop();
		return false;
	});
	
	return dojo.xhrGet( {
		url :url,
		load :lcb,
		error :errBack
	});
}

function rcLock(id, state) {
	var node = _(id);
	if (state) {
		dojo._setOpacity(node, 1);
		isLock[id] = false;
	} else {
		dojo._setOpacity(node, 0.5);
		isLock[id] = true;
	}
}

