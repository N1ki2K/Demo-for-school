/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mRights = {
		rights: null,
		set: function(_rights){
			this.rights = _rights;
		},
		can: function(rule){
			if(typeof rule === "undefined" || !rule || typeof this.rights[rule] === "undefined") return 0;
			return this.rights[rule];
		}
}


var rightsErrorBack = dojo.hitch(this,function(response,ioArgs){
	console.log("Failed XHR: ", response, ioArgs);
	return false;
});

var rightsCallBack =function(response,ioArgs){
	mRights.set(response);
}

dojo.xhrGet({
    url: mainRootUri+"&view=xhrrights",
    load: rightsCallBack,
    handleAs: 'json',
    error: rightsErrorBack
});	