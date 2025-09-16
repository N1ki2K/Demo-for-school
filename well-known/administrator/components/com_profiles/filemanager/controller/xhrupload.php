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

class xhrupload extends MTask{
	
	public function _default(){
		global $dir;
		$this->view->add2Content('<iframe src="'.MURL::_("xhrupload",MURL::safePath($dir),"iframe").'" style="border:none; width:100%;height:300px;" frameborder="0" ></iframe>');
	}
	
	
	public function iframe($error=null){
		
		if(! MRights::can("upload")){
			return $this->_noAuth("upload");
		}
		
		global $dir;
		$template = null;
		if(file_exists(_FM_HOME_DIR.DS.'templates'.DS."upload.php")){
		    	$template = _FM_HOME_DIR.DS.'templates'.DS."upload.php";
		    	$arg = array("dir"=>$dir,"error"=>$error);
		    	$this->view->add2Content(MTemplater::get($template,$arg));
		 }else{
		 	$this->view->add2Content("Error: No upload template!");
		 }
	}
	

	public function upload(){
		if(! MRights::can("upload")){
			return $this->_noAuth("upload");
		}
		
		global $dir;
		$maxSize =  MRoots::getMaxUploadSize();
		
		$maxSizeFormatted = MRoots::getMaxUploadSize(1);
		$files = $_FILES['files'];
				
		if(!$files){
			$this->iframe(MText::_("up_too_large"));
			return null;	
		}
		
		// Get the number of upload fields
		$rows = (int)  MConfig::instance()->get("max_upload_fields",6);
		
		// Check if empty
		$isEmpty = true;
		for($t=0; $t< $rows; $t++){
			if(!  empty($files["name"][$t])){
				$isEmpty = false;
				break;
			}
		}
		
		$error = (!$isEmpty) ? null : MText::_("nouploadfilesselected");
		for($t=0; $t< $rows; $t++){
			
			if(! empty($files["name"][$t])){
				if($files['size'][$t]<= $maxSize){
					$fileName = $dir.DS.$files['name'][$t];
					$upload = move_uploaded_file($files['tmp_name'][$t], $fileName);
					if(!$upload){
						$error.= MText::_("couldntupload").": ".$files['name'][$t]."<br>";
					}else{
						if(isset($_REQUEST["unzip"][$t]) && ! empty($_REQUEST["unzip"][$t])){
							$archive = new PclZip($fileName);
							$status = $archive->extract(PCLZIP_OPT_PATH, $dir);
							foreach($status as $item){
								if($item['status'] != "ok"){
									$error .= ' - <b>'.$item['stored_filename'].":</b> ".MText::_($item['status']).'<br>';	
								}	
							}//EOF foreach status
							
							//Remove archive
							MFile::remove($fileName);
						}
					} 		
				}else{
						$error.= MText::_("couldntupload").": ".$files['name'][$t]." -> ".MText::_("filetoolarge")." ".$maxSizeFormatted."<br>";
					}
			}
		}
		
		
		$template = null;
		if(file_exists(_FM_HOME_DIR.DS.'templates'.DS."afterupload.php")){
		    	$template = _FM_HOME_DIR.DS.'templates'.DS."afterupload.php";
		    	$arg = array("dir"=>$dir,"error"=>$error);
		    	
		    	$this->view->add2Content(MTemplater::get($template,$arg));
		 }else{
		 	$this->view->add2Content("Error: No after upload template!");
		 }
	}
	
	public function xhr(){
		if(! MRights::can("upload")){
			return $this->view->authError("upload");
		}
		
		global $dir;
		$size = MRequest::int("size", null);
		if($size === null) return;
		
// 		print_r($_SERVER); die();
		
		$fn = (isset($_SERVER['HTTP_X_FILENAME']) ? MRequest::filter( $_SERVER['HTTP_X_FILENAME'], MREQUEST_STRING ) : false);
		if(!$fn) return null;
		
		$fileName = $dir.DS.$fn;
		
		file_put_contents(
				$fileName,
				file_get_contents('php://input')
		);
		
		// Delete on abbort
			if(MFile::getSize($fileName) != $size){
				MFile::remove($fileName);				
			}
	
		$this->view->add2Content("ok");
	}
	
	
	protected function _noAuth($rule=null){
		$this->view->content('
				<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody>
				<tr>
					<td align="center" valign="middle">
						<span style="font-family: Trebuchet MS, Tahoma, Arial, sans-serif;font-size: 18px; font-weight: bold;">
							'. MRights::getError($rule,1).'
						</span>
					</td>
				</tr>
				</tbody></table>
				');
	}
	
	
}

