/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var stopWindowResizing = false;
var promptIsShowing = false;
var promptDuration = 500;
var myMarginBottom = 20;
var maxWidthPercent = 95;
var windowSize = _WindowSize();
var contentPane = _("mWindowContent");
var mWindowMaxWidth = Math.floor(windowSize.width * maxWidthPercent / 100);
var loadingPanePadding = 5;
var windowHeaderHeight = 102;

var promptMargin = 40;
var promptHeight = 150;
var promptFadeDuration = 500;

var editAreaMarginBottom = 65;

var nameSpaceCounter = 0;

var mMouse={x:0,y:0};
var mHeaderMargin = 26;

function setMWindowSize(){
	windowSize = _WindowSize();
	mWindowMaxWidth = Math.floor(windowSize.width * maxWidthPercent / 100);
	var contentPaneBounds = _ViewportOffset(mWindowContent);
	newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneBounds.t;
	mWindowContent.style.height = newContentPaneHeight+"px";
	
	dojo.style("mTableColWidth", {height: newContentPaneHeight +"px"});
	
	// Set SplitTable height
	if(isSplit) {
		ffSplitStyle.height = (newContentPaneHeight -mHeaderMargin)+"px";
		_S("splitInnerLeft").height = (newContentPaneHeight -mHeaderMargin)+"px";
		_S("splitInnerRight").height = (newContentPaneHeight -mHeaderMargin) +"px";
	}
	
	
	mWindow.style.width = mWindowMaxWidth +"px";
}





function tabMouseOver(node){
	var bounds = _AbsoluteBounds (node);
	var coords = dojo.coords(node);
	var us = _S("tabUnderlay");
	us.left = bounds.l +"px";
	us.width = coords.w + "px";
	dojo.fadeIn({node:_('tabUnderlay'),duration:300}).play();
}

function tabMouseOut(node){
	dojo.fadeOut({node:_('tabUnderlay'),duration:300}).play();
}

function setCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0, l=ca.length; i < l ;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
// getting the current mWindow Size by cookie
var currentWindowSize = 2;
if(!currentWindowSize){
	currentWindowSize = 2;
	//setCookie("moojWindowSize",0);
}

var contFadeDuration = 400;
function mWindowResize(size){
	if(size<0 || size >2 || stopWindowResizing) return null;
	if(size==currentWindowSize) return false;
	
	//setCookie("moojWindowSize",size);
	setTimeout("mContentResizing("+size+")",contFadeDuration);
	if(isSplit){
		_ToggleDisplay("ffSplitSizeHack");
	}
	switch (size) {
	
		default:
		case 0:
			dojo.fadeOut({node: mContentInner, duration:contFadeDuration, onEnd: function(){
				
				fadeWallPaper(0);
				_fx.animToTop(mEnvironment, 1000, defaultEnvironmentTop, function(){_S("module-menu").display = "block";});
				_fx.animToWidth(mWindow,1000,defaultWindowWidth, function(){dojo.fadeIn({node: mContentInner, duration:contFadeDuration}).play();} );	
			} }).play();
//			resizePromptAnimation(defaultWindowWidth);
			break;
			
		case 1: ;
		dojo.fadeOut({node: mContentInner, duration:contFadeDuration, onEnd: function(){
			fadeWallPaper(0);
			_fx.animToTop(mEnvironment, 1000, defaultEnvironmentTop, function(){_S("module-menu").display = "block";});
			_fx.animToWidth(mWindow,1000,mWindowMaxWidth, function(){dojo.fadeIn({node: mContentInner, duration:contFadeDuration}).play();}  );
		} }).play();
//			resizePromptAnimation(mWindowMaxWidth);
			break;
			
		case 2: ;
			dojo.fadeOut({node: mContentInner, duration:contFadeDuration, onEnd: function(){
			_S("module-menu").display = "none";
			fadeWallPaper(1);
			_fx.animToTop(mEnvironment, 1000, '0', undefined);
			_fx.animToWidth(mWindow,1000,mWindowMaxWidth, function(){dojo.fadeIn({node: mContentInner, duration:contFadeDuration}).play();}  );
			} }).play();
//			resizePromptAnimation(mWindowMaxWidth);
			break;
	}
	currentWindowSize = size;
}

function mWindowIEHack(status){
	if(_Browser.IE){
		
	}
}


// NEEDS TO BE REMOVED
function resizePromptAnimation(promptWidth){
	promptWidth -= 2;
	if(!promptIsShowing) {
		mInfoWrap.style.width= promptWidth +"px";
		return false;
	}
	_fx.animToWidth(mInfoWrap, 1000, promptWidth, undefined);
	_fx.animToWidth(mInfoMiddle, 1000, promptWidth, undefined);
}


var currentBackButton = undefined;
var buttonBackDownTimer = undefined;

function buttonBackUp(buttonNode){	
	cancelBackDown();
	if(currentBackButton != buttonNode && currentBackButton != undefined){
		buttonBackDown();
	}
	if(currentBackButton != undefined) return false;
	currentBackButton = buttonNode;
	
	new dojo._Animation({
		node: buttonNode,				
		duration: 300,
		rate:24,
		curve:[0,-45],
		easing: function(x){
					return x;
				},
		onAnimate: function(x){
					this.node.style.backgroundPosition = "0px "+x+"px";	
					}
		}).play();

}

function buttonBackDownDelayed(buttonNode){
	buttonBackDownTimer = setTimeout(buttonBackDown,1);
}

function cancelBackDown(){
	if(buttonBackDownTimer){
		clearTimeout(buttonBackDownTimer);
	}
}

function buttonBackDown(buttonNode){	
		buttonNode = currentBackButton;
		currentBackButton = undefined;
		buttonBackDownTimer = undefined;
		
		new dojo._Animation({
		node: buttonNode,				
		duration: 300,
		rate:24,
		curve:[-45,0],
		easing: function(x){
					return x;
				},
		onAnimate: function(x){
					this.node.style.backgroundPosition = "0px "+x+"px";	
					}
		}).play();
}

function fadeWallPaper(state){
	switch(state){
		default:
		case 0:
			if(mWallPaperStyle.display != "none"){
				dojo.fadeOut({node: mWallPaper,duration:1000, onEnd: function(){mWallPaperStyle.display = "none"}}).play();
			}			
			break;
		case 1:
			if(mWallPaperStyle.display != "block"){
				mWallPaperStyle.display = "block";
				dojo.fadeIn({node: mWallPaper,duration:1000}).play();
			}
			break;	
			
	}
}

function rememberSize(){
	if(currentWindowSize == 1){
		mWindow.style.width =  mWindowMaxWidth+"px";
	}else if (currentWindowSize == 2){
		mWallPaperStyle.display = "block";
		dojo._setOpacity(mWallPaper,1);
		mEnvironment.style.top =  "0px";
		mWindow.style.width =  mWindowMaxWidth+"px";
//		_S("module-menu").display = "none";
	}
}

function mContentResizing(size){
	
	switch (size) {
	case 2:
		newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneFull;
		break;

	default:
		newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneNormal;
		break;
	}
	
	_fx.animToHeight(mWindowContent, 1000, newContentPaneHeight, function(){
				if(ffSplitStyle != undefined){
				ffSplitStyle.height = newContentPaneHeight+"px";
				_ToggleDisplay("ffSplitSizeHack");
				}});
	
	// Split resizing
	if(isSplit){
		_fx.animToHeight("splitInnerLeft", 1000, newContentPaneHeight, function(){_S("splitInnerLeft").overflow = "auto";});
		_fx.animToHeight("splitInnerRight", 1000, newContentPaneHeight, function(){_S("splitInnerRight").overflow = "auto";});

	}//EOF isSplit
	
	
}//EOF contentPaneResizing

//++++++++++++++++++++++++
// Mouse Move Listener for for document mouse move routing
var mouseMoveListener = new Array();
var mouseMoveLength = 0;
var globalMouse = {x:0,y:0};
function mMouseCoords(e){  
	
	var mousex, mousey;
	
	if(!e){
		var e = window.event;
	}
	
	if (e.pageX || e.pageY){
		mousex = e.pageX;
		mousey = e.pageY;
	}else if(e.clientX || e.clientY){
			mousex = e.clientX;
			mousey = e.clientY;
		  }
	
	globalMouse = {x:mousex,y:mousey};
			
	for(t=0;t<mouseMoveLength;t++){
		mouseMoveListener[t](mousex,mousey);
	}
	return false;
}//EOF mMouseCoords

// Add MouseMove Listener
function addMouseMoveListener(func){
	mouseMoveListener.push(func);
	mouseMoveLength = mouseMoveListener.length;
}
// ++++++++++++++++++++++++++++
// Mouse Up Listner for document
var mouseUpListener = new Array();
var mouseUpLength = 0;
function mDocumentMouseUp(e){	
	var buttons = detectMouseButton(e);
	for(t=0; t<mouseUpLength;t++){
		mouseUpListener[t](buttons);
	}
	return false;
}
// Add Mouse Up Listner
function addMouseUpListener(func){
	mouseUpListener.push(func);
	mouseUpLength = mouseUpListener.length;
}
// Append MouseUp and MouseMove Listeners to Document
document.onmousemove = mMouseCoords;
document.onmouseup = mDocumentMouseUp;
var cancelDDSelect = false;
document.onclick = function(e){
	
	if(typeof mSearch != "undefined"){
		mSearch.globalClick(e);
	}
	
	if(typeof mListingDropDown != "undefined" && ! cancelDDSelect){
		mListingDropDown.id ="";
		boxOrList.style.display = "none";
	}else{
		cancelDDSelect = false;
	}
	
//	if(noDocumentRC){
//		noDocumentRC = false;
//	}else {
//		setRightClick();
//	}
	setRightClick();
	
	//Wichtig oder IE spinnt
	return false;
}
// Prevent IE fom showing context menu by right click
document.oncontextmenu=function(){return false;};


var dragSplitScreen = false;
function dssMoveHandler(mousex,mousey){
	if(dragSplitScreen && isSplit){
		  document.body.style.cursor = "e-resize";
		  // document.body.focus();
		  var coords = _ViewportOffset(_("mSplitTable"),true);
		  var newWidth = (mousex-coords.l) + "px";
		  _S("mSplitLeft").width = newWidth ;
		  if(dojo.byId("mFolderHeading")) _S("mFolderHeading").width = (mousex-coords.l-31)+"px";
		  _S("splitInnerLeft").width = newWidth ;
		}	
}
addMouseMoveListener(dssMoveHandler);

function dssUpHandler(){
	if(isSplit){
		document.body.style.cursor = "default";
		dragSplitScreen = false;
	}
}
addMouseUpListener(dssUpHandler);


function infoFlyOut(height){
	
	var contentBounds = dojo.coords(mWindowContent,true);
	if(height == undefined || height ==null || height>contentBounds.h){
		height = contentBounds.h;
	}
	stopWindowResizing = true;
	promptIsShowing = true;
	var mInfoLeft = _("mInfoLeft");
	var mInfoRight = _("mInfoRight");
	var mInfoMiddle = _("mInfoMiddle");
	_S("mInfoWrap").display="block";

	dojo._setOpacity(_("mInfoWrap"),0.8);

	
	var infoWidth = defaultWindowWidth-2;
	if(currentWindowSize >0){
		infoWidth = mWindowMaxWidth-2;
	}
	_S("mInfoWrap").width = infoWidth + "px";
	var halfInfoWidth = Math.round(infoWidth/2);
	var quaterInfoWidth = Math.round(halfInfoWidth/2);
	
	_fx.animateDim(mInfoLeft, promptDuration, quaterInfoWidth, 0, "px", 0, height, "px", undefined);
	_fx.animateDim(mInfoRight, promptDuration, quaterInfoWidth, 0 , "px", 0, height, "px", undefined);
	_fx.animateDim(mInfoMiddle, promptDuration, halfInfoWidth  ,infoWidth, "px", 0, height, "px", undefined);

	setTimeout(promptFadeIn,promptDuration);
	return false;
}

function infoFlyIn(){
	mLoadingPane.style.height="auto";
	height = promptHeight;
	stopWindowResizing = false;
	promptIsShowing = false;
	var mInfoLeft = _("mInfoLeft");
	var mInfoRight = _("mInfoRight");
	var mInfoMiddle = _("mInfoMiddle");
	_S("mInfoWrap").display="block";
	
	var infoWidth = defaultWindowWidth-2;
	if(currentWindowSize >0){
		infoWidth = (mWindowMaxWidth-2);
	}
	_S("mInfoWrap").width = infoWidth + "px";
	var halfInfoWidth = Math.round(infoWidth/2);
	var quaterInfoWidth = Math.round(halfInfoWidth/2);
	
	_fx.animateDim(mInfoLeft, promptDuration, 0, quaterInfoWidth, "px", height, 0, "px", undefined);
	_fx.animateDim(mInfoRight, promptDuration, 0, quaterInfoWidth, "px", height, 0, "px", undefined);
	_fx.animateDim(mInfoMiddle, promptDuration, infoWidth, halfInfoWidth, "px", height, 0, "px", function(){_S("mInfoWrap").display="none";_("mLoadingPane").style.left="-99999em";});
	return false;

}

function loadPrompt(url,formNode){
	
	if(promptIsShowing){
		loadInsidePrompt(url,formNode);
		return false;
	}
	document.body.style.cursor = 'wait';
	var infoWidth = defaultWindowWidth-2;
	if(currentWindowSize >0){
		infoWidth = mWindowMaxWidth-2;
	}
	var ms = mLoadingPane.style;
	ms.width = (infoWidth-promptMargin) +"px";
	ms.left = "-99999em";
	_S("mClosePrompt").left = "-99999em";
	
	var promptContentCallback = function(response,ioArgs){
		mLoadingPane.innerHTML = response;
		setTimeout(delayedPromptExecute,100);
		mWait.stop();
		return true;
	}
	mWait.play();
	if(formNode != undefined){
		dojo.xhrPost({
		    url: url,
		    load: promptContentCallback,
		    form: formNode,
		    error: function(response, ioArgs){
				mWait.stop();
		        console.log("Failed XHR: ", response, ioArgs);
		    }
		});		
	}else{
		dojo.xhrGet({
		    url: url,
		    load: promptContentCallback,
		    error: function(response, ioArgs){
				mWait.stop();
		        console.log("Failed XHR: ", response, ioArgs);
		    }
		});		
	}
	

}

function loadInsidePrompt(url,formNode){
	dojo.fadeOut({node: mLoadingPane,duration:promptFadeDuration,onEnd:dojo.hitch(this,function(){loadInsidePromptStep2(url,formNode);})}).play();
	dojo.fadeOut({node: _("mClosePrompt"),duration:promptFadeDuration}).play();
	
}

function loadInsidePromptStep2(url,formNode){
	mWait.play();
	mLoadingPane.style.display = "block";
	mLoadingPane.style.height = "auto";
	
	var promptContentCallback = function(response,ioArgs){
		mLoadingPane.innerHTML = response;
		setTimeout(delayedInsidePrompt,100);
		mWait.stop();
		return true;
	}
	if(formNode != undefined){
		dojo.xhrPost({
		    url: url,
		    load: promptContentCallback,
		    form: formNode,
		    error: function(response, ioArgs){
		        console.log("Failed XHR: ", response, ioArgs);
		        mWait.stop();
		    }
		});		
	}else{
		dojo.xhrGet({
		    url: url,
		    load: promptContentCallback,
		    error: function(response, ioArgs){
		        console.log("Failed XHR: ", response, ioArgs);
		        mWait.stop();
		    }
		});		
	}	
}
function delayedInsidePrompt(){
	if(funcExists("parseAll")){
		parseAll(mLoadingPane);
	}
	var bounds = _ViewportOffset(mLoadingPane);	
	var contentBounds = dojo.coords(mWindowContent,true);
	var ms = mLoadingPane.style;
	var maxHeight = contentBounds.h-promptMargin ;
	if (bounds.h> maxHeight){
		ms.height = (maxHeight-12) +"px";
		bounds.h = maxHeight;
	}
	
	var cs = _S("mClosePrompt");
	var top = (bounds.t+bounds.h-1)+ "px";
	cs.top = top;
	promptHeight = bounds.h + promptMargin;
	
	var mInfoLeft = _("mInfoLeft");
	var mInfoRight = _("mInfoRight");
	
	_fx.animToHeight(mInfoMiddle, promptDuration, promptHeight, function(){
		document.body.style.cursor = 'auto';
		dojo.fadeIn({node: mLoadingPane,duration:promptFadeDuration}).play();
		dojo.fadeIn({node: _("mClosePrompt"),duration:promptFadeDuration}).play();	
	});
	_fx.animToHeight(mInfoLeft, promptDuration, promptHeight, undefined);
	_fx.animToHeight(mInfoRight, promptDuration, promptHeight, undefined);

}

function delayedPromptExecute(){
	if(funcExists("parseAll")){
		parseAll(mLoadingPane);
	}
	var ms = mLoadingPane.style;
	var bounds = _ViewportOffset(mLoadingPane);
	var contentBounds = dojo.coords(mWindowContent,true);
	promptHeight = bounds.h + promptMargin;
	var maxHeight = contentBounds.h;
	if (promptHeight> maxHeight){
		ms.height = (maxHeight-promptMargin-17) +"px";
		promptHeight = maxHeight;
	}
	var windowBounds = _ViewportOffset(mWindow);
	windowBounds.t += 102;
	var left = (windowBounds.l + Math.round(promptMargin/2)-5) +"px";
	var top = (windowBounds.t + Math.round(promptMargin/2)) +"px";
	dojo._setOpacity(mLoadingPane,0);
	ms.left = left;
	ms.top = top;
	infoFlyOut(promptHeight);
}

function promptFadeIn(){
		dojo.fadeIn({node: mLoadingPane,duration:promptFadeDuration}).play();
		var cs = _S("mClosePrompt");
		var bounds = dojo.coords(mLoadingPane,true);
		var top = (bounds.t+bounds.h-1)+ "px";
		var left = bounds.l +"px";
		cs.left = left;
		cs.top = top;
		dojo.fadeIn({node: _("mClosePrompt"),duration:promptFadeDuration}).play();
		document.body.style.cursor = 'auto';
}

function promptFadeOut(){
		dojo.fadeOut({node: _("mClosePrompt"),duration:promptFadeDuration,onEnd:function(){_S("mClosePrompt").left = "-99999em";}}).play();
		
		dojo.fadeOut({node: mLoadingPane,duration:promptFadeDuration}).play();
		setTimeout(infoFlyIn,promptFadeDuration);
}



var fadeDarkenInProgress = 0;
function fadeDarken(isFadeIn){
	fadeDarkenInProgress++;
	var maxOpacity = 0.7;
	var opacityStart = isFadeIn?0:maxOpacity;
	var opacityEnd = isFadeIn?maxOpacity:0;
	mDarken.style.left ="auto";
	var end = isFadeIn?function(){fadeDarkenInProgress--;}:function(){fadeDarkenInProgress--; if(!fadeDarkenInProgress) mDarken.style.left="-9999em";}
	_fx.fadeOpacity(mDarken, 600, opacityStart, opacityEnd, end);
}

function execFunc(funcName,node){
	if(funcName){
		window[funcName](node);
		return true;
	}
	return false;
}

var mainButtons = new Array();

function parseButtonNames(){
	var allButtons = dojo.query(".buttonBox",_("mWindowButton"));
	for(var t=0, l=allButtons.length ;t<l ;t++){
		var name = allButtons[t].getAttribute("name");
		if(name){
			mainButtons[name] = allButtons[t]; 
		}
	}
}



function parseButtons(){
	var root = _("mWindowButton");
	var images = root.getElementsByTagName("img");
	var spans = root.getElementsByTagName("span");
	
	var activeNode = undefined;
	
	for(var t=0, l = images.length; t<l; t++){
		var a = images[t].parentNode;
		if( dojo.hasClass(a,"active") || a.id=="active") {
			activeNode = images[t].parentNode;
			continue;
		}
		if( dojo.hasClass(a,"disabled") || a.id =="disabled"){
			images[t].onmouseover = function(){return false;};
			images[t].onmouseout = function(){return false;};
			continue;
		}
		images[t].onmouseover = function(){buttonBackUp(this.parentNode);};
		images[t].onmouseout = function(){buttonBackDownDelayed(this.parentNode);};
	}
			
		if (activeNode){
			activeNode.onclick = function(){ return false;}
		}	
	
	for(var t=0, l = spans.length ; t<l ; t++){
		var a = spans[t].parentNode;
		if(dojo.hasClass(a,"active") || a.id=="active") continue;
		if(dojo.hasClass(a,"disabled") || a.id =="disabled") {
			spans[t].onmouseover = function(){return false;};
			spans[t].onmouseout = function(){return false;};
			continue;
		}
		
		
		spans[t].onmouseover = function(){buttonBackUp(this.parentNode);};
		spans[t].onmouseout = function(){buttonBackDownDelayed(this.parentNode);};
		
	}
}

var mListingDropDown = undefined;
function openSelectDropDown(node){
	cancelDDSelect = true;
	// document.body.focus();
	
	if(mListingDropDown==undefined){
		mListingDropDown = node;
	}
	
	if(node.id!="active"){
		node.id ="active";
		boxOrList.style.display = "block";
	}else{
		node.id ="";
		boxOrList.style.display = "none";
	}
}


function selectDropDownToggle(){
	// document.body.focus();
	var dropDown = mListingDropDown;
	var filesView = 1;
	if(dropDown.className=="mListingDropDown"){
		dropDown.className="mListingDropDown2";
		boxOrList.className="mListingSelectBox2";
		filesView=2;
		_S("toggleImageViewOverlay").left = "-9999em";
		toggleSelectHeading(0);
	}else{
		dropDown.className="mListingDropDown";
		boxOrList.className="mListingSelectBox";
		_S("toggleImageViewOverlay").left = "0px";		
		toggleSelectHeading(1);
	}
	dropDown.id ="";
	boxOrList.style.display = "none";
	
	var url = _("filesFormNode").action+"&dir="+escape(_("currentDir").value)+"&filesview="+filesView;
	_LoadTo(url,'splitInnerRight',function(){parseAll(_('splitInnerRight'));});
	
}


function toggleSelectHeading(is){
	if(! _("mSelectHeadingInnerFolders")) return;
	var state = is || 0;
	
	if(state){
			dojo.style("mSelectHeadingInnerFolders",{display:"none"});	
	}else{
			dojo.style("mSelectHeadingInnerFolders",{display:"block"});				
	}
}

dojo.addOnLoad(function(){
	 var fade = (filesViewState == 2) ? 0 : 1;
	 toggleSelectHeading(fade, 0);
	 mLoader.add("Select Heading init");
});




var toolTipState = 2;
function toggleTip(node){
	if (node.id=="off"){
		node.id="";
		xhrCookie(null, "tooltip", 2);
		
		
		toolTipState = 2;
	}else{
		node.id = "off";
		xhrCookie(null, "tooltip", 1);
		
		toolTipState = 1;
		mInfoTipContent.style.height= "auto";
		mInfoTipShadow.style.display="none";
		mInfoTipArrow.style.left ="-9999em";
		mInfoTipWrap.style.left ="-9999em";
	}
}

function xhrCookie(isGet,name,value){
	
	var url = mainRootUri+"view=xhrcookie&name=" +name + "&value="+value + ( (isGet)?"&isget=1" :"");
	
	var lcb = dojo.hitch(this,function(response,ioArgs){

		return response;
	});
		
	return dojo.xhrGet({
	    url: url,
	    load: lcb,
	    error: function(){return false;}
	});	
	
}


function parseTabs(){
  
  	var root = _("mWindowTabInner");
	var links = root.getElementsByTagName("a");
	
	for(t=0; t<links.length; t++){
		links[t].onmouseover = function(){tabMouseOver(this);};
		links[t].onmouseout = function(){tabMouseOut(this);};
		links[t].onclick = function(){window.location.href = this.href;};
	}
}

function removeError(text){
	return text.replace("_fmError","");
}


function switchSelecting(isSelect){
	if(isSelect){
		// Allow IE from selecting text
		document.onselectstart = function () { return true; }; 
	}else{
		// Prevent IE from selecting text
		document.onselectstart = function () { return false; }; 
	}
}
// Standard (switch off) if files are shown, otherwise switch it off on load
switchSelecting();


function generalParsing(){
	parseTabs();
	parseButtons();
	parseButtonNames();
	if(typeof parseAll != "undefined") parseAll(mWindow,true);
	if(typeof evalButtons != "undefined") evalButtons();
}

var pressedKey = null;
var allowKeyRemove = true;
var editingFocus = false;


function generalKeyDown(evt){
	if(typeof noGeneralKeyDown !== "undefined") return;
	var keyCode = evt.keyCode;
	pressedKey = keyCode;
	
	if(keyCode==46 && allowKeyRemove &&  ! editingFocus) {
		askRemove();
		return false;
	}
	

//	console.log("KeyPressed:"+pressedKey);
	
	return true;
}

function generalKeyUp(evt){
	pressedKey = undefined;
	return true;	
}
dojo.addOnLoad(function(){
	dojo.connect(document,"onkeydown",generalKeyDown);
	dojo.connect(document,"onkeyup",generalKeyUp);	

	mLoader.add("General Key Events added");
});

function mToggleFolders(icon){
	var state = parseInt(icon.getAttribute("state"));
	var newState = state ? 0 : 1;
	if(newState == 1){
		_("mToggleFoldersStyle").innerHTML = "";
		icon.style.backgroundPosition = "0px 0px";
	}else{
		_("mToggleFoldersStyle").innerHTML = ".mSelectFolder{display:none;}";
		icon.style.backgroundPosition = "0px -48px";
	}
	icon.setAttribute("state",newState);
	xhrCookie(null, "mtogglefolders", newState);
	
}

function mToggleImageView(icon){
	var state = parseInt(icon.getAttribute("state"));
	var newState = state ? 0 : 1;
	if(newState == 1){
		
		icon.style.backgroundPosition = "0px 0px";
	}else{
		
		icon.style.backgroundPosition = "0px -48px";
	}
	icon.setAttribute("state",newState);

	var refreshUrl = mainRootUri + "view=xhrfiles&dir="	+ _("currentDir").value + "&imageviewstate=" + newState;
	_LoadTo(refreshUrl, 'splitInnerRight', function() {
	parseAll(_("splitInnerRight"));
	});
			
	
}

function mSelectRootFolder(id){
	id = id || 0;
	var url = mainRootUri + "selectMyFolder=" + id;
	window.location.href = url;
}

function requestFullScreen(elem, caller){
	if (elem.requestFullscreen) {
	  elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) {
	  elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
	  elem.webkitRequestFullscreen();
	}else if (elem.msRequestFullscreen) {
	  elem.msRequestFullscreen();
	}
	caller.style.display = "none";
	dojo.style("mCloseFullScreen",{display:"block"});
}

function closeFullscreen(caller){
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	caller.style.display = "none";
	dojo.style("mFullScreen",{display:"block"});
}



dojo.addOnLoad(function(){generalParsing(); mLoader.add("General parsing");});

dojo.addOnLoad(function(){setMWindowSize(); mLoader.add("Set window size"); });
window.onresize = setMWindowSize;