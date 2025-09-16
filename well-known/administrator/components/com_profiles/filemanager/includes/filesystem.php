<?php
/**
 * @package		Profiles
 * @subpackage	filemanger
 * @copyright	Copyright (C) 2013 - 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 * @license		Libraries can be under a different license in other environments
 * @license		Media files owned and created by Mad4Media such as 
 * @license 	Javascript / CSS / Shockwave or Images are licensed under GFML (GPL Friendly Media License). See GFML.txt.
 * @license		3rd party scripts are under the license of the copyright holder. See source header or license text file which is included in the appropriate folders
 * @version		1.0
 * @link		http://www.mad4media.de
 * Creation date 2013/02
 */

//CUSTOMPLACEHOLDER
//CUSTOMPLACEHOLDER2

defined('_JEXEC') or die;

function modeStandard($mode = "000"){
	if(strlen(trim($mode))== 4) $mode = substr($mode, 1,3);
	return $mode;
}

// Getting the Files
function fmGetFiles(){
	global $dir;
	$maxThumbnailSize =  (int) MConfig::instance()->get("max_tn_size", 51200);
	$filesView = 	$GLOBALS['filesView'];
	$c = new MContainer();

	$classPostFix = ($filesView==2)? "XXL":null;
	$mt = "margin-top: 0px;";
	$files = MFile::filesInfo($dir);
	
	$dirs = MFile::getDir($dir,false);
	
	$canOpen= MRights::can("open");
	
	
	if($files || $dirs){
		$c->add('<form id="filesFormNode" method="post" action="'.MURL::_("xhrfiles").'">');
		$c->add('<input type="hidden" name="task" value="move" id="selectFilesTask">');
		$c->add('<input type="hidden" name="dir" value="'.MURL::safePath($dir).'" id="currentDir">');
		$c->add('<input type="hidden" name="file" value="" id="selectedFile">');
		$c->add('<input type="hidden" name="newname" value="" id="newFileName">');
		$c->add('<input type="hidden" name="destination" value="" id="destinationFolder">');
		$c->add('<input type="hidden" name="zipname" value="" id="zipName">');
		$c->add('<input type="hidden" name="chmod" value="" id="changeMode">');
		$c->add('<div class="mSelectable fullSpace" style="height:auto; '.$mt.'" namespace="files" selecttype="winlike" dragable="folders" ordering="1" dblc="filesDblc" dropfunc="filesDropp">');
		$c->add('<div id="mSortWrap">');	
		$counter = 0;
		
		foreach($dirs as $_dir){
			$odd = ($counter&1 && $classPostFix!="XXL")? " odd": "";
					
			$_dir->mode = modeStandard($_dir->mode);
			
			$wp ="";
			$wpList="";
			if( ! $_dir->isWritable){
				$wp = '<span class=\'writeProtected\'>'.MText::_("write_protected")."</span><br>";
				$wpList = ' style="color:red;" ';
			}
		
			// processing image thumbnails
			$image = "";
			if($classPostFix=="XXL"){
				// is XXL
				$baseNameWrapInfo = wordwrap($_dir->baseName,20,'<br>',true);
		
				if(strlen($_dir->baseName)>17){
					$baseNameWrap = substr($_dir->baseName,0,14)."...";
				}else{
					$baseNameWrap = $_dir->baseName;
				}
				// Not an Image or not a browser supported image
				$info = "<b style='color:#517ab9;'>".$baseNameWrapInfo."</b><br>".MText::_('type').": ".MText::_('folder')."<br>".MText::_('mode').": ".$_dir->mode.'<br>'.MText::_('owner').": ".$_dir->owner."<br>".$wp;
				$image = '<div class="mImgWrapper"><center><img src="'._FM_HOME_FOLDER.'/images/bigicons/folder.png" info="'.$info.'" style="width:96px;height:96px;"/></center></div>';
				
					
				$c->add('<div class="mSelect'.$classPostFix.$odd.
						' mSelectFolder" droppable="folders" sid="'.$counter++.'" href="'.MURL::safePath($_dir->fileName).'" array="selectedFiles" type="" baseName="'.$_dir->baseName.'" chmod="'.$_dir->mode.'">'.$image.
						'<span>'.$baseNameWrap.'</span>'.
						'
						<div class="mListingName mHide" data="'.urlencode(strtolower($_dir->baseName) ).'"></div>
						<div class="mListingSize mHide" data="-1"></div>
						<div class="mListingType mHide" data="'.urlencode(MText::_("folder")).'"></div>
						<div class="mListingChanged mHide" data="'.urlencode($_dir->lastModifiedTimestamp).'"></div>
						<div class="mListingRights mHide"  data="'.urlencode($_dir->mode).'"></div>
						<div class="mListingOwner mHide" data="'.urlencode($_dir->owner).'"></div>
						'.					
						'</div>');
		
			}else{
				// is not XXL
				$image = '<img src="'._FM_HOME_FOLDER.'/images/icons/folder.png" align="left"/>';
		
				$c->add('<div class="mSelect'.$classPostFix.$odd.
						' mSelectFolder" droppable="folders" sid="'.$counter++.'" href="'.MURL::safePath($_dir->fileName).'" array="selectedFiles" type=""  baseName="'.$_dir->baseName.'" chmod="'.$_dir->mode.'">'
						.'
						<div class="mListingName" data="'.urlencode(strtolower($_dir->baseName) ).'">'.'<span>'.$image.$_dir->baseName.'</span></div>
						<div class="mListingSize" data="-1"><span></span></div>
						<div class="mListingType" data="'.urlencode(MText::_("folder")).'"><span>'.MText::_("folder").'</span></div>
						<div class="mListingChanged" data="'.urlencode($_dir->lastModifiedTimestamp).'"><span>'.$_dir->lastModified.'</span></div>
						<div class="mListingRights" data="'.urlencode($_dir->mode).'"><span'.$wpList.'>('.$_dir->mode.') '.$_dir->permmask.'</span></div>
						<div class="mListingOwner" data="'.urlencode($_dir->owner).'"><span>'.$_dir->owner.'</span></div>
						'.
						'</div>');
					
			}//EOF not XXL
			// EOF processing image thumbnails
		}//EOF DIR loop
		
		// Files loop
		if($files){
			foreach($files as $file){
				$odd = ($counter&1 && $classPostFix!="XXL")? " odd": "";
				
				$file->mode = modeStandard($file->mode);
				
				$audio ="";
				if($file->extension == "mp3"){
					$audio = 'audio="mp3" ';
				}
	
				$wp ="";
				$wpList="";
				$wpXXL ="";
				if( ! $file->isWritable){
					$wp = '<span class=\'writeProtected\'>'.MText::_("write_protected")."</span><br>";
					$wpList = ' style="color:red;" ';
					$wpXXL = '<img class="wp" src="'._FM_HOME_FOLDER.'/images/wp.png" />';
				}
					
				// processing image thumbnails
				$image = "";
				if($classPostFix=="XXL"){
					// is XXL
					$baseNameWrapInfo = wordwrap($file->baseName,20,'<br>',true);
	
					if(strlen($file->baseName)>17){
						$baseNameWrap = substr($file->baseName,0,14)."...";
					}else{
						$baseNameWrap = $file->baseName;
					}
	
	
					if($file->isImage){
							$size = getimagesize($file->fileName);
							$w = (int) $size[0];
							$h = (int) $size[1];
						
							if(!$canOpen){
								$w = 96; $h = 76;
								if(_M_IMAGE_VIEW_STATE){
									$wp .= '<span class=\'noAuthPreview\'>'.MText::_("rights_noauth_preview")."</span><br>";
								}
							}
							
						if(!_M_IMAGE_VIEW_STATE){
							
							$info = "<b style='color:#517ab9;'>".$baseNameWrapInfo."</b><br>".MText::_('dim').": ".$w." x ".$h.'<br>'.MText::_('type').": ".$file->extension."<br>".MText::_('size').": ".$file->smartSize."<br>".MText::_('mode').": ".$file->mode.'<br>'.MText::_('owner').": ".$file->owner."<br>".$wp;
							$image = '<div class="mImgWrapper"><center><img src="'._FM_HOME_FOLDER.'/images/bigicons/image.png" info="'.$info.'" style="width:96px;height:96px;"/></center>'.$wpXXL.'</div>';
							
						}else{
							if($file->size <= (int)  $maxThumbnailSize ){
								$fit = fitImage2Box(96,96,$w,$h);
								$x = $fit["w"];
								$y = $fit["h"];
	
								$info = "<b style='color:#517ab9;'>".$baseNameWrapInfo."</b><br>".MText::_('dim').": ".$w." x ".$h.'<br>'.MText::_('type').": ".$file->extension."<br>".MText::_('size').": ".$file->smartSize."<br>".MText::_('mode').": ".$file->mode.'<br>'.MText::_('owner').": ".$file->owner."<br>".$wp;
								$image = '<div class="mImgWrapper" align="center"><center><img align="center" src="'.MURL::_("xhrimage",MURL::safePath($file->fileName)).'" style="width:'.$x.'px; height:'.$y.'px;" info="'.$info.'" /><center>'.$wpXXL.'</div>';
							
							
							
							}else{
								// Image is too large
								$info = "<b style='color:#517ab9;'>".$baseNameWrapInfo."</b><br>".MText::_('dim').": ".$w." x ".$h.'<br>'.MText::_('type').": ".$file->extension."<br>".MText::_('size').": ".$file->smartSize."<br>".MText::_('mode').": ".$file->mode.'<br>'.MText::_('owner').": ".$file->owner."<br>".$wp;
								$image = '<div class="mImgWrapper"><center><img src="'._FM_HOME_FOLDER.'/images/bigicons/image.png" info="'.$info.'<span class=\'itb\'>'.MText::_("imagetoolarge").'</span>'.'" style="width:96px;height:96px;"/></center>'.$wpXXL.'</div>';
							}
						}
					}else{
						// Not an Image or not a browser supported image
						$info = "<b style='color:#517ab9;'>".$baseNameWrapInfo."</b><br>".MText::_('type').": ".$file->extension."<br>".MText::_('size').": ".$file->smartSize."<br>".MText::_('mode').": ".$file->mode.'<br>'.MText::_('owner').": ".$file->owner."<br>".$wp;
						$image = '<div class="mImgWrapper"><center><img src="'.MIcon::_($file->extension,1).'" info="'.$info.'" style="width:96px;height:96px;"/></center>'.$wpXXL.'</div>';
					}
	
						
					$c->add('<div class="mSelect'.$classPostFix.$odd.
					'" sid="'.$counter++.'" href="'.MURL::safePath($file->fileName).'" array="selectedFiles" type="'.$file->extension.'" baseName="'.$file->baseName.'" chmod="'.$file->mode.'">'.$image.
					'<span>'.$baseNameWrap.'</span>'.
					'
					<div class="mListingName mHide" data="'.urlencode(strtolower($file->baseName) ).'"></div>
					<div class="mListingSize mHide" data="'.urlencode($file->size).'"></div>
					<div class="mListingType mHide" data="'.urlencode($file->extension).'"></div>
					<div class="mListingChanged mHide" data="'.urlencode($file->lastModifiedTimestamp).'"></div>
					<div class="mListingRights mHide" data="'.urlencode($file->mode).'"></div>
					<div class="mListingOwner mHide" data="'.urlencode($file->owner).'"></div>
					'.
					'</div>');
	
				}else{
					// is not XXL
					$image = '<img src="'. MIcon::_($file->extension).'" align="left"/>';
	
					$c->add('<div class="mSelect'.$classPostFix.$odd.
					' mSelectFile" sid="'.$counter++.'" href="'.MURL::safePath($file->fileName).'" array="selectedFiles" type="'.$file->extension.'"  baseName="'.$file->baseName.'" chmod="'.$file->mode.'">'
					.'
					<div class="mListingName" data="'.urlencode(strtolower($file->baseName) ).'">'.'<span'.$wpList.'>'.$image.$file->baseName.'</span></div>
					<div class="mListingSize" data="'.urlencode($file->size).'"><span>'.$file->smartSize.'</span></div>
					<div class="mListingType" data="'.urlencode($file->extension).'"><span>'.strtoupper($file->extension).'</span></div>
					<div class="mListingChanged" data="'.urlencode($file->lastModifiedTimestamp).'"><span>'.$file->lastModified.'</span></div>
					<div class="mListingRights" data="'.urlencode($file->mode).'"><span'.$wpList.'>('.$file->mode. ') ' . $file->permmask. '</span></div>
					<div class="mListingOwner" data="'.urlencode($file->owner).'"><span>'.$file->owner.'</span></div>
					'.
					'</div>');
						
				}//EOF not XXL
				// EOF processing image thumbnails
					
					
	
					
					
			}//EOF files loop
		}//EOF is files
		$c->add('</div">'); // EOF sortWrap
		if($counter!=0){
			$c->add("<span style='display:none;' id='selectStopNo' value='".($counter-1)."'></span>");
		}
		$c->add('</div></form>');
	}else{
		$c->add('<form id="filesFormNode" method="post" action="'.MURL::_("xhrfiles").'">');
		$c->add('<input type="hidden" name="task" value="move" id="selectFilesTask">');
		$c->add('<input type="hidden" name="dir" value="'.MURL::safePath($dir).'" id="currentDir">');
		$c->add('<input type="hidden" name="file" value="" id="selectedFile">');
		$c->add('<input type="hidden" name="newname" value="" id="newFileName">');
		$c->add('<input type="hidden" name="destination" value="" id="destinationFolder">');
		$c->add('<input type="hidden" name="zipname" value="" id="zipName">');
		$c->add('<input type="hidden" name="chmod" value="" id="changeMode">');
		$c->add('</form>');
	}
	$c->add('<div id="mCleanOrder" style="display:none;" unique="'.md5(uniqid()).'"></div>'. "\n");
	$c->add('<div id="mFetchTitle" style="display:none;">'. str_replace(array("/","\\"), " - ", str_replace(_START_FOLDER, "", $dir) ).'</div>'. "\n");
	
	$c->add('<div id="mGoUpUrl" style="display:none;">'. MURL::safePath($dir).'</div>'. "\n");
	return $c->get();
}


function fmGetDefaultFolders(){
	global $dir;
	$output ="";
	if(!$dir) $dir = _START_FOLDER;
	$dirs = MFile::getDir($dir,false);
	$isDir = (sizeof($dirs)>0)? true:false;
	if($isDir){
		$firstInfo = MFile::info($dir);
			
		$finfo = MText::_('folderpermission')." ".$firstInfo->mode.'<br>'.MText::_('owner').": ".$firstInfo->owner.'<br>';
		$output .= '<div id="rootWrap" ><div class="minus"></div><a href="'.
		MURL::_("xhrfiles",MURL::safePath($dir)).'" class="opened" id="rootFolderLink" finfo="'.$finfo.'" url="" ><span>'.MText::_("rootfolder").'</span></a>';
		$output .= '<ul id="on" dummy="0" style="overflow:visible; white-space: nowrap;">';
		foreach($dirs as $d){
			$isSub = (MFile::hasSubDir($d->fileName))? 'plus':'spacer';
			$wp ="";
			if( ! $d->isWritable){
				$wp = '<span class=\'writeProtected\'>'.MText::_("write_protected")."</span>";
			}
						
			$finfo = MText::_('folderpermission')." ".$d->mode.'<br>'.MText::_('owner').": ".$d->owner.'<br>'.$wp;
			$output .= '<li><div class="'.$isSub.'" droppable="folders" ></div><a href="'.
			MURL::_("xhrfiles",MURL::safePath($d->fileName)).
					'" class="closed" finfo="'.$finfo.'" url="'.MURL::safePath($d->fileName).'" chmod="'.$d->mode.'"><span>'.$d->baseName.'</span></a>';
			$output .= '<ul id="off" dummy="1"></ul></li>'."\n";

		}
		$output .= '</ul></div>';
		$output .= "<script>dojo.addOnLoad(function(){currentFolderNode['folders'] = _('rootFolderLink');});</script>";
	}else{
		$firstInfo = MFile::info($dir);
		$finfo = MText::_('folderpermission')." ".$firstInfo->mode.'<br>'.MText::_('owner').": ".$firstInfo->owner.'<br>';
		$output .= '<div id="rootWrap" ><div class="spacer"></div>'.
					'<a href="'.	MURL::_("xhrfiles",MURL::safePath($dir)).'" class="opened" id="rootFolderLink" finfo="'.
					$finfo.'" url="'.$firstInfo->fileName.'" chmod="'.$firstInfo->mode.'"><span>'.$firstInfo->baseName.'</span></a>';
		$output .= '<ul id="off" dummy="1" style="overflow:visible; white-space: nowrap;"></ul></div>';
		$output .= "<script>dojo.addOnLoad(function(){currentFolderNode['folders'] = _('rootFolderLink');});</script>";
	}
	return $output;
}//EOF fmGetDefaultFolders

function fmGetFolders(){
	global $dir;
	$output ="";
	if(!$dir) $dir = _START_FOLDER;
	$dirs = MFile::getDir($dir,false);
	$isDir = (sizeof($dirs)>0)? true:false;
	if($isDir){
		$firstInfo = MFile::info($dir);
		foreach($dirs as $d){
			$isSub = (MFile::hasSubDir($d->fileName))? 'plus':'spacer';

			$wp ="";
			if( ! $d->isWritable){
				$wp = '<span class=\'writeProtected\'>'.MText::_("write_protected")."</span>";
			}

			$finfo = MText::_('folderpermission')." ".$d->mode.'<br>'.MText::_('owner').": ".$d->owner.'<br>'.$wp;
			$output .= '<li><div class="'.$isSub.'" droppable="folders" ></div><a href="'.MURL::_("xhrfiles",MURL::safePath($d->fileName)).'" class="closed" finfo="'.$finfo.'" url="'.MURL::safePath($d->fileName).'" chmod="'.$d->mode.'"><span>'.$d->baseName.'</span></a>';
			$output .= '<ul id="off" dummy="1"></ul></li>'."\n";
		}//EOF foreach
	}//EOF isDir
	return $output;
}//EOF gmGetFolders


function fmGetFinfo($path){
	$d = MFile::info($path);
	$wp ="";
	if( ! $d->isWritable){
		$wp = '<span class=\'writeProtected\'>'.MText::_("write_protected")."</span>";
	}
	return MText::_('folderpermission')." ".$d->mode.'<br>'.MText::_('owner').": ".$d->owner.'<br>'.$wp;
}








?>