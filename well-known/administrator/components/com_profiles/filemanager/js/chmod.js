/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var MCHMOD = {
		popup: function(transferState,defaultMode){			
			var text = '<table class="mRightsTable" style="width:100%;"><tbody><tr>' +
					  '<td class="heading"  style="width:33.3%; min-width: auto; text-align:center;">'  + mText.own  +'</td>' +
					  '<td class="heading" style="width:33.3%; min-width: auto; text-align:center;">'  + mText.grp  +'</td>' +
					  '<td class="heading" style="width:33.3%; min-width: auto; text-align:center;">'  + mText.pub  +'</td>' +
					  '</tr>' +
					  '<tr>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="o-r" onclick="javascript: MCHMOD.onclick(this);" ></div><span>r</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="g-r" onclick="javascript: MCHMOD.onclick(this);" ></div><span>r</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="p-r" onclick="javascript: MCHMOD.onclick(this);" ></div><span>r</span></div></td>' + 
					  '</tr>' + 
					  '<tr>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="o-w" onclick="javascript: MCHMOD.onclick(this);" ></div><span>w</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="g-w" onclick="javascript: MCHMOD.onclick(this);" ></div><span>w</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="p-w" onclick="javascript: MCHMOD.onclick(this);" ></div><span>w</span></div></td>' + 
					  '<tr>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="o-x" onclick="javascript: MCHMOD.onclick(this);" ></div><span>x</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="g-x" onclick="javascript: MCHMOD.onclick(this);" ></div><span>x</span></div></td>' + 
					  '<td class="chmod" align="center" valign="middle"><div class="cbwrap"><div class="mCheckbox" id="p-x" onclick="javascript: MCHMOD.onclick(this);" ></div><span>x</span></div></td>' + 
					  '</tr>' + 
					  '</tbody></table>';
					  
			text += '<br><span style="margin-left:11px;" >'
					+ mText.set_mode
					+ "</span><br>"
					+ '<div class="askWrapper" ><input class="renameInput" type="text" value="'+defaultMode+'" id="modeValue" maxlength="3" onfocus="editingFocus = true;" onblur="MCHMOD.threeCheck(this); MCHMOD.calcToCheck(this.value); editingFocus=false;"/>';

			switch (transferState) {
			case "files":
				text += '<a class="askButton" style="width:60px;" href="" onclick="javascript: rcFilesMode(); return false;">'
						+ mText.set + "</a> </div>";
				break;

			case "folder":
				text += '<a class="askButton" style="width:60px;" href=""  onclick="javascript: rcFoldersMode(); return false;">'
						+ mText.set + "</a> </div>";
				break;
			}
			newDarkenPopup("Chmod", mText.changemode, text, 400, 200);

			// dojo.connect(_("modeValue"),"onkeydown",rcChmodKeyDown);
			_("modeValue").onkeypress = MCHMOD.rcChmodKeyDown;
			_("modeValue").onkeyup= function(){	MCHMOD.calcToCheck(this.value+"");};
			if (_Browser.IE)
				forceInputFocus = setTimeout("MCHMOD.permanentInputChmodFocus");
			else
				_("modeValue").focus();
			
			this.calcToCheck(defaultMode+"");
		},
		permanentInputChmodFocus: function() {
			_("modeValue").focus();
			forceInputFocus = setTimeout("MCHMOD.permanentInputChmodFocus");
		},
		rcChmodKeyDown: function(evt) {
			evt = (evt) ? evt : (window.event) ? event : null;
			if (evt) {
				var code = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode
						: ((evt.which) ? evt.which : 0));
			}
//			console.log("key:" + code);
			if ((37 == code) || (39 == code) || (46 == code) || (8 == code)
					|| (code < 56 && code > 47)) {
//				console.log(code + " pressed");
				return true;
			} else if (dojo.keys.ENTER == evt.keyCode) {
				if (_("modeValue").value.length != 3)
					return false;
				if (transferState == "files")
					rcFilesMode();
				else
					rcFoldersMode();
				return false;
			} else {
				return false;
			}
		},
		threeCheck: function(node){

			var value = node.value + "";
			var length = value.length;
			if( !value || parseInt(value) === 0) value = "000";
			else if(length == 1) value =  value + "00" ;
			else if(length == 2) value = value + "0" ;
			node.value = value;
		},
		
		state: [],
		setState: function(node,_state){
			this.state[node.id] = parseInt(_state);
		},
		getState: function(node){
			var id = null;
			if(dojo.isString(node)) id = node;
			else id = node.id;
			if(typeof this.state[id] === "undefined") return 0;
			return parseInt(this.state[id]);
		},
		calcToCheck: function(mode){
			this.int2Bit(parseInt(mode.charAt(0)),"o");
			this.int2Bit(parseInt(mode.charAt(1)),"g");
			this.int2Bit(parseInt(mode.charAt(2)),"p");			
		},
		toggleCheck: function(node){
			this.setState( node, this.getState(node) ? 0 : 1 );
			
		},
		check: function(node,_state){
			this.setState(node, _state);
			this.renderCheck(node);			
		},
		renderCheck: function(node){
			node.className = this.getState(node) ? "mCheckbox" : "mCheckbox off";
		},
		int2Bit: function(val,user){
			var node = dojo.byId(user+"-r")
			if( (val-4) >=0){
				val -=4;
				this.check(node, 1);
			}else{
				this.check(node, 0);
			}
			node = dojo.byId(user+"-w")
			if( (val-2) >=0){
				val -=2;
				this.check(node, 1);
			}else{
				this.check(node, 0);
			}
			node = dojo.byId(user+"-x")
			if( (val-1) >=0){
				val -=1;
				this.check(node, 1);
			}else{
				this.check(node, 0);
			}
			
		},
		onclick: function(node){
			this.toggleCheck(node);
			this.check2Value();
			this.renderCheck(node);
		},
		check2Value: function(){
			var value =  this.getUserVal("p")+ (this.getUserVal("g")*10) + (this.getUserVal("o")*100);
			if(value === 0) value = "000";
			else if(value < 10) value = "00" + value;
			else if(value < 100) value = "0" + value;
			_("modeValue").value = value;
		},
		getUserVal: function(user){
			var value = 0;
			value += this.getState(user+"-r") ? 4 : 0;
			value += this.getState(user+"-w") ? 2 : 0;
			value += this.getState(user+"-x") ? 1 : 0;
			return value;
		}
		
		
		
}