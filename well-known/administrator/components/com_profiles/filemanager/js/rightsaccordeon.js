/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var RightsAccordeon = {
		
		current: null,	
		INHERIT: -1,
		DISALLOW: 0,
		ALLOW: 1,
		init: function(){
			var first = null;
			dojo.query(".mRightsHeading").forEach(dojo.hitch(this,function(node){
				var id = parseInt(node.getAttribute("rights_id"));
				if(!first){
					if(! mGroupTab)	first = node;
					else if(id == mGroupTab) first = node;
				}
				node.rid = id;
				node.contentNode = _("mRightsContent"+id);
				var bounds = _ViewportOffset(node.contentNode);
				node.bounds = bounds;
				dojo.style(node.contentNode,{height:"0px"});
				node.contentNode.headerNode = node;
				node.startScroll = function(height){
					_fx.animToHeight(this.contentNode, 300, height);
				}
				node.onclick = function(){
					if(RightsAccordeon.current){
						dojo.removeClass(RightsAccordeon.current,"opened");
						RightsAccordeon.current.startScroll(0);
					}	
					mGroupTab = this.rid;
					dojo.byId("mGroupTabForm").value = this.rid;
					RightsAccordeon.current = node;
					dojo.addClass(node,"opened");
					this.startScroll(this.bounds.h);
				}
			}));
			
			if(first){
				RightsAccordeon.current = first;
				first.startScroll(first.bounds.h);
				dojo.addClass(first,"opened");
			}
			
			dojo.query(".mRightSelect").forEach(dojo.hitch(this,function(node){
				dojo.connect("onchange",node,function(){RightsAccordeon.calcRules(this);});
				var id = node.getAttribute("id");
				var groupId = node.getAttribute("group_id");
				var parentId =  node.getAttribute("parent_id");
				var calcValue  = parseInt(node.getAttribute("calc_value"));
				var isUse = dojo.hasClass(node,"is_use");
				var namespace = node.getAttribute("namespace");
				node.namespace = namespace;
				node.isUse = isUse;
				node.calcNode = dojo.byId("calc_"+id);
				node.calcValue = calcValue;
				node.hideMeQuery = ".hideme_"+groupId;
				node.useNode = null;
				if(!isUse){
					node.useNode = dojo.byId("use_"+groupId);
				}
				if(isUse && !calcValue){
					dojo.query(node.hideMeQuery).style({display:"block"});
				}
				node.parent = false;
				node.next = [];
				node.isNext = 0;
				if(parentId){					
					var parentNode = dojo.byId( namespace + "_" + parentId);
					if(parentNode){
						node.parent = parentNode;
						parentNode.isNext  += 1;
						if(!dojo.isArray(parentNode.next)){
							parentNode.next = [];
						}
						parentNode.next.push(node);
					}
				}
				
			}));
			
			
		},
		calcRules: function(node){
			
			if(! node.isUse){
				var useCalcValue = node.useNode.calcValue;
				if( useCalcValue === this.DISALLOW){
					node.calcValue = this.DISALLOW;
					node.calcNode.innerHTML = mText.notallowed;
					node.calcNode.className = "notallowed";
					if(node.isNext){
						dojo.forEach(node.next,function(_node){RightsAccordeon.calcRules(_node); });
					}
					return;
				}
			}
			
			
			var parentCalcValue = parseInt(node.value);
			if(parentCalcValue === this.INHERIT){
				parentCalcValue = ( node.parent ) ? node.parent.calcValue : this.DISALLOW;
			} 
			if(parentCalcValue != node.calcValue){

				node.calcValue = parentCalcValue;
				
				if(node.calcValue){
					node.calcNode.innerHTML = mText.allowed;
					node.calcNode.className = "allowed";
				}else{
					node.calcNode.innerHTML = mText.notallowed;
					node.calcNode.className = "notallowed";
				}
				if(node.namespace == "use"){
					var _display = node.calcValue ? "none" : "block" ;
					dojo.query(node.hideMeQuery).style({display: _display});
				}
				if(node.isNext){
					dojo.forEach(node.next,function(_node){RightsAccordeon.calcRules(_node); });
				}
			}
				
		
		}
		
		
		
		
}
function setRightClick(){};

dojo.addOnLoad(RightsAccordeon.init);