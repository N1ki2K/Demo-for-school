/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mTableHeader = {
		colsLength: 6,
		sort: null,
		order: 0,
		cols: {
			mListingName: 220,
			mListingSize: 100,
			mListingType: 100,
			mListingChanged: 100,
			mListingRights: 120,
			mListingOwner: 80
		},		
		setDefaults: function(){
			this.cols = {
				mListingName: 220,
				mListingSize: 100,
				mListingType: 100,
				mListingChanged: 100,
				mListingRights: 120,
				mListingOwner: 80
			};
		},
		lookUp: ["mListingName","mListingSize","mListingType","mListingChanged","mListingRights","mListingOwner"],
		lookUpText: null,
		toCookie: function(){
			var value = this.cols.mListingName + "," +
						this.cols.mListingSize + "," +
						this.cols.mListingType + "," +
						this.cols.mListingChanged + "," +
						this.cols.mListingRights + "," +
						this.cols.mListingOwner ;
			xhrCookie(null,"mtableheader",value);
		},
		fromCookie: function(){
			var value = unescape(getCookie("mtableheader"));
			if(value){
				var sizes = value.split(",");
				var l = sizes.length;
				if(l == this.colsLength){
					var allOk = 1;
					for(var t=0; t<l; t++){
						var width = parseInt(sizes[t]);
						if(width){
							this.cols[this.lookUp[t]] = parseInt(sizes[t]);
						}else{
							allOk = 0;
							break;
						}
					}
					if(allOk) return true;	
				}
			}			
			this.setDefaults();				
			this.toCookie();
			return false;
			
		},
		set: function(name,value){
			if(this.nameString == this.nameString.replace(name,"*")) return;
			this.cols[name] = parseInt(value);
		},
		get: function(name){
			if(this.nameString == this.nameString.replace(name,"*")) return;
			return this.cols[name];
		},
		toStyles: function(){
			var buffer = "";
			for(var t=0; t< this.colsLength; t++){
				buffer += "."+this.lookUp[t]+"{width:"+this.cols[this.lookUp[t]]+"px;} ";
			}
			
			if(_Browser.IE && _Browser.IEVersion()<=10){
				var parent = this.styleNode.parentNode;
				parent.removeChild(this.styleNode);
				this.styleNode = null;
				var dummy = document.createElement("DIV");
				dummy.innerHTML = '<style type="text/css" id="mHeaderStyles">'+buffer+'</style>';
				parent.appendChild(dummy.firstChild);
				this.styleNode = dojo.byId("mHeaderStyles");	
			}else{
				this.styleNode.innerHTML = buffer;
			}
		},
		sortColumn: function(headNode){
			var className = dojo.trim(headNode.className);
			if(className == this.sort){
				this.order = this.order ? 0 : 1;
			}else{
				if(this.sort){
				_S(this.sort+"Order").backgroundPosition = "0 0";	
				}
				this.sort = className;
				this.order = 0;
			}
			_S(this.sort+"Order").backgroundPosition = this.order ? "0 -16px" : "0 -32px";	
			this.sortProcess(className,1);
		},
		sortProcess: function(className,isFileView){
			var isFV = isFileView || 0;
			var farr =[];
			var arr = [];
			var filesFormNode = _("mSortWrap");
			dojo.query( "."+className, filesFormNode ).forEach(dojo.hitch(this,function(node){
				var selectWrap = node.parentNode;
				var data =  dojo.trim(node.getAttribute("data"));
				if(className == "mListingSize" ||  className == "mListingChanged"){
					data = parseInt(data);
				}
				if(dojo.hasClass(selectWrap,"mSelectFolder")){
					farr.push( [ node.parentNode, data] );					
				}else{
					arr.push( [ node.parentNode, data] );					
				}
			}));
			if(this.order){
				farr.sort(function(a, b) { return (a[1] > b[1] ? -1 : (a[1] < b[1] ? 1 : 0)); });
				arr.sort(function(a, b) { return (a[1] > b[1] ? -1 : (a[1] < b[1] ? 1 : 0)); });
			}else{
				farr.sort(function(a, b) { return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)); });
				arr.sort(function(a, b) { return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)); });				
			}
			var count = 0;
			

			dojo.forEach(farr,dojo.hitch(this,function(item){
				if(isFV){
					dojo.removeClass(item[0],"odd");
					if(count%2) dojo.addClass(item[0],"odd");					
				}
				var input = item[0].getElementsByTagName("INPUT")[0];
				input.setAttribute("id","input-"+count);
				item[0].sid = count;
				item[0].setAttribute("sid", count++);
				filesFormNode.appendChild(item[0]);
			}));
			
			dojo.forEach(arr,dojo.hitch(this,function(item){
				if(isFV){
					dojo.removeClass(item[0],"odd");
					if(count%2) dojo.addClass(item[0],"odd");					
				}
				var input = item[0].getElementsByTagName("INPUT")[0];
				input.setAttribute("id","input-"+count);
				item[0].sid = count;
				item[0].setAttribute("sid", count++);
				filesFormNode.appendChild(item[0]);
			}));
		},
		
		folderViewSort: function(){
			var content = '<div style="padding: 20px; text-align: center;">';
			content += 	  '<select id="mSortOption">'; 
			for(var t=0, l= this.lookUp.length; t< l; t++){
				content += '<option value="'+t+'">'+this.getText(t)+'</option>'+"\n";
			}			
			content +=  '</select>';
			
			content += 	  '<select id="mSortOrder">' +
						  '<option value="0">'+mText.inc+'</option>' +
						  '<option value="1">'+mText.dec+'</option>' +
						  '</select>';
						
			content += '<div style="clear:both;"></div><a onclick="javascript:  mTableHeader.folderViewSortStart(); return false;" href="" style="width:60px; float: none; display:inline-block; margin-top: 10px;" class="askButton">'+mText.sort+'</a>'
			
			content += '</div>'
			
			var popup = newPopup("folderviewsort",mText.sorting,content,400,100);
		},
		folderViewSortStart: function(){
			var optionValue = parseInt(_("mSortOption").value) ; 
			var option = this.lookUp[optionValue];
			option = option ? option : "mListingName";
			var order = _("mSortOrder").value;
			this.sort = dojo.trim(option);
			this.order = parseInt(order);
			
			
			var orderText = this.order ? mText.dec : mText.inc ;
			
			_("mSelectedSort").innerHTML = mText.sorting+": “" + this.getText(optionValue) + "“ - " + orderText;			
			this.sortProcess(this.sort);
		},
		sortAfterSearch: function(){
			if(!this.sort){
				this.sort = this.lookUp[0];
				this.order = 0;
			}
			var isFileView = (filesViewState == 2) ? 0 : 1;
			this.sortProcess(this.sort, isFileView);
		},
		cleanOrderId: null,
		cleanOrder: function(force){
			
			if(typeof mText.sorting != "undefined"){
				_("mSelectedSort").innerHTML = mText.sorting;		
			}
			
			var allow = force || 0;
			var infoWrap = dojo.byId("mCleanOrder");
			if(infoWrap){
				var id = infoWrap.getAttribute("unique");
				if(id != this.cleanOrderId){
					allow = 1;
					this.cleanOrderId = id;
				}
			}
			
			if(allow && this.sort){
					_S(this.sort+"Order").backgroundPosition = "0 0";
					this.sort = null;
			}
		},		
		getText: function(no){
			if(!this.lookUpText){
				this.lookUpText = [ mText.name, mText.size, mText.type, mText.changed, mText.rights, mText.owner ];
			}
			return this.lookUpText[no];
		},
		rulerStyle: null,
		doNothin: null,
		draggingItem : null,
		valveNodes: [],
		smallest: 40,
		init: function(){
			//applying sort events
			dojo.forEach(this.lookUp,function(name){
				dojo.connect(_(name+"Node"),"onclick",function(evt){mTableHeader.sortColumn(this);});	
			});
			
			this.nameString = this.lookUp.join(" ");
			this.colsLength = this.lookUp.length;
			this.styleNode = dojo.byId("mHeaderStyles");
			this.rulerStyle = dojo.byId("mTableColWidth").style;
			this.doNothin = dojo.byId("doNothin");
			dojo.style(this.doNothin,{opacity: 0.1});
			
			var isFromCookie = this.fromCookie();
			
			dojo.query(".mListingValve",_("mSelectHeadingInner")).forEach(dojo.hitch(this,function(valve){
				valve.ref = dojo.trim(valve.getAttribute("data"));
				valve.refNode = dojo.byId(valve.ref+"Node");
				valve.bounds = _ViewportOffset(valve.refNode);
				valve.value = valve.bounds.w;

				this.valveNodes.push(valve);
				
				dojo.connect(valve,"onmousedown",function(el){
					if(!mTableHeader.draggingItem){
						mTableHeader.draggingItem = this;
						if(! mTableHeader.doNothin.parentNode){
							_("splitRight").appendChild(mTableHeader.doNothin);
						}
						mTableHeader.doNothin.style.left = "0";
						document.body.style.cursor = "e-resize";
					}
				});
			}));
			
			addMouseMoveListener(dojo.hitch(this,function(x,y){
				if(this.draggingItem && x > (this.draggingItem.bounds.l+this.smallest) ){
					this.rulerStyle.left = x +"px";		
					this.draggingItem.value = x;
				}else if(this.draggingItem){
					this.draggingItem.value = this.draggingItem.bounds.l+this.smallest;
					this.rulerStyle.left = this.draggingItem.value +"px";	
				}		
			}));
			
			addMouseUpListener(dojo.hitch(this,function(button){
				if(!this.draggingItem) return;
				this.rulerStyle.left = "-9999em";
				this.doNothin.style.left = "-9999em";
				 document.body.style.cursor = "default";
				 var width = this.draggingItem.value-this.draggingItem.bounds.l;
				 this.set(this.draggingItem.ref, width);
				 this.toStyles();
				 this.toCookie();
				
				 dojo.forEach(this.valveNodes, function(node){
					 node.bounds = _ViewportOffset(node.refNode);
				 });
				 
				this.draggingItem = null;
			}));			
			
			this.toStyles();
		},
		
		
}






dojo.addOnLoad(function(){
	mTableHeader.init();
	mLoader.add("Table Header init");
});