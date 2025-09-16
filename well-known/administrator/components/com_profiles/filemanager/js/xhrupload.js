/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mXHRUpload = {
		processing: 0,
		popupName: "dropbox",
		popupContentNode: null,
		files: [],
		xhr: null,
		counter: 0,
		len: 0,
		popup: null,
		dir: "",
		errorOccured: 0,
		filesDrop: function(files){
			this.processing = 1;
			this.errorOccured = 0;
			this.xhr = new XMLHttpRequest();
			this.counter = 0;
			this.len = files.length;
			for(var t=0; t< this.len; t++){
				if(! mRights.can("upload")){
					files[t].error = "_fmNoAuth";
				}else if(maxUploadSize &&  files[t].size > maxUploadSize){
					files[t].error = '<span style="color: red; margin-left: 10px;">' + mText.file + ': <b style="color:black;">' + files[t].name + '</b> ' + mText.up_too_large + '</span>';
				}else files[t].error = null;
			}			
			
			if(!this.len) return;
			this.files = files;
			this.dir = _("currentDir").value;
			this.popup = newDarkenPopup(this.popupName,"File Upload","<h2 style='padding-left: 10px;'>File Upload</h2>", 800,600);	
			var closeButton = dojo.query(".buttonWindowClose", this.popup.node);
			closeButton[0].setAttribute("onclick", "javascript: mXHRUpload.abortAll(); return false;");
			this.popupContentNode = _("mPopupContent"+ this.popupName);
			this.upload(this.counter++);
		},
		upload: function(count){			
			var file = this.files[count];
			console.log(file);
			if(file.error == "_fmNoAuth") return this.noAuth(file);
			if(file.error) return this.fileToLarge(file);
//			if(! file.size) return this.isFolder(file);
			this.popup.setContent( 
					"<div id='UPG"+count+"' style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
					"<img id='pgImage"+count+"' src='"+mainImageUri+"loader.gif' align='left'/>" +
					"<span id='pgCancel"+count+"' class='smallCancel' onclick='mXHRUpload.abort("+count+");'>"+ mText.cancel + "</span>" +
					"<span style='padding-left: 10px;'>" +
					"<b>"+file.name +"</b>&nbsp;" +
					"<span id='progress"+count+"'>0</span>%" +
					"</span>" +
					"</div>" , 1);
			this.setContentScroll();
		
			this.xhr.open("POST", mainRootUri+"&view=xhrupload&task=xhr&dir="+ this.dir + "&size="+file.size, true);
			this.xhr.setRequestHeader("X-FILENAME", file.name);
			this.xhr.onload = dojo.hitch(this,this.onReadyState);

			this.xhr.onerror = dojo.hitch(this,this.isFolder);
			this.xhr.upload.addEventListener("progress", dojo.hitch(this,this.onUploadProgress));
			this.xhr.send(file);
			
		},
		noAuth: function(file){
			this.errorOccured = 1;
			this.popup.setContent( 
					"<div style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
					"<img src='"+mainImageUri+"no.png' align='left'/> &nbsp;" +
					mText.file + ": " + file.name + "<br/>" +
					mText.rights_noauth_upload +
					"</div>" , 1);
			this.setContentScroll();
			this.checkIfEnd();
		},
		fileToLarge: function(file){
			this.errorOccured = 1;
			this.popup.setContent( 
					"<div style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
					"<img src='"+mainImageUri+"no.png' align='left'/>" +
					file.error +
					"</div>" , 1);
			this.setContentScroll();
			this.checkIfEnd();
		},
		isFolder: function(){
			var count = (this.counter -1); 
			var upg = _("UPG"+count);
			upg.parentNode.removeChild(upg);
			var file = this.files[count];
			this.popup.setContent( 
					"<div style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
					"<img src='"+mainImageUri+"no.png' align='left'/>" +
					"<span style='padding-left: 10px;'>" +
					"<b>"+file.name +"</b>&nbsp;<span style='color:red'>" + mText.isfolder + "</span>" + 
					"</span>" +
					"</div>" , 1);
			this.setContentScroll();
			this.errorOccured = 1;
			this.checkIfEnd();
		},
		setContentScroll: function(){
			this.popupContentNode.scrollTop = this.popupContentNode.scrollHeight;
		},
		abort: function(count){
			this.errorOccured = 1;
			this.xhr.abort();
			_("pgImage"+ count ).src = mainImageUri+"no.png" ;
			var cancelButton = _("pgCancel"+ count) ;
			cancelButton.setAttribute("onclick","return false;");
			dojo.style(cancelButton,{cursor:"default",opacity: 0.2});
			this.popup.setContent( 
					"<div style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
					"<span style='color:red'>" +
					mText.canceled+
					"</span>" +
					"</div>" , 1);
			this.setContentScroll();
			this.checkIfEnd();
			
		},
		abortAll: function(){
			if(this.processing){
				this.xhr.abort();
				
			}
			
			closePopup(this.popupName);
			this.refreshFiles();
		},
		onUploadProgress: function(event){
			if(event.lengthComputable) {
		        var percent = Math.floor( (event.loaded * 100) / event.total);
		        _("progress"+ (this.counter -1 ) ).innerHTML = percent;
		    }
		},
		onReadyState: function(state){
			　if ( this.xhr.readyState == 4 && this.xhr.status == 200 ) {
				var response = this.xhr.responseText;
				var cancelButton = _("pgCancel"+ (this.counter -1 ) ) ;
				cancelButton.setAttribute("onclick","return false;");
				dojo.style(cancelButton,{cursor:"default",opacity: 0.2});
				
				_("progress"+ (this.counter -1 ) ).innerHTML = "100";
				if(response.indexOf('_fmError') !== -1){
					this.errorOccured = 1;
					_("pgImage"+ (this.counter -1 ) ).src = mainImageUri+"no.png" ;
					this.popup.setContent( 
							"<div style='display: block; padding-left: 10px; padding-bottom: 3px; clear:both;'>" +
							"<span style='color:red'>" +
							response.replace("_fmError","")+
							"</span>" +
							"</div>" , 1);
					this.setContentScroll();					
				}else{
					_("pgImage"+ (this.counter -1 ) ).src = mainImageUri+"ok.png" ;
				}
				
				this.checkIfEnd();
			　　　　　　console.log( this.xhr.responseText );
			　　　　} else {
			　　　　　　console.log( this.xhr.status );
			　　　　}
		},
		checkIfEnd: function(){
			if(this.counter >= this.len ) {
				this.end();
			}else{
				this.upload(this.counter++);
			}
		},
		end : function(){
			this.processing = 0;
			if(!this.errorOccured){
				closePopup(this.popupName);				
			}
			this.refreshFiles();
		},
		refreshFiles: function(){
			_LoadTo( mainRootUri+"&view=xhrfiles&dir="+ this.dir, 'splitInnerRight', function() {
				_("mHeaderPath").innerHTML = _("mFetchTitle").innerHTML;
				parseAll(_("splitInnerRight")); evalButtons();
			});
		}
		
};




dojo.addOnLoad(function(){
	if(! _isXHRUpload() ) {
		mLoader.add("XHR Upload init");
		return;
	}
	 //File Drop for HTML 5 browsers
	 var splitRight = _("splitRight");
		 
		 splitRight.addEventListener("dragenter",function(evt){
			 evt.preventDefault();
			},false);
		 
		 
		 splitRight.addEventListener("dragexit",function(evt){
			 evt.preventDefault();
			},false);
		 
		 splitRight.addEventListener("dragover",function(evt){
			 evt.preventDefault();
			},false);
		 
		splitRight.addEventListener("drop",function(evt){
			evt.preventDefault();
			var files = evt.target.files || evt.dataTransfer.files;
//			console.log(evt.dataTransfer);
//			return;
			mXHRUpload.filesDrop(files);			
		},false);
		mLoader.add("XHR Upload init");

});