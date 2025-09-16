/**
 *  Package: ProFiles
 *	Copyright (C) 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 *	License: GPL Friendly Media License [GFML]
 *	License link: http://www.mooj.org/en/licenses/gfml.html
 *	You may only use this script if you received the software package directly via a Mad4Media resource or via the resource of an authorized partner of Mad4Media.
 *	Usage of GFML code outside the software package is not allowed!
 *
**/

var mText = new Object();

var langCallBack =function(response,ioArgs){

	mLoader.add("Text loaded");
	mText = response;	
}

var errorBack = dojo.hitch(this,function(response,ioArgs){
	console.log("Failed XHR: ", response, ioArgs);
	mLoader.add("Text / Suffix failed");
	return false;
});

dojo.xhrGet({
    url: mTextURL,
    load: langCallBack,
    handleAs: 'json',
    error: errorBack
});	

var mSuffix = new Object();
var suffixCallBack =function(response,ioArgs){
	mLoader.add("Suffix loaded");
	mSuffix = response;		
}

dojo.xhrGet({
    url: mSuffixURL,
    load: suffixCallBack,
    handleAs: 'json',
    error: errorBack
});	