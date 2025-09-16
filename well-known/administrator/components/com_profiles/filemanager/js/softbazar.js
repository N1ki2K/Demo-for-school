/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

function resizePane(size) {
	var w = windowSize;
	var width95 = Math.floor(w.width * 95 / 100);
	var node = nodeComponentWrap;
	var canvas = nodeCanvas;
	switch (size) {
	case 1:
		document.cookie = "SoftBazarAdminSize=" + 1;
		contentPaneResizing(size);
		dojo.animateProperty( {
			node :node,
			duration :1000,
			properties : {
				width : {
					end :width95,
					unit :"px"
				},
				paddingLeft : {
					end :"10",
					unit :"px"
				}
			}
		}).play();

		dojo.animateProperty( {
			node :canvas,
			duration :1000,
			properties : {
				top : {
					end :'90',
					unit :"px"
				}
			},
			onEnd : function() {
				_S("module-menu").display = "block";
				_("mainTable").className = "firstTable";
			}
		}).play();
		if (_S("wallPaper").display == "block") {
			dojo.fadeOut( {
				node :_("wallPaper"),
				onEnd: function(){
				_S("wallPaper").display = "none";	
				},
				duration :1000
			}).play();
		}

		break;
	case 2:
		document.cookie = "SoftBazarAdminSize=" + 2;
		contentPaneResizing(size);
		
		_S("wallPaper").display = "block";
		dojo._setOpacity(_("wallPaper"), 0);
		_S("module-menu").display = "none";
		
		_("mainTable").className = "firstTableFull";

		dojo.fadeIn( {
			node :_("wallPaper"),
			duration :1000
		}).play();

		
		dojo.animateProperty( {
			node :node,
			duration :1000,
			properties : {
				width : {
					end :width95,
					unit :"px"
				},
				paddingLeft : {
					end :"10",
					unit :"px"
				}
			}
		}).play();

		dojo.animateProperty( {
			node :canvas,
			duration :1000,
			properties : {
				top : {
					end :'0',
					unit :"px"
				}
			}
		}).play();
		break;
	case 0:
	default:
		document.cookie = "SoftBazarAdminSize=" + 0;
		contentPaneResizing(size);
	
		dojo.animateProperty( {
			node :node,
			duration :1000,
			properties : {
				width : {
					end :'950',
					unit :"px"
				},
				paddingLeft : {
					end :"0",
					unit :"px"
				}
			}
		}).play();
		
		dojo.animateProperty( {
			node :canvas,
			duration :1000,
			properties : {
				top : {
					end :'90',
					unit :"px"
				}
			},
			onEnd : function() {
				_S("module-menu").display = "block";
				_("mainTable").className = "firstTable";
			}
		}).play();
		
		if (_S("wallPaper").display == "block") {
			dojo.fadeOut( {
				node :_("wallPaper"),
				onEnd: function(){
				_S("wallPaper").display = "none";	
				},
				duration :1000
			}).play();
		}
		
		break;
	}
}

function contentPaneResizing(size){
	
//	windowSize = _WindowSize();
	var newContentPaneHeight = 0;
	switch (size) {
	case 2:
		newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneFull;
		break;

	default:
		newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneNormal;
		break;
	}
	
	console.debug("n c h: "+newContentPaneHeight);
	
	
	dojo.animateProperty( {
		node :contentPane,
		duration :1000,
		properties : {
			height : {
				end :newContentPaneHeight,
				unit :"px"
			}
		}
	}).play();
}//EOF contentPaneResizing


