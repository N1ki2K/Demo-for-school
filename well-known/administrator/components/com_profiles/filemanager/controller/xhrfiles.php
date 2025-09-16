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

class xhrfiles extends MTask{
	
	function _default(){
		$this->view->add2Content(fmGetFiles());		
	}
		
	function move(){
		global $destination, $dir;
		
		if(! MRights::can("move")){
			$this->popupError("move");
			return;
		}
		
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');
		$selectedFiles = isset($_REQUEST["selectedFiles"]) ? $_REQUEST["selectedFiles"] : array();
		$singleFolder =   MRequest::filter( urldecode( MRequest::clean("singlefolder") ), MREQUEST_CLEANPATH );
		if($singleFolder) $selectedFiles = array($singleFolder);
		
		$error= null;
		$folderMove = array();
		$newURLS = array();
		$newHrefs = array();
		foreach($selectedFiles as $selectedFile){
			$baseSelectedFile = $selectedFile;
			$selectedFile = _START_FOLDER . urldecode($selectedFile);
			$selectedFile = MValidate::path($selectedFile);
			$isDir = MFile::isDir($selectedFile);
			if(! $isDir || $selectedFile != $destination){
				$e = MFile::move($selectedFile,$destination);
				if($e){
					$error .= $e."<br>".$destination;
				}else{
					if($isDir){
						array_push($folderMove, urlencode($baseSelectedFile));
						$pi = pathinfo($selectedFile);
						$newName = str_replace("\\", "/",   $destination.DS.$pi['basename'] );
						array_push($newURLS, MURL::safePath($newName));
						array_push($newHrefs, MURL::_("xhrfiles",MURL::safePath($newName)));
					}
				}
				
			}else{
				$error.= sprintf(MText::_("errormovingfolder"), $baseSelectedFile) . "<br/>";
			}
		}			
		if($error){
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
		}
		
		$movedJS = null;
		if(sizeof($folderMove)){			
			$movedJS = '<script noCache="1" data.unique="'.md5(uniqid()).'">'. "\n" .
					'var movedFolders = {destination : "'.MURL::safePath($destination) .'", folders: ["'.implode('","', $folderMove).'"], urls: ["'.implode('","', $newURLS).'"], hrefs: ["'.implode('","', $newHrefs).'"]};' ."\n" .
					'treeSortMovedFolders(movedFolders);' . "\n" .
					'</script>';
		}
		
		
		
		
		
// 		$this->view->addPreToContent($selectedFiles);
// 		$this->view->addPreToContent($folderMove);
		$this->view->add2Content(fmGetFiles(). $movedJS);
	}
	
	function copy(){
		global $destination;
		
		if(! MRights::can("copy")){
			$this->popupError("copy");
			return;
		}
		
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');
		$selectedFiles = $_REQUEST["selectedFiles"];
		$error= null;
		foreach($selectedFiles as $selectedFile){
			$basePath = $selectedFile;
			$selectedFile = _START_FOLDER . urldecode($selectedFile);
			$selectedFile = MValidate::path($selectedFile);
			$pi = pathinfo($selectedFile);
			$destinationFile = $destination.DS.$pi["basename"];
			
			if(file_exists($destinationFile)){
				$error .= MText::_("file")." <b>".$pi["basename"]."</b> ".MText::_("already_exists")."<br>";
			}else {
				if(MFile::isDir($selectedFile)){
					$error .= MText::_("folder")." <b>".$basePath."</b> ".MText::_("nofoldercopy")."<br>";
				}else{
					MFile::copy($selectedFile,$destinationFile);
					
				}
			}
		}			
		if($error){
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
		}
		$this->view->add2Content(fmGetFiles());
	}
	
	function remove(){
		
		if(! MRights::can("deletefile")){
			$this->popupError("deletefile");
			return;
		}
		
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');
		$selectedFiles = $_REQUEST["selectedFiles"];
		$error= null;
		foreach($selectedFiles as $selectedFile){
			$selectedFile = _START_FOLDER . urldecode($selectedFile);
			$selectedFile = MValidate::path($selectedFile);
			$info = MFile::info($selectedFile);
			if($info->isWritable){
				MFile::remove($selectedFile);
			}else{
				$error .= MText::_("file").": <b>".$info->baseName."</b> ".MText::_("is_wp")."<br>";
			}
		}
		if($error){
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
		}	
		$this->view->add2Content(fmGetFiles());	
	}
	
	function rename(){
		global $file;
		
		if(! MRights::can("rename")){
			$this->popupError("rename");
			return;
		}
		
		
		$file =  _START_FOLDER . urldecode($file);
		$newName = MRequest::clean("newname");
		$newName =  end(preg_split("/[\/\\,]+/", $newName));
		$info = MFile::info($file);
		$new = $info->dirName.DS.$newName;
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');		
		MFile::rename($file,$new);
		$this->view->add2Content(fmGetFiles());	
	}
	
	
	function zip(){
		global $dir;
		
		if(! MRights::can("zip")){
			$this->popupError("zip");
			return;
		}
		
		$zipName = MRequest::clean("zipname",null);
		$zipName = stripEnd(".zip",$zipName);
		$zipName = stripEnd(".ZIP",$zipName);
		if($zipName){
			$zipName .= ".zip";			
		}else{
			$zipName = "archive_".date("Y-m-d-H-i").".zip";
		}
		$archive = new PclZip($dir.DS.$zipName);
		
		$selectedFiles = $_REQUEST["selectedFiles"];
		$error= null;
		foreach($selectedFiles as $selectedFile){
			$selectedFile = _START_FOLDER . urldecode($selectedFile);
			$selectedFile = MValidate::path($selectedFile);
			$info = MFile::info($selectedFile);
			$archive->add($selectedFile,PCLZIP_OPT_REMOVE_PATH, $dir);	
		}		
		if($error){
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
		}
		$this->view->add2Content(fmGetFiles());	
		
	}
	
	function unzip(){
		global $dir,$file;
		
		if(! MRights::can("unzip")){
			$this->popupError("unzip");
			return;
		}
		
		$firstCount = MFile::countDir($dir);
		$file =  _START_FOLDER . urldecode($file);
		$info = MFile::info($file);
		$archive = new PclZip($file);
		$status = $archive->extract(PCLZIP_OPT_PATH, $dir);
		$error = "";
		foreach($status as $item){
			if($item['status'] != "ok"){
			$error .= ' - <b>'.$item['stored_filename'].":</b> ".MText::_($item['status']).'<br>';	
			}	
		}
		if($error !=""){
			$error = 'newDarkenPopup(\'error\',mText.error,\''.$error.'\',500,250);';
		}
		
		$secondCount = MFile::countDir($dir);
		$refresh = "";
		if($secondCount>$firstCount){
		$refresh = 'refreshFolder("'.MURL::safePath($dir).'"); ';	
		}
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');		
		$this->view->add2Content(fmGetFiles());	
		$this->view->add2Content('<script noCache="1">'.$refresh.$error.'</script>');
		
	}
	
	function chmod(){
		
		if(! MRights::can("chmod")){
			$this->popupError("chmod");
			return;
		}
		
		$mode = MRequest::int('chmod',null);
		
		if(!$mode){
			$error= MText::_("no_mode_set");
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
			$this->view->add2Content(fmGetFiles());	
			return false;
		}
		$this->view->add2Content('<div style="display:none;">'.md5(uniqid()).'</div>');
		$selectedFiles = $_REQUEST["selectedFiles"];
		$error= null;
		foreach($selectedFiles as $selectedFile){
			$selectedFile = _START_FOLDER . urldecode($selectedFile);
			$selectedFile = MValidate::path($selectedFile);
			$info = MFile::info($selectedFile);
			$status =	MFile::chmod($selectedFile,$mode);
			if(!$status){				
				$error .= "File: <b>".$info->baseName."</b> ".MText::_("mode_cannot_change")."<br>";
			}
		}
		if($error){
			$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
			$error.'\',500,250);</script>');
		}	
		$this->view->add2Content(fmGetFiles());		
	}

	function newitem(){
		global $dir;
		
		if(! MRights::can("new")){
			$this->view->authError("new");
// 			$this->popupError("new");
			return;
		}
		
		$name = MRequest::clean('newname',null);
		$name =  end(preg_split("/[\/\\,]+/", $name));
		$error= null;
		if(!$dir) $error .= MText::_("nodir")."<br>";
		if(!$name) $error .= MText::_("noname")."<br>";
		
		if(!$error){
		$status = fopen($dir.DS.$name, 'w');
			if($status){
				fwrite($status, pack("CCC",0xef,0xbb,0xbf));
				fwrite($status," ");
				fclose($status);
				$this->view->add2Content('ok');
			}else{
				$this->view->add2Content('_fmError'.$error);
			}
		}else $this->view->add2Content('_fmError'.$error);
	
	}
	
	
	protected function popupError($rule= null){
		$errorText = '<div class="mPopupAuthError">' .($rule ? MRights::getError($rule,1) : MText::_("noauth") ) .'</div>';		
		$this->view->add2Content('<script noCache="1">newDarkenPopup(\'error\',mText.error,\''.
				$errorText.'\',500,150);</script>');
		$this->view->add2Content(fmGetFiles());
	}
	
	
	
	
	
	
}//EOF class



?>