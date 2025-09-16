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

class xhrimage extends MTask{
	
	function _default(){	
		global $dir;
		
		if(!MRights::can("open")){  
			$path = _FM_HOME_DIR. DS . "images" . DS . "noauth.png";
			$size = getimagesize($path);
			readfile($path);
			exit();
		}
		
		$size = getimagesize($dir);
		$fp = fopen($dir, "rb");
		if ($size && $fp) {
		    header("Content-type: {$size['mime']}");
		    fpassthru($fp);
		    exit;
		} else {
		    // error
		}
	}
	
	
	function _default2(){
		$this->authAndDie("open");
		global $dir;
		header("content-type: image");
		header('Content-Disposition: inline;');
		readfile($dir);
		exit();
	}
}



?>