/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mSearch = {
		form: null,
		mainWrap: null,
		mainWrapStyle: null,
		wrapStyle: null,
		filesFormNode: null,
		noMatchContainer: null,
		focus: 0,
		freeze: 0,
		noHover: 0,
		buttonAction: 0,
		localClick: 0,
		onfocus: function(evt){
			this.noHover = 1;
			this.wrapStyle.left = "auto";
			this.mainWrapStyle.backgroundPosition = "0 -45px";
			this.focus = 1;
			
		},
		onblur: function(evt){
			setTimeout(function(){mSearch.onblurNext()},200);
		},
		onblurNext: function(){
			if(this.buttonAction) return;
			this.noHover = 0;
			this.freeze = 0;
			this.wrapStyle.left = "";			
			this.mainWrapStyle.backgroundPosition = "";
			this.focus = 0;
		},
		onmouseover: function(evt){
			if(this.noHover) return;	
			this.wrapStyle.left = "auto";
			this.mainWrapStyle.backgroundPosition = "0 -45px";
			this.focus = 1;
		},
		onmouseout: function(evt){
			if(this.noHover) return;	
			this.onblurNext();
		},
		onkeydown: function(evt, node){
			evt = (evt) ? evt : (window.event) ? event : null;
			if (evt) {
				var charCode = (evt.charCode) ? evt.charCode
						: ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			}

			if (dojo.keys.ENTER == charCode){
				this.startSearch(node.value);
			}
			return true;
		},
		onclick: function(evt){
			this.localClick = 1;
			this.freeze = 1; 
			this.onfocus(evt);
			setTimeout(function(){mSearch.localClick = 0; },200);
			
		},
		startSearch: function(text){
			this.freeze = 0;
			this.focus = 0;
			this.noHover = 0;
			this.wrapStyle.left = "-9999em";
			this.mainWrapStyle.backgroundPosition = "0 0";
			setTimeout(function(){
				mSearch.wrapStyle.left=""; 
				mSearch.mainWrapStyle.backgroundPosition = "";
			},200);
			

			var filesFormNode = _("mSortWrap");
			dojo.query( ".mSelect, .mSelectXXL", this.noMatchContainer ).forEach(dojo.hitch(this,function(node){
				filesFormNode.appendChild(node);
			}));

			var splitText =  [];
			var splitTextLenght = 0;
			if(dojo.trim(text)){
				splitText =  text.match(/\w+|"[^"]+"/g);
				splitTextLenght = splitText.length;
				
			}else{
				this.buttonAction = 0;
				return 	mTableHeader.sortAfterSearch();
			}
			
			var noMatchCount = 0;
			dojo.query( ".mListingName", filesFormNode ).forEach(dojo.hitch(this,function(node){
				var fileName = node.getAttribute("data");
				var selectNode = node.parentNode;
				var match = 0;
				for(var t=0; t<splitTextLenght ; t++){
					if(fileName.indexOf(splitText[t]) !== -1){
						match = 1;
						break;
					}
				}	
				if(!match){
					var input = selectNode.getElementsByTagName("INPUT")[0];
					input.setAttribute("id","noMatchItem"+noMatchCount++);
					selectNode.sid = "";
					selectNode.setAttribute("sid", "-1");
					this.noMatchContainer.appendChild(selectNode);
				}
				
			}));

			this.buttonAction = 0;
			mTableHeader.sortAfterSearch();
		},
		checkFocus: function(){
			if(this.focus){
				this.freeze = 0;
				this.focus = 0;
				this.noHover = 0;
				this.wrapStyle.left = "-9999em";
				this.mainWrapStyle.backgroundPosition = "0 0";
				setTimeout(function(){
					mSearch.wrapStyle.left=""; 
					mSearch.mainWrapStyle.backgroundPosition = "";
				},200);
			}
		},
		setFreeze: function(){
			setTimeout(dojo.hitch(this,function(){this.freeze = 1;}),200);
			this.onfocus();
		},
		globalClick: function(evt){	
			if(this.localClick || this.buttonAction) return;
			this.freeze = 0; 
			this.checkFocus();
			
		},
		lastUID: null,
		checkFresh: function(){
			var cleanOrder = dojo.byId("mCleanOrder");
			if(cleanOrder){
				var uid = cleanOrder.getAttribute("unique");
				if(uid != this.lastUID && this.noMatchContainer){
					this.lastUID = uid;
					this.noMatchContainer.innerHTML = "";
				}
			}
		},
		clean: function(){
			this.buttonAction = 1;
			this.form.value = "";
			this.startSearch("");
		},
		fireSearch: function(){
			this.buttonAction = 1;
			this.startSearch(this.form.value);
		},
		init: function(){
			 this.mainWrap = _("mSearch");
			 this.mainWrapStyle = _S('mSearch');
			 this.wrapStyle = _S('mDisplaySearch');
			 this.form = _("mSearchField");
			 this.filesFormNode =  _("mSortWrap");
			 this.noMatchContainer = _("mNoMatchContainer");
			 this.form.value ="";

			 dojo.connect(this.mainWrap,"onmouseover", dojo.hitch(this,this.onmouseover));
			 dojo.connect(this.mainWrap,"onmouseout", dojo.hitch(this,this.onmouseout));
			 dojo.connect(this.mainWrap,"onclick", dojo.hitch(this,this.onclick));
			 
			 dojo.connect(this.form,"onfocus", dojo.hitch(this,this.onfocus));
			 dojo.connect(this.form,"onblur", dojo.hitch(this,this.onblur));
			 dojo.connect(this.form,"onkeydown", function(evt){ return mSearch.onkeydown(evt,this);});	
			 
			 // small buttons
			 // clean
			 dojo.connect(_("mSearchFieldClean"),"onclick", dojo.hitch(this,this.clean));
			 // start search button
			 dojo.connect(_("mSearchFire"),"onclick", dojo.hitch(this,this.fireSearch));
			 
			 
		}
}

dojo.addOnLoad(function(){mSearch.init(); mLoader.add("Search init");});