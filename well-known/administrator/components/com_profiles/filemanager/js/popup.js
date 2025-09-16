/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var popupTemplate = undefined;
var popupTemplateUri = mainJSRootUri+"templates/popup.html";
var mPopupArray = new Array();

var dragWindow = undefined;
var resizePopupWindow = undefined;

var focusedPopup = null;

var popupTemplateCallback = function(response,ioArgs){
	mLoader.add("Popup template loaded");
	popupTemplate = response;
	return true;
}
dojo.xhrGet({
    url: popupTemplateUri,
    load: popupTemplateCallback,
    error: function(response, ioArgs){
    	mLoader.add("Popup template failed");
        console.log("Failed XHR: ", response, ioArgs);
    }
});


function focusedPopupChange(requestingPopup){
	if(!requestingPopup || requestingPopup == focusedPopup) return;
	if(focusedPopup){
		focusedPopup.node.style.zIndex = "10000";
	}
	requestingPopup.node.style.zIndex = "10001";
	focusedPopup = requestingPopup;
}


function maximizePopup(name){
	var node = mPopupArray[name];
	if(node.isMax) return;
	node.isMax = 1;
	var win = _WindowSize();
	var def = node._default;
	node.maxBounds = {width: win.width, height: (win.height-40)};
//	dojo.style(node.node, {top: "0px", left:"0px", width: win.width +"px" , height: (win.height-40) + "px" });
	_fx.animateDim(node.node,300,def.width,win.width,"px",def.height,(win.height-40),"px");
	_fx.animatePosition(node.node,300,def.left,0,"px",def.top,0,"px");
}

function reducePopup(name){
	var node = mPopupArray[name];
	if(!node.isMax) return;
	node.isMax = 0;
	var def = node._default;
	_fx.animateDim(node.node,300,node.maxBounds.width,def.width,"px",node.maxBounds.height,def.height,"px");
	_fx.animatePosition(node.node,300,0,def.left,"px",0,def.top,"px");
//	dojo.style(node.node, {top: node._default.top + "px", left: node._default.left + "px", width: node._default.width + "px" , height: node._default.height + "px" });
}


function closePopup(name){
	if(_Browser.IE) clearInputFocus();
	var node = mPopupArray[name];
	
	if(focusedPopup  && focusedPopup == node){
		focusedPopup = null;
	}
	
	if(node.darken){
		fadeDarken(false);
	}
	
	var closeItBefore = (typeof(node.closeItBefore) !== "undefined" && node.closeItBefore);
	
	if(closeItBefore && typeof(node.closeCallback) != "undefined") {
		node.closeCallback();
	}
	
	var closeCallBack = dojo.hitch(this,function(){
		var node = mPopupArray[name];
		if(typeof(node.closeCallback) != "undefined" && ! closeItBefore){
			node.closeCallback();
		}
		node.node.style.display = "none";	
		_removeNode(node.node);
		mPopupArray[name] = undefined;
	})
	
	
	var secondStep = dojo.hitch(this,function(){
	
		var bounds = dojo.coords(node.node);
		var percent = 80;
		var w = _Percent(bounds.w, percent, true);
		var h = _Percent(bounds.h, percent, true);
		var l = bounds.l + Math.round( (bounds.w-w)/2 );
		var t = bounds.t + Math.round( (bounds.h-h)/2 );
	
		dojo.animateProperty( {
			node : node.node,
			duration :300,
			properties : {
				left : {
					end : l,
					unit: "px"
				},
				top : {
					end : t,
					unit: "px"
				},
				width : {
					end : w,
					unit: "px"
				},
				height : {
					end : h,
					unit: "px"
				}
			}
		}).play();
		cnStyle.backgroundColor ="#c7d1e1";
		contentNode.innerHTML = "";
		dojo._setOpacity(contentNode, 1);
		dojo.fadeOut({node: node.node,duration:300,onEnd:closeCallBack}).play();
	
	});// EOF secondStep
	
	var contentNode = _("mPopupContent"+node.name);
	var cnStyle = contentNode.style;
	dojo.fadeOut({node: contentNode,duration:100,onEnd:secondStep}).play();

	
	return false;
}


function mPopup(name,title,content,width,height,top,left,darken){

	this.isMax = 0;
	
	if(darken){
		fadeDarken(true);
		this.darken = true;
	}else {
		this.darken = false;
	}
	
	var center = false;
	if( (top == undefined && left == undefined) || (top == null && left == null) ){
		center = true;
		top=0;left=0;
	}else {
		top = top?top:0;
		left = left?left:0;		
	}
	this.mousex = undefined;
	this.mousey = undefined;
	this.isPressed = false;
	this.id = "mPopup"+name;
	this.name = name;
	
	this.closeItBefore = false;
	
	this._default = {top: parseInt(top), left: parseInt(left), width: width, height: height};	
	width += "px";  top += "px"; left += "px";
	if(height!="auto") height += "px";
	this.node = _newElement2Body("div",{"position":"absolute","width": width,"height": height,"top": top,"left": left, "zIndex":"10001", "opacity": "0"},"windowWrap windowWrapOuter", this.id);

	this.template = popupTemplate;
	this.template = this.template.replace(/%name/g,name);
	this.template = this.template .replace(/%title/g,title);
	this.template = this.template .replace(/%close/g,mText.close);
	this.template = this.template .replace(/%maximize/g,mText.maximize);
	this.template = this.template .replace(/%reduce/g,mText.reduce);
	this.template = this.template .replace(/%imageuri_/g,mainImageUri);
	
	
	//this.template = this.template .replace(/%content/g,content);
	this.node.innerHTML = this.template; 
	_S("reduce_"+name).display = "none";
	_S("maximize_"+name).display = "none";
	
	
	if(focusedPopup){
		focusedPopup.node.style.zIndex  = 10000;
	}	
	focusedPopup = this;
	
	_("mPopupContent"+name).innerHTML = content;
	
	if(center){
		n  = _Dimensions(this.node);
		var l = Math.round(windowSize.width/2) -(Math.round(n.width/2));
		var t = Math.round(windowSize.height/2)-(Math.round(n.height/2));
		if(t<0) t=0;
		if(n.height>windowSize.height){
			this.node.style.height = windowSize.height +"px";
		}
		this._default.left = l;
		this._default.top = t;
		this.node.style.left = l+"px";
		this.node.style.top = t+"px";
	}
		
		this.contentNode = _("mPopupContent"+this.name);		
		if(funcExists("parseAll")){	
			parseAll(this.contentNode);
		}
		
		this.resizable = false;
		_S("mPopupResizeButton"+this.name).display = "none";
		
		this.node.onmousedown = dojo.hitch(this, function(e){
			var button = detectMouseButton(e);
			
			if(button.right){
				
				_S("redPop").display = this.resizable ? "block" : "none";
				_S("maxPop").display = this.resizable ? "block" : "none";
				
				var rcNode = dojo.byId("rightClickPopup");
				rcNode.popupName = this.name;
				var dim = _Dimensions('rightClickPopup');
				var winDim = _WindowSize();

				var top = globalMouse.y;
				if ((top + dim.height) > winDim.height) {
					top -= dim.height - 5;
				}

				var add = 0;
				rcNode.style.left = (globalMouse.x + add) + "px";
				rcNode.style.top = (top + add) + "px";
			}
		});
		
		dojo.fadeIn({node: this.node,duration:300}).play();

}//EOF mPopup


mPopup.prototype.setResizable = function(isResizable){
	this.resizable = (isResizable)?true:false;
	if(this.resizable){
		_S("reduce_"+this.name).display = "block";
		_S("maximize_"+this.name).display = "block";
	}
	_S("mPopupResizeButton"+this.name).display = this.resizable?"block":"none";
}


mPopup.prototype.pressed = function(e){
	focusedPopupChange(this);
	this.isPressed = true;
	dragWindow = this;
}
mPopup.prototype.released = function(e){
	this.isPressed = false;
	dragWindow = undefined;
	this.mousex = undefined;
	this.mousey = undefined;
}

mPopup.prototype.drag = function(mousex,mousey){
	if(this.isPressed){
		if(this.mousex == undefined){
			this.mousex = mousex;
			this.mousey = mousey;
		}else{
			var diffx = mousex-this.mousex;
			var diffy = mousey-this.mousey;
			this.mousex = mousex;
			this.mousey = mousey;
			var bounds = _ViewportOffset(this.node);
			var left = bounds.l +diffx;
			var top = bounds.t + diffy;
			this._default.top = top;
			this._default.left = left;
			this.node.style.left = left +"px";
			this.node.style.top = top +"px";
		}
	}else {
		this.mousex = undefined;
		this.mousey = undefined;		
	} 
}

mPopup.prototype.resize = function(mousex,mousey){
	focusedPopupChange(this);
	if(resizePopupWindow != undefined){
		if(this.mousex == undefined){
			this.mousex = mousex;
			this.mousey = mousey;
		}else{
			var diffx = mousex-this.mousex;
			var diffy = mousey-this.mousey;
			this.mousex = mousex;
			this.mousey = mousey;
			var bounds = _ViewportOffset(this.node);

			var width = bounds.w + diffx;
			// crappy ie6 hack FIX ME
			if(_Browser.IEVersion() <= 6){
				bounds = dojo.coords("mPopupContent"+this.name);
				bounds.h -= 5; // The magic number don't change or you will be cursed!
			}			
			var height = bounds.h + diffy;	
			
			this._default.width = width;
			this._default.height = height;
			
			this.node.style.width = width +"px";
			this.node.style.height = height +"px";
			
			var editIframe = this.node.getElementsByTagName("iframe");
			if(editIframe.length != 0){
				this._default.height = (height - editAreaMarginBottom);
				editIframe[0].style.height= this._default.height +"px";
			}
		}
	}else {
		this.mousex = undefined;
		this.mousey = undefined;		
	} 
}
mPopup.prototype.refresh = function(name,title,content,width,height,top,left){
	var headerNode = _("mPopupHeader"+name);
	var contentNode = _("mPopupContent"+name);
	headerNode.innerHTML = title;
	contentNode.innerHTML = content;
	var s = this.node.style;
	if(width) s.width = width +"px";
	if(height && height!="auto") s.height = height +"px"; else if(height=="auto") s.height ="auto";
	if(top) s.top = top +"px";
	if(left) s.left = left +"px";
	if(funcExists("parseAll")){
		parseAll(contentNode);
	}
}

mPopup.prototype.setContent = function(content,add){
	var add = add || 0;
	var contentNode = _("mPopupContent"+this.name);
	if(add){
		contentNode.innerHTML += content;
	}else{
		contentNode.innerHTML = content;		
	}
}

mPopup.prototype.closeCallback = function(){return;};


function newPopup(name,title,content,width,height,top,left){
	if(mPopupArray[name] == undefined){
		mPopupArray[name] = new mPopup(name,title,content,width,height,top,left);
	} else{
		mPopupArray[name].refresh(name,title,content,width,height,top,left);
	}
	return mPopupArray[name];
}

function newDarkenPopup(name,title,content,width,height,top,left){
	top = top?top:null;
	left = left?left:null;
	if(mPopupArray[name] == undefined){
		mPopupArray[name] = new mPopup(name,title,content,width,height,top,left,true);
	} else{
		mPopupArray[name].refresh(name,title,content,width,height,top,left);
	}
	return mPopupArray[name];
}

function resizablePopup(name, isResizable){
	mPopupArray[name].resizable = (isResizable)?true:false;
	_S("mPopupResizeButton"+name).display = isResizable?"block":"none";
}

function loadPopup(name,title,url,width,height,top,left,canResize,closeCallback, closeItBefore){
	top = top?top:null;
	left = left?left:null;
	canResize = canResize || false;
	
	var customCloseCallBack = typeof(closeCallback) != "undefined" ? closeCallback : function(){};
	var _closeItBefore = typeof(closeItBefore) !== "undefined" ? closeItBefore : false;
	
	document.body.style.cursor = 'wait';	
	var popupContentCallback = dojo.hitch(this,
			function(response,ioArgs){
				var popup =  newPopup(name,title,response,width,height,top,left);
				popup.setResizable(canResize);
				popup.closeCallback = customCloseCallBack;
				popup.closeItBefore = _closeItBefore;
				document.body.style.cursor = 'auto';
				mWait.stop();
				return true;
	});

	mWait.play();
	dojo.xhrGet({
	    url: url,
	    load: popupContentCallback,
	    error: function(response, ioArgs){
			mWait.stop();
	        console.log("Failed XHR: ", response, ioArgs);
	        
	    }
	});
	return false;
}

function loadResizablePopup(name,title,url,width,height,top,left){
	loadPopup(name,title,url,width,height,top,left,true);
}

function mPopupMoveHandler(mousex,mousey){
	// Popup Drag
	if(dragWindow){
		dragWindow.drag(mousex,mousey);
	}
	// Popup Resize
	if(resizePopupWindow){
		resizePopupWindow.resize(mousex,mousey);
	}
}//EOF mPopupMoveHandler

addMouseMoveListener(mPopupMoveHandler);

function mPopupUpHandler(){
	if(resizePopupWindow != undefined){
		resizePopupWindow.mousex = undefined;
		resizePopupWindow.mousey = undefined;
		resizePopupWindow = undefined;
	}
}
addMouseUpListener(mPopupUpHandler);


var keyStr = "ABCDEFGHIJKLMNOP" +
             "QRSTUVWXYZabcdef" +
             "ghijklmnopqrstuv" +
             "wxyz0123456789+/" +
             "=";

function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
//    var base64test = /[^A-Za-z0-9\+\/\=]/g;
//    if (base64test.exec(input)) {
//       alert("There were invalid base64 characters in the input text.\n" +
//             "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
//             "Expect errors in decoding.");
//    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
       enc1 = keyStr.indexOf(input.charAt(i++));
       enc2 = keyStr.indexOf(input.charAt(i++));
       enc3 = keyStr.indexOf(input.charAt(i++));
       enc4 = keyStr.indexOf(input.charAt(i++));

       chr1 = (enc1 << 2) | (enc2 >> 4);
       chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
       chr3 = ((enc3 & 3) << 6) | enc4;

       output = output + String.fromCharCode(chr1);

       if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
       }
       if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
       }

       chr1 = chr2 = chr3 = "";
       enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
 }
