/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var _d = document;
var _db ;
dojo.addOnLoad(function(){_db = _d.body; mLoader.add("_db Document Body applied");});
var head = document.getElementsByTagName("head")[0];

var _Browser = {
	IE :!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1),
	Opera :navigator.userAgent.indexOf('Opera') > -1,
	WebKit :navigator.userAgent.indexOf('AppleWebKit/') > -1,
	Gecko :navigator.userAgent.indexOf('Gecko') > -1
			&& navigator.userAgent.indexOf('KHTML') === -1,
	MobileSafari :!!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
	IEVersion : function getInternetExplorerVersion() {
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	}
}

var _OS = {
		Win :  (navigator.appVersion.indexOf("Win")!=-1),
		Mac :  (navigator.appVersion.indexOf("Mac")!=-1),
		Linux: (navigator.appVersion.indexOf("Linux")!=-1)
}


function _(e) {
	return dojo.byId(e);
}
function _S(e) {
	return _(e).style;
}
function _Style(n, s, v) {
	return (v) ? dojo.style(n, s, v) : dojo.style(n, s);
}

function _D(e,s){
	_(e).style.display = s ? "block":"none";
}

function _newElement(e) {
	return _d.createElement(e);
}
function _newElement2Body(e, s, cN, id) {
	n = _newElement(e);
	n.className = cN;
	_Style(n, s);
	n.id = id;
	_d.body.appendChild(n);
	return n;
}
function _removeNode(node){
	node.parentNode.removeChild(node);
}


function _ToggleDisplay(e, hi) {
	hi = (hi) ? hi : "block";
	_S(e).display = (_S(e).display == "none") ? hi : "none";
}
function _ToggleVisibility(e) {
	hi = _S(e).visibility = (_S(e).visibility == "hidden") ? "visible"
			: "hidden";
}
function _ToggleFade(e) {
	if (_S(e).opacity == 0)
		dojo.fadeIn( {
			node :_(e)
		}).play();
	else
		dojo.fadeOut( {
			node :_(e)
		}).play();
}

function funcExists(funcName){
	var isset;
	   try {
	      eval("isset=typeof "+funcName+" == 'function';");
	   } catch (e) {
	      isset=false;
	   }
	   return isset;
}

function _WindowSize() {
	var w = 0;
	var h = 0;

	// IE
	if (!window.innerWidth) {
		// strict mode
		if (!(document.documentElement.clientWidth == 0)) {
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		}
		// quirks mode
		else {
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	}
	// w3c
	else {
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {
		width :w,
		height :h
	};
}// EOF window.size

function _WindowCenter() {
	var hWnd = (arguments[0] != null) ? arguments[0] : {
		width :0,
		height :0
	};

	var _x = 0;
	var _y = 0;
	var offsetX = 0;
	var offsetY = 0;

	// IE
	if (!window.pageYOffset) {
		// strict mode
		if (!(document.documentElement.scrollTop == 0)) {
			offsetY = document.documentElement.scrollTop;
			offsetX = document.documentElement.scrollLeft;
		}
		// quirks mode
		else {
			offsetY = document.body.scrollTop;
			offsetX = document.body.scrollLeft;
		}
	}
	// w3c
	else {
		offsetX = window.pageXOffset;
		offsetY = window.pageYOffset;
	}

	_x = ((_WindowSize().width - hWnd.width) / 2) + offsetX;
	_y = ((_WindowSize().height - hWnd.height) / 2) + offsetY;

	return {
		x :_x,
		y :_y
	};
}

var _AbsoluteBounds = function(element) {
	var valueT = 0, valueL = 0;
	do {
		valueT += element.offsetTop || 0;
		valueL += element.offsetLeft || 0;
		element = element.offsetParent;
		if (element) {
			if (element.tagName.toUpperCase() == 'BODY')
				break;
			var p = element.style.position;
			if (p !== 'static')
				break;
		}
	} while (element);

	var dim = _Dimensions(element);
	var bounds = new Object();
	bounds.l = valueL;
	bounds.t = valueT;
	bounds.w = dim.width;
	bounds.h = dim.height;
	return bounds;
}

function _Dimensions(element) {

	var els = dojo.getComputedStyle(dojo.byId(element));
	var display = els.display;

	element = _(element);
	if (display != 'none' && display != null) // Safari bug
		return {
			width :element.offsetWidth,
			height :element.offsetHeight
		};

	// All *Width and *Height properties give 0 on elements with display none,
	// so enable the element temporarily

	var stl = _S(element);
	var originalVisibility = els.visibility;
	var originalPosition = els.position;
	var originalDisplay = els.display;
	els.visibility = 'hidden';
	els.position = 'absolute';
	els.display = 'block';
	var originalWidth = element.clientWidth;
	var originalHeight = element.clientHeight;
	els.display = originalDisplay;
	els.position = originalPosition;
	els.visibility = originalVisibility;
	return {
		width :originalWidth,
		height :originalHeight
	};
}

function _ViewportOffset(forElement, noAddScroll) {
	var addScroll = noAddScroll ? false : true;
	var valueT = 0, valueL = 0;
	var element = forElement;
	do {
		valueT += element.offsetTop || 0;
		valueL += element.offsetLeft || 0;

		// Safari fix
		if (element.offsetParent == document.body
				&& element.style.position == 'absolute')
			break;

	} while (element = element.offsetParent);

	element = forElement;
	do {
		if (!_Browser.Opera
				|| (element.tagName && (element.tagName.toUpperCase() == 'BODY'))) {
			valueT -= element.scrollTop || 0;
			valueL -= element.scrollLeft || 0;
		}
	} while (element = element.parentNode);

	var scroll = _cumulativeScrollOffset(forElement);
	var dim = dojo.coords(forElement);
	var bounds = new Object();
	bounds.l = valueL + (addScroll ? scroll.left : 0);
	bounds.t = valueT + (addScroll ? scroll.top : 0);
	bounds.w = dim.w;
	bounds.h = dim.h;
	return bounds;
}
function _cumulativeScrollOffset(element) {
	element = _(element);
	var valueT = 0, valueL = 0;
	do {
		valueT += element.scrollTop || 0;
		valueL += element.scrollLeft || 0;
		element = element.parentNode;
	} while (element);
	return {
		left :valueL,
		top :valueT
	};
}


function _Percent(number,percent,round){
	return round?Math.round((number*percent/100)):(number*percent/100);
}

Array.prototype.in_array = function(needle) {
	for(var i=0; i < this.length; i++) if(this[ i] === needle) return true;
	return false;
	};

String.prototype.startsWith = function(pattern) {
    return this.indexOf(pattern) === 0;
};

String.prototype.endsWith =  function(pattern) {
  var d = this.length - pattern.length;
  return d >= 0 && this.lastIndexOf(pattern) === d;
};

var removeScript = new Array();
function script2head(node){
	
	for(var t=0, l= removeScript.length ; t<l; t++){
		_removeNode(removeScript[t]); 
	}
	removeScript = new Array();
	
	 var scriptArray = node.getElementsByTagName("script");
	 var headArray = head.getElementsByTagName("script");
	 var sourceArray = new Array();
	 var noneSourceArray = new Array();
	 
	 for(var t=0, l = headArray.length; t<l ;t++){
		 var source = headArray[t].src;
		 if(source){
			 sourceArray.push(source);
		 }else{
			 noneSourceArray.push(headArray[t]); 
		 }
	 }
	 
	 var nsaLength = noneSourceArray.length;

     var totalScripts = scriptArray.length;
     if (totalScripts!= 0) {
    	 for(var i=0; i< totalScripts;i++){
    		 
    		 var src = scriptArray[0].getAttribute("src") || null;
    		 var itemInnerHTML = scriptArray[0].innerHTML;
    		 var isNew = true;
    		 if(sourceArray.in_array(src)){
    			 isNew = false;
    		 }else{
    			 for(t=0; t<nsaLength; t++){
    				 if(noneSourceArray[t].innerHTML == itemInnerHTML){
    					 isNew = false;
    					 break;
    				 }
    			 }
    		 }
        	 if(isNew){
        		 	 var script = document.createElement("script");
                     script.setAttribute("language", "JavaScript");
                     script.setAttribute("type", "text/javascript");
                     
                     if(src != undefined){
                   	  script.setAttribute("src", src);
                     } 
                     var scriptInner = document.createTextNode(itemInnerHTML);
                     
                     if(_Browser.IE){
                    	 script.text = itemInnerHTML; 
                     }else {
                    	 script.appendChild(scriptInner);
                     }
        		 
        		 
                     head.appendChild(script); 
                     var noCache = scriptArray[0].getAttribute("noCache");
            		 if(noCache=="true" || noCache =="1"){
            			 removeScript.push(script);
            		 }
                 
        	 }
              _removeNode(scriptArray[0]);             
         }
     }
}


getKidsByTagName = function(object,tagname){
	if(object==null) return null;
	var returnArray = new Array();
	var c = object.firstChild;
	if(c!= undefined ){
		if( c.nodeName == tagname){
			returnArray.push(c);
		}
		while(c=c.nextSibling){
			if(c.nodeName== tagname){
				returnArray.push(c);
			}
		}
	}else return null;
	if(returnArray.length==0) return null;
	return returnArray;
}

function nextTag(startNode,tag){
	var node = startNode;
	while(node = node.nextSibling){
		if(node.tagName==tag){
			return node;
		}
	}
	return undefined;
}

function previousTag(startNode,tag){
	var node = startNode;
	while(node = node.previousSibling){
		if(node.tagName==tag){
			return node;
		}
	}
	return undefined;
}






String.prototype.stripTags = function (){
	return this.replace(/(<([^>]+)>)/ig,""); 
	}


function _LoadTo(href,node,success,error){
	mWait.play();
	var lcb = dojo.hitch(this,function(response,ioArgs){
		_(node).innerHTML = response;
		mWait.stop();
		if(success){
			success(response);
		}
		return true;
	});
	
	var errBack = dojo.hitch(this,function(response,ioArgs){
		console.log("Failed XHR: ", response, ioArgs);
		mWait.stop();
		if(error){
			error();
		}
		return false;
	});
	
	return dojo.xhrGet({
	    url: href,
	    load: lcb,
	    error: errBack
	});	
	
}

var _fx = {
	animateDim: function(node,duration,widthStart,widthEnd,widthUnit,heightStart,heightEnd,heightUnit,onEnd){

	if(!node) return false;
	
	var props = new Object();
	if(widthEnd !=undefined){
		props.width = new Object();
		if(widthStart !=undefined) props.width.start = widthStart;
		props.width.end = widthEnd;
		props.width.unit = widthUnit || "px";
	}
	
	if(heightEnd !=undefined){
		props.height = new Object();
		if(heightStart !=undefined) props.height.start = heightStart;
		props.height.end = heightEnd;
		props.height.unit = heightUnit || "px";
	}
	if(onEnd==undefined) onEnd = function(){return true;};
	
		dojo.animateProperty( {
			node : node,
			duration :duration,
			properties :props,
		 onEnd: onEnd
		}).play();	
		
		return true;
	},
	animToHeight: function(node, duration, heightEnd, onEnd){
		this.animateDim(node, duration, undefined, undefined, undefined, undefined, heightEnd, "px", onEnd);
	},
	animToWidth: function(node, duration, widthtEnd, onEnd){
		this.animateDim(node, duration, undefined, widthtEnd, "px", undefined, undefined, undefined, onEnd);
	},
	animatePosition: function(node,duration,leftStart,leftEnd,leftUnit,topStart,topEnd,topUnit,onEnd){
		if(!node) return false;		
		var props = new Object();
		if(leftEnd !=undefined){
			props.left = new Object();
			if(leftStart !=undefined) props.left.start = leftStart;
			props.left.end = leftEnd;
			props.left.unit = leftUnit || "px";
		}
		
		if(topEnd !=undefined){
			props.top = new Object();
			if(topStart !=undefined) props.top.start = topStart;
			props.top.end = topEnd;
			props.top.unit = topUnit || "px";
		}
		if(onEnd == undefined) onEnd = function(){return true;};
		
		dojo.animateProperty( {
			node : node,
			duration :duration,
			properties : props,
		 onEnd: onEnd
		}).play();	
		return true;
	},
	animToTop: function(node, duration, topEnd, onEnd){
		this.animatePosition(node, duration, undefined, undefined, undefined, undefined, topEnd, "px", onEnd);
	},
	animToLeft: function(node, duration, leftEnd, onEnd){
		this.animatePosition(node, duration, undefined, leftEnd, "px", undefined, undefined, undefined, onEnd);
	},
	fadeOpacity: function(node,duration,opacityStart,opacityEnd,onEnd){
		duration = duration || 300;
		if(opacityStart== undefined) opacityStart = 0;
		if(opacityEnd== undefined) opacityEnd = 1;
		onEnd = onEnd || function(){return true;};
		dojo.style(node,{opacity: opacityStart});
		dojo.animateProperty( {
			node : node,
			duration :duration,
			properties : {
				opacity : {
					start: opacityStart,
					end : opacityEnd
				}
			},
		 onEnd: onEnd
			 }).play();
	}
	
};

function makeParameters(node,separate){
		var params = new Object;
		var ro = new Array();
		if(typeof separate === "string"){
			ro.push(separate);
		}else ro = separate;
		
		var evalContainer = "";
		for(t=0; t< node.length;t++){
			if(!ro.in_array(node[t].nodeName)){
				evalContainer += "params."+ node[t].nodeName +" = '"+node[t].nodeValue+"';";
			}
		}
		if(evalContainer != "") eval(evalContainer);
		return params;	
}

function extractNamespace(obj){
	var namespace = obj.namespace || ("mooj"+nameSpaceCounter++);
	delete obj.namespace;
	return namespace;
}

function generalParameters(node){
	return makeParameters(node.attributes,["class","style","title","alt","align","valign","width","height","border","bgcolor"]);
}
function deleteParameters(prams,toDelete){
	var dob = new Array();
	if(typeof toDelete === "string"){
		dob.push(toDelete);
	}else dob = toDelete;
	
	for(t=0; t< toDelete.length;t++){
		eval("delete params."+dob[t]+";");
	}	
}

function detectMouseButton(e){
	var leftclick;
	var middleclick;
	var rightclick;
	if (!e) var e = window.event;
	if (e.which) {
		leftclick = (e.which == 1);
		middleclick = (e.which ==2);
		rightclick = (e.which == 3);
	}
	else if (e.button) {
		if( !_Browser.IE){
			leftclick = (e.button == 0);
			middleclick = (e.button == 1);
			rightclick = (e.button == 2);
		}else {
			leftclick = (e.button ==1);
			middleclick = (e.button == 4);
			rightclick = (e.button == 2);
		}
	}
	var buttonObject= {
			left: leftclick,
			middle: middleclick,
			right: rightclick
	}
	return buttonObject;	
}

function detectMousePosition(e){
	if (!e){var e = window.event;}
	if (e.pageX || e.pageY){
		x = e.pageX;
		y = e.pageY;
	}else if (e.clientX || e.clientY){
		x = e.clientX;
		y = e.clientY;
	}
	return {x:x,y:y};
}

function _Absoulutize(node,addX,addY){
	addX = addX || 0;
	addY = addY || 0;
	var bounds = _ViewportOffset(node,true);
	document.body.appendChild(node);
	var ns = node.style;
	ns.position = "absolute";
	ns.display ="block";
	ns.left = (bounds.l +addX) +"px";
	ns.top = (bounds.t +addY) +"px";
	ns.width = bounds.w +"px";
	ns.height = bounds.h +"px";
	ns.zIndex = "999999999";
	return bounds;
}

function _AppendBounds(b/*bounds*/,node){
	var ns = node.style;
	ns.left = b.l +"px";
	ns.top = b.t + "px";
	ns.width = b.w +"px";
	ns.height = b.h +"px";
	return true;
}

function _Delayed(delay,func){
	setTimeout(func,delay);
}
function _Delayed500(func){
	_Delayed(500, func);
}

function _isXHRUpload(){
	    var xhr = new XMLHttpRequest();
	    return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));	
}
//
//window.alert = function(text){
//	newPopup('Alert','Alert',text,300,200);
//}


if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
