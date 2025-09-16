/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mInfoTipWrap = undefined;
var mInfoTipArrow = undefined;
var mInfoTipContent = undefined;
var mInfoTipShadow = undefined;
var mInfoTipContentShadow = undefined; 
var mInfoTipShadowMargin = 4;
function initInfoTip(){
	mInfoTipArrow = _newElement2Body(
			"div",
			{"opacity": "1"},
			"infoTipArrow", 
			"mInfoTipArrow");
	
	mInfoTipWrap = _newElement2Body(
			"div",
			{"opacity": "1"},
			"infoTipWrap", 
			"mInfoTipWrap");	
	mInfoTipWrap.innerHTML = '<div class="infoTipContent" id="mInfoTipContent"></div><div class="infoTipBottom"></div>';
	mInfoTipContent = _("mInfoTipContent");
	
	
	mInfoTipShadow = _newElement2Body(
			"div",
			{"opacity": "0.6", "display":"none"},
			"infoTipWrapShadow", 
			"mInfoTipShadow");	
	mInfoTipShadow.innerHTML = '<div class="infoTipContentShadow" id="mInfoTipContentShadow"></div><div class="infoTipBottomShadow"></div>';
	
	mInfoTipContentShadow = _("mInfoTipContentShadow");
	
}

dojo.addOnLoad(function(){initInfoTip(); mLoader.add("Init info tip");});

function infoOnMouseOver(){
	if(!this.infoTip || toolTipState == 1) return false;
	var w = _WindowSize();
	
	mInfoTipContent.innerHTML = this.infoTip;
	var isSelect = 0;
	if(this.className.indexOf("mSelect") != -1){
		isSelect = 1;
		mInfoTipContent.style.height= "136px";
	}
	var contentDim =  _Dimensions(mInfoTipContent);
	var infoTipDim = _Dimensions(mInfoTipWrap);
	var myBounds = _ViewportOffset(this,true);
	
	var as = mInfoTipArrow.style;
	var ws = mInfoTipWrap.style;
	var ss = mInfoTipShadow.style;
	
	var middle = Math.round(myBounds.h/2)+myBounds.t;
	
	var tipLeft = myBounds.l + myBounds.w + 19;
	var arrowLeft;
	if ((tipLeft+infoTipDim.width)>w.width){
		tipLeft = myBounds.l - 19 - infoTipDim.width;
		arrowLeft = myBounds.l - 20;
		as.backgroundPosition = "0 0";
	}else{
		arrowLeft = myBounds.l + myBounds.w;
		as.backgroundPosition = "0 -17px";
	}
	tipTop = middle - Math.round(infoTipDim.height/2);
	if(isSelect) tipTop -= 10;
	
	
	mInfoTipContentShadow.style.height =  contentDim.height +"px";
	ss.top = (tipTop+mInfoTipShadowMargin) +"px";
	ss.left = (tipLeft +mInfoTipShadowMargin) +"px";
	ss.display="block";
	
	var asTop = isSelect ?  (middle - 18 ) :  (middle - 8 );
	as.top = asTop +"px";
	as.left = arrowLeft +"px";
	
	ws.top = tipTop +"px";
	ws.left = tipLeft +"px";

	return false;

}

function infoOnMouseOut(){
	if(!this.infoTip) return false;
	mInfoTipContent.style.height= "auto";
	mInfoTipShadow.style.display="none";
	mInfoTipArrow.style.left ="-9999em";
	mInfoTipWrap.style.left ="-9999em";
	return false;
}


function hideInfoTip(){
	mInfoTipContent.style.height= "auto";
	mInfoTipShadow.style.display="none";
	mInfoTipArrow.style.left ="-9999em";
	mInfoTipWrap.style.left ="-9999em";	
}

function mSetInfo(node,info){
	node.infoTip = info;
}
function mClearInfo(node){
	node.infoTip = undefined;
}

function infoTipReset(){
	mInfoTipShadow.style.display="none";
	mInfoTipArrow.style.left ="-9999em";
	mInfoTipWrap.style.left ="-9999em";
}


function parseInfoTips(startNode){
	startNode = startNode?startNode:document.body;
	var children = startNode.getElementsByTagName('*');
	for(t=0;t<children.length;t++){
		addInfoNode(children[t]);
	}
	

function addInfoNode(node){
	var info = node.getAttribute("info");
	if(info!= undefined){
		var parent = node.parentNode.parentNode.parentNode;
		if(parent.className.indexOf("mSelect") != -1){
			if(info.trim != ""){
				parent.infoTip = info;
			}
			parent.showInfo = infoOnMouseOver;
			parent.hideInfo = infoOnMouseOut;
		}else{
			if(info.trim != ""){
				node.infoTip = info;
			}
			node.onmouseover = infoOnMouseOver;
			node.onmouseout = infoOnMouseOut;	
		}
	}
	return true;
}
	
	
	
	
}