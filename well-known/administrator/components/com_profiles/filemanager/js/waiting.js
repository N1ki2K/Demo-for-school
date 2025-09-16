/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mWaitClass = function(){};

mWaitClass.prototype = {
		node: undefined,
		style: undefined,
		interval: 110,
		count: 0,
		timer: undefined,
		init: function(){
			this.node = _newElement('div');
			this.node.id = "mWaitIcon";
			document.body.appendChild(this.node);
			this.style = this.node.style;
		},
		animate: function(){
			mWait.counter = (mWait.counter<8)? mWait.counter : 0;
			var pos = -32*mWait.counter++;
			mWait.style.backgroundPosition = "0 " + pos + "px";
		},
		play: function(){
			if(this.timer) return false;			
			var m = globalMouse;
			this.style.left = (m.x+32) + "px";
			this.style.top = (m.y+32) + "px";
			this.timer = setInterval(this.animate,this.interval);
			this.style.display ="block";
			_fx.fadeOpacity(this.node, 300, 0, 0.7,null);
			
		},
		stop: function(){
			_fx.fadeOpacity(this.node, 300, 0.7, 0,dojo.hitch(this,function(){
				this.style.display = "none";
				clearInterval(this.timer);
				this.timer = undefined;	
			}));
		},
		move: function(x,y){
			if(!mWait.timer) return false;
			mWait.style.left = (x+32) + "px";
			mWait.style.top = (y+32) + "px";
		}
}

var mWait = new mWaitClass();
dojo.addOnLoad(function(){
	addMouseMoveListener(mWait.move);
	mWait.init();
	mLoader.add("Wait init");
});