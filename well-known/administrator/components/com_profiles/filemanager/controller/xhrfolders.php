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

class xhrfolders extends MTask{
	
	function _default(){
		$this->view->add2Content(fmGetFolders());
	}
	
	
	function remove(){
		global $dir;
		
		if($dir == _START_FOLDER){
			$this->view->add2Content("_fmError".MText::_("notforroot"));
			return;
		}
		
		if(! MRights::can("deletefolder")){
			$this->view->authError("deletefolder");
			return;
		}
		
		$status = MFile::removeDirAtAllCosts($dir);
		if(!$status){
			$this->view->add2Content("_fmError : ".$dir);		
		}else{
			$this->view->add2Content("ok");	
		}
	}
	

	function newfolder(){
	}
	
	function rename(){
		global $file;
		
		
		if(! trim(urldecode($file))){
			$this->view->add2Content("_fmError".MText::_("notforroot"));
			return;
		}
		
		if(! MRights::can("rename")){
			$this->view->authError("rename");
			return;
		}
		
		
		$file =  _START_FOLDER . urldecode($file);
		$newName = MRequest::clean("newname");
		$newName =  end(preg_split("/[\/\\,]+/", $newName));
		$info = MFile::info($file);
		$new = $info->dirName.DS.$newName;		
		if(! file_exists($new)){
			if(MFile::rename($file,$new)){
				
				$this->view->add2Content("ok");	
				return null;				
			}
			else {
				$this->view->add2Content("_fmError");	
			}
		}else{
			$this->view->add2Content("_fmError");	
		}
	}
	
	function chmod(){
		global $dir;
		
		if($dir == _START_FOLDER){
			$this->view->add2Content("_fmError".MText::_("notforroot"));
			return;
		}
		
		if(! MRights::can("chmod")){
			$this->view->authError("chmod");
			return;
		}
		
		$mode = MRequest::int('chmod',null);
		if(!$mode){
			$this->view->add2Content("_fmError");
			return null;
		}
		$status =	MFile::chmod($dir,$mode);
		if(!$status){
			$this->view->add2Content("_fmError");
		}else{
			$this->view->add2Content(fmGetFinfo($dir));	
		}		
	}
	
	function zip(){
		global $dir;
		
		if(! MRights::can("zip")){
			$this->view->authError("zip");
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
		$archive = new PclZip(_FM_TMP_DIR.DS.$zipName);
		
		$selectedFiles = $_REQUEST["selectedFiles"];
		$error= null;
		
		$status = $archive->add($dir,PCLZIP_OPT_REMOVE_PATH, $dir);
		if(file_exists($dir.DS.$zipName)){
			$error = MText::_("archive_exists");
			MFile::remove(_FM_TMP_DIR.DS.$zipName);
		}else{
			MFile::move(_FM_TMP_DIR.DS.$zipName,$dir);			
		}
		foreach($status as $item){
			if($item['status'] != "ok" && $item['status'] != "filtered"){
			$error .= ' - <b>'.$item['stored_filename'].":</b> ".MText::_($item['status']).'<br>';	
			}	
		}	
		if($error){
			$this->view->add2Content("_fmError".$error);
		}else{
		$this->view->add2Content("ok");				
		}
		
	}
	
	function newitem(){
		global $dir;
		
		if(! MRights::can("new")){
			$this->view->authError("new");
			return;
		}
		
		$name = MRequest::clean('newname',null);
		$name =  end(preg_split("/[\/\\,]+/", $name));
		$error= null;
		if(!$dir) $error .= MText::_("nodir")."<br>";
		if(!$name) $error .= MText::_("noname")."<br>";
		
		if(!$error){
		$status = @mkdir( $dir.DS.$name, 0755 );
			if($status){
				$this->view->add2Content('ok');
			}else{
				$error .= MText::_("nocreatefolder");
				$this->view->add2Content('_fmError'.$error);
			}
		}else $this->view->add2Content('_fmError'.$error);
	
	}	
	
// 	function finfo(){
// 		global $dir;
// 		$this->view->add2Content(fmGetFinfo($dir));
// 	}
	
}



?>