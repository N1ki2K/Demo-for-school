/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mDragContainer;
var mDragInfoImage, mDragInfoContent, mDragOrderingInfo;
var mDragContainerOpacity = 0.8;
var mDrag = {
	dragging: false,
	mouseButtonPressed: false,
	
	currentItem: undefined,
	currentItemBounds: undefined,
	
	orderingTop: undefined,
	areaItem: undefined,
	hoverItem: undefined,
	dropMatch: false,
	itemRelativeToMouse : {x:0,y:0},
	dropFocus: undefined,
	
	dragScope: 8,
	
	dragStart: {
		x: null,
		y: null
	},
	
	itemPos: function (mousex,mousey){
		mDragContainer.style.left = (mDrag.itemRelativeToMouse.x +mousex) + "px";
		mDragContainer.style.top = (mDrag.itemRelativeToMouse.y+ mousey) + "px";
	},
	
	setHoverItem: function(item){
		if(item){
			mDrag.hoverItem = item;
			var	areas = mDrag.currentItem.parameters.dragable.split(',');
			if(areas.in_array(item.parameters.droppable)){
				mDrag.infoTo('plus');
			}else{
				mDrag.dropMatch = false;
			}
		}else{
			mDrag.hoverItem = undefined;
			if(mDrag.areaItem){
				mDrag.infoTo('plus');
			}else{
				mDrag.infoTo();	
			}	
			mDragOrderingInfo.style.left ="-99999em";
		}
		
	},
	
	
	setOrdering: function(){
		if(!mDrag.hoverItem) return false;
		var item = mDrag.hoverItem;
		var ordering = item.parameters.ordering;
		if(ordering && ordering!=""){
			var bounds = _ViewportOffset(item,true);
			if(ordering == "only"){
				var half = Math.round(bounds.h/2)+bounds.t;
				if(bounds.t <= mMouse.y && mMouse.y < half && bounds.l<= mMouse.x && mMouse.x<= (bounds.l+bounds.w) ) {
					bounds.t -=4;
					mDrag.infoTo('up');
				}else if(half <= mMouse.y && mMouse.y <= (bounds.t+bounds.h) && bounds.l<= mMouse.x && mMouse.x<= (bounds.l+bounds.w) ){
					bounds.t = bounds.t+bounds.h -9;
					mDrag.infoTo('down');
				}else{
					if(mDrag.areaItem){
						mDrag.infoTo('plus');
					}else{
						mDrag.infoTo();
					}
				}
			}else {
				var quaterTop = Math.round(bounds.h/3)+bounds.t;
				var quaterBottom = bounds.h+ bounds.t -  Math.round(bounds.h/3);
				if(bounds.t <= mMouse.y && mMouse.y < quaterTop && bounds.l<= mMouse.x && mMouse.x<= (bounds.l+bounds.w) ){
					bounds.t -=4;
					mDrag.infoTo('up');
				}else if(quaterBottom <= mMouse.y && mMouse.y <= (bounds.t+bounds.h) && bounds.l<= mMouse.x && mMouse.x<= (bounds.l+bounds.w) ){
					bounds.t = bounds.t+bounds.h -9;
					mDrag.infoTo('down');
				} else if (quaterTop <= mMouse.y && mMouse.y < quaterBottom && bounds.l<= mMouse.x && mMouse.x<= (bounds.l+bounds.w)){
					mDrag.infoTo('plus');
				}else{
					if(mDrag.areaItem){
						mDrag.infoTo('plus');
					}else{
						mDrag.infoTo();
					}					
				}
				
			}

			bounds.w -=10; bounds.l+=5; bounds.h = 1;
			_AppendBounds(bounds,mDragOrderingInfo);
			if(mDrag.orderingTop==undefined){
				mDragOrderingInfo.style.left ="-99999em";				
			}
			if(item.moojType=="selectableOption"){
				if(mIsSelected(item)){
					item.style.border = "1px solid #7da2ce";
				}else {
					item.style.border ="1px solid white";						
				}
			}
			
		}
	},
	
	areaOver: function(item){
		if(!mDrag.dragging) return false;		
		var areas = new Array();
		if(mDrag.currentItem.parameters.dragable){
			areas = mDrag.currentItem.parameters.dragable.split(",");
		}
		if(areas.in_array(item.parameters.droppable)){
			mDrag.areaItem = item;
			mDrag.infoTo('plus');
			mDrag.dropMatch = true;
		}else{
			mDrag.areaItem = undefined;
			mDrag.infoTo();
			mDrag.dropMatch = false;
		}
		
		return false;
	},
	areaOut: function(item){
		if(!mDrag.dragging) return false;
		mDrag.areaItem = undefined;
		mDrag.infoTo();
		mDrag.dropMatch = false;
		return false;
	},
	
	mouseMove: function(mousex,mousey){
		if(! mDrag.mouseButtonPressed) return false;
		
		mMouse = {x:mousex,y:mousey};

		// Set Ordering
		mDrag.setOrdering();
		
		
		if(!mDrag.dragging){
			// document.body.focus();
			if(! (Math.abs(mDrag.dragStart.x-mousex)>mDrag.dragScope) && ! (Math.abs(mDrag.dragStart.y-mousey)>mDrag.dragScope) ) return false;
			else {
				// Fire custom drag start
				mDrag.dragging = true;
				if(mDrag.currentItem.moojType=="selectableOption"){					
					var count = mSelectCountItems(mDrag.currentItem);
					if(count==0){
						mSelectPick(mDrag.currentItem,true);
					}else{
						mSelectPick(mDrag.currentItem,true,true);
					}
					count = mSelectCountItems(mDrag.currentItem);
					if(count>1){
						mDragInfoContent.innerHTML = count+" "+mText.items;
					}else {
						mDragInfoContent.innerHTML = "1 "+mText.item;
					}
				}else if(mDrag.currentItem.moojType=="treeItem"){
					mDragInfoContent.innerHTML = "1 "+mText.folder;
//					mDrag.currentItem.onclick(mDrag.currentItem);
				}
				
				
				execFunc(mDrag.currentItem.parameters.dragstart,mDrag.currentItem);	
				dojo._setOpacity(mDragContainer,mDragContainerOpacity);
		
			}
		}
		mDragContainer.style.left = (mousex+16) +"px";
		mDragContainer.style.top = (mousey+16) +"px";
		return true;
	},
	mouseDown: function(e){
		var dbl;
		try {
			dbl = this.parameters.dragable;
		} catch (e) {
			return false;
		}
		if(dbl =="" ) return false;
		// document.body.focus();
		var button = detectMouseButton(e);
		
//		transferState = (this.moojType == "selectableOption")? "files" : "folder";
		
		if(this.moojType == "treeItem"){
			transferState = "folder";
			this.style.textDecoration ="none";
		}else{
			transferState = "files";
		}
		
		
		
		if(!button.left) {
			// Right Button is Fired
			if(button.right){
				if(this.moojType == "selectableOption"){
					mDrag.currentItem = this;	
					mSelectPick(mDrag.currentItem,true);
					rcMode("file");	
				}else if(this.moojType == "treeItem"){
					this.onclick(e);
					rcMode("folder");
				}//EOF else
			}//EOF right button
			return false;
		}
		mDrag.dragStart = detectMousePosition(e);
		mDrag.mouseButtonPressed = true;
		mDrag.currentItem = this;	
		return false;		
	},
	mouseUp: function(button){
		mDrag.mouseButtonPressed = false;
		if(!mDrag.currentItem || !mDrag.dragging) return false;
		
		mDrag.dragging = false;
		mDragOrderingInfo.style.left ="-99999em";
		
		if(mDrag.dropMatch){	
			console.log("Drop Match");
			execFunc(mDrag.currentItem.parameters.dragstop,mDrag.currentItem);
		}else{	
			console.log("No Drop Match");
			execFunc(mDrag.currentItem.parameters.dropnomatch ,mDrag.currentItem);
			
		}
		var disapearTime = 200;	
		dojo.fadeOut({node: mDragContainer, duration: disapearTime, onEnd: function(){
			mDragContainer.style.left = "-99999em";
		}}).play();
		
		mDrag.currentItem = undefined;
		return true;
	},
	reset: function (){
		mDrag.dragging= false;
		mDrag.mouseButtonPressed= false;
		mDrag.currentItem= undefined;
		mDrag.currentItemBounds= undefined;
		mDrag.orderingTop= undefined;
		mDrag.areaItem= undefined;
		mDrag.hoverItem= undefined;
		mDrag.dropMatch= false;
		mDrag.itemRelativeToMouse = {x:0,y:0};
		mDrag.dropFocus= undefined;
	},
	infoTo: function(img){
		var is = mDragInfoImage.style;
		switch (img) {
		case "plus":
			is.backgroundPosition = "0 -23px";
			mDrag.dropMatch = true;
			mDrag.orderingTop = undefined;
			break;
		case "up":
			is.backgroundPosition = "0 -46px";
			mDrag.dropMatch = true;
			mDrag.orderingTop = true;
			break;
		case "down":
			is.backgroundPosition = "0 -46px";
			mDrag.dropMatch = true;
			mDrag.orderingTop = false;
			break;	
		default:
			is.backgroundPosition = "0 0";
			mDrag.dropMatch = false;
			mDrag.orderingTop = undefined;
			break;
		}
	}
}

dojo.addOnLoad(function(){
	 _newElement2Body(
			 "div",
			 {},
			 "mDragInfo",
			 "mDragContainer");
	 
	 mDragContainer = _("mDragContainer");
	 mDragContainer.innerHTML = '<div class="mDragInfoLeft" id="mDragInfoImage"></div><div class="mDragInfoRight" id="mDragInfoContent">1 item</div>';
	 
	 mDragInfoImage = _("mDragInfoImage");
	 mDragInfoContent = _("mDragInfoContent");
	
	 _newElement2Body(
			 "div",
			 {},
			 "mDragOrderingInfo",
			 "mDragOrderingInfo");
	 
	 mDragOrderingInfo = _("mDragOrderingInfo");

	mLoader.add("Drag Container Added");
});



addMouseMoveListener(mDrag.mouseMove);
addMouseUpListener(mDrag.mouseUp);