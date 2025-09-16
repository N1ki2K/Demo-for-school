/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var contentPaneBounds = _ViewportOffset(mWindowContent);
newContentPaneHeight = windowSize.height-myMarginBottom-contentPaneBounds.t;
_S("mEditArea").height = (newContentPaneHeight-120)+"px";
editAreaLoader.init({
			id : "mEditArea"		
			,syntax: "css"
			,toolbar: "new_document, save, load, |,  search, go_to_line, |, undo, redo, |, select_font, |, change_smooth_selection, highlight, reset_highlight, |, help"
			,language: "de"
			,start_highlight: true		
		});