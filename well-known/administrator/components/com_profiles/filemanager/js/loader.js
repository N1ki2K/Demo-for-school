/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mLoader = {
	mode: 1,
	count: 17,
	added: 0,
	assigned: [],
	progressNode: null,
	add: function(part){
		this.assigned.push(part);
		this.added++;
		if(this.mode) {
			console.log(this.added + ". "+ part);
		}

		if(! this.progressNode){
			var pn = dojo.byId("mProgress");
			if(typeof pn !== "undefined" && pn) this.progressNode = pn ;
		}else{
			this.progressNode.style.width = (this.added/this.count * 100) + "%";
		}
		
		if(this.count == this.added){
		dojo.query(".mLoadingPaneGeneral,.mLoadingPrompt").style({display:"none"});
		}
	}	
}